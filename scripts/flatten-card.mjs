// Flatten the business-card photo into a straight rectangular banner by
// applying a 4-point perspective (homography) warp. Sharp only does affine,
// so we solve the homography ourselves and bilinearly sample the source.
//
//   node scripts/flatten-card.mjs
//
// Output: src/assets/card-banner.webp (perspective-corrected, deskewed card).

import sharp from 'sharp'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(root, 'src/assets/card.jfif')
const OUT = join(root, 'src/assets/card-banner.webp')

// Card corners in the source photo (px). Inset a few px so we don't pick up
// the wall/drop-shadow along the cut edge.
const SRC_QUAD = [
  [94, 264], // top-left
  [1929, 301], // top-right
  [1887, 1329], // bottom-right
  [116, 1349], // bottom-left
]

// Flattened output size; ~1.75 keeps the true business-card proportion.
const OUT_W = 1820
const OUT_H = 1040

/** Solve an 8x8 linear system via Gaussian elimination with partial pivot. */
function solve8(A, b) {
  const n = 8
  for (let col = 0; col < n; col++) {
    let piv = col
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(A[r][col]) > Math.abs(A[piv][col])) piv = r
    }
    ;[A[col], A[piv]] = [A[piv], A[col]]
    ;[b[col], b[piv]] = [b[piv], b[col]]
    const d = A[col][col]
    for (let j = col; j < n; j++) A[col][j] /= d
    b[col] /= d
    for (let r = 0; r < n; r++) {
      if (r === col) continue
      const f = A[r][col]
      if (f === 0) continue
      for (let j = col; j < n; j++) A[r][j] -= f * A[col][j]
      b[r] -= f * b[col]
    }
  }
  return b
}

/**
 * Homography mapping destination (dx,dy) -> source (sx,sy), built from the
 * four dest-rect corners and the four source-quad corners.
 */
function buildHomography(dst, src) {
  const A = []
  const b = []
  for (let i = 0; i < 4; i++) {
    const [x, y] = dst[i]
    const [u, v] = src[i]
    A.push([x, y, 1, 0, 0, 0, -u * x, -u * y])
    b.push(u)
    A.push([0, 0, 0, x, y, 1, -v * x, -v * y])
    b.push(v)
  }
  const [a, bb, c, d, e, f, g, h] = solve8(A, b)
  return (x, y) => {
    const w = g * x + h * y + 1
    return [(a * x + bb * y + c) / w, (d * x + e * y + f) / w]
  }
}

const run = async () => {
  const img = sharp(SRC)
  const { width, height } = await img.metadata()
  const { data, info } = await img
    .raw()
    .toBuffer({ resolveWithObject: true })
  const ch = info.channels

  const dstQuad = [
    [0, 0],
    [OUT_W - 1, 0],
    [OUT_W - 1, OUT_H - 1],
    [0, OUT_H - 1],
  ]
  const map = buildHomography(dstQuad, SRC_QUAD)

  const out = Buffer.alloc(OUT_W * OUT_H * 3)

  for (let y = 0; y < OUT_H; y++) {
    for (let x = 0; x < OUT_W; x++) {
      const [sx, sy] = map(x, y)
      // Bilinear sample of the source at (sx, sy), clamped to bounds.
      const x0 = Math.max(0, Math.min(width - 1, Math.floor(sx)))
      const y0 = Math.max(0, Math.min(height - 1, Math.floor(sy)))
      const x1 = Math.min(width - 1, x0 + 1)
      const y1 = Math.min(height - 1, y0 + 1)
      const fx = sx - x0
      const fy = sy - y0
      const o = (y * OUT_W + x) * 3
      for (let c = 0; c < 3; c++) {
        const p00 = data[(y0 * width + x0) * ch + c]
        const p10 = data[(y0 * width + x1) * ch + c]
        const p01 = data[(y1 * width + x0) * ch + c]
        const p11 = data[(y1 * width + x1) * ch + c]
        const top = p00 + (p10 - p00) * fx
        const bot = p01 + (p11 - p01) * fx
        out[o + c] = Math.round(top + (bot - top) * fy)
      }
    }
  }

  await sharp(out, { raw: { width: OUT_W, height: OUT_H, channels: 3 } })
    .webp({ quality: 88 })
    .toFile(OUT)

  console.log(`Wrote ${OUT} (${OUT_W}x${OUT_H})`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
