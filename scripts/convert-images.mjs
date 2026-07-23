// Converts raster images under src/assets to optimized WebP.
//
// Usage: npm run images
//
// - Recursively finds .png / .jpg / .jpeg / .heic / .heif files under
//   src/assets.
// - Downscales to a sensible max width per use (cards vs. full-width map),
//   never upscaling, then encodes as WebP.
// - Writes a .webp next to each source and leaves the original in place
//   (delete originals once imports are repointed).
//
// HEIC note: sharp's prebuilt libheif can parse HEIC metadata but can't decode
// the HEVC-encoded pixels (no bundled HEVC decoder). So .heic/.heif are first
// decoded to a JPEG buffer via heic-convert (which bundles libde265), then
// handed to sharp for the same resize/encode path as everything else.

import { readdir, stat, readFile } from 'node:fs/promises'
import { join, extname, dirname, basename, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import heicConvert from 'heic-convert'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const ASSETS_DIR = join(ROOT, 'src', 'assets')
const RASTER_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg'])
const HEIC_EXTENSIONS = new Set(['.heic', '.heif'])
const SOURCE_EXTENSIONS = new Set([...RASTER_EXTENSIONS, ...HEIC_EXTENSIONS])
const QUALITY = 80

// Max width (px) by asset folder. Cards render small, so 720px covers 2x
// retina; the locations map spans the full content width.
function maxWidthFor(path) {
  if (path.includes(`${join('src', 'assets')}/locations`)) return 1920
  if (/[/\\](games|jukeboxes|pool_tables)[/\\]/.test(path)) return 720
  return 1280
}

// Return a sharp instance for a source file, decoding HEIC/HEIF via
// heic-convert first (see the HEIC note at the top).
async function loadImage(file, ext) {
  if (HEIC_EXTENSIONS.has(ext)) {
    const jpeg = await heicConvert({
      buffer: await readFile(file),
      format: 'JPEG',
      quality: 1, // 0..1; keep the intermediate lossless-ish, WebP does the trim
    })
    return sharp(Buffer.from(jpeg))
  }
  return sharp(file)
}

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} KB`

let totalBefore = 0
let totalAfter = 0

for await (const file of walk(ASSETS_DIR)) {
  const ext = extname(file).toLowerCase()
  if (!SOURCE_EXTENSIONS.has(ext)) continue

  const out = join(dirname(file), `${basename(file, extname(file))}.webp`)
  const before = (await stat(file)).size

  const image = await loadImage(file, ext)
  await image
    // Honor EXIF orientation (iPhone HEICs are often rotated) before resizing.
    .rotate()
    .resize({ width: maxWidthFor(file), withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(out)

  const after = (await stat(out)).size
  totalBefore += before
  totalAfter += after

  const pct = (100 * (1 - after / before)).toFixed(0)
  console.log(
    `${relative(ROOT, file)}  ${kb(before)} -> ${kb(after)}  (-${pct}%)`,
  )
}

console.log(
  `\nTotal: ${kb(totalBefore)} -> ${kb(totalAfter)} ` +
    `(-${(100 * (1 - totalAfter / totalBefore)).toFixed(0)}%)`,
)
