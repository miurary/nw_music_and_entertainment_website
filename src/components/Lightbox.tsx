import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import './Lightbox.css'

export type LightboxImage = { src: string; alt: string }

/**
 * Shared fullscreen image lightbox. Call `open(image)` to show a photo; render
 * the returned `element` somewhere in your tree. While open it locks page
 * scroll and closes on Escape — identical behavior everywhere it's used.
 */
export function useLightbox(): {
  open: (image: LightboxImage) => void
  close: () => void
  element: ReactNode
} {
  const [image, setImage] = useState<LightboxImage | null>(null)
  const close = () => setImage(null)

  // While the lightbox is open, lock page scroll and let Escape close it.
  useEffect(() => {
    if (!image) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setImage(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [image])

  // The overlay is built inline (rather than as its own component) so this
  // file exports only the hook, which keeps React Fast Refresh happy. Clicking
  // anywhere — backdrop, image, or the close button — dismisses it.
  const element = image
    ? createPortal(
        <div
          className="lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Full-size image of ${image.alt}`}
          onClick={close}
        >
          <button
            type="button"
            className="lightbox-close"
            aria-label="Close image"
            onClick={close}
            autoFocus
          >
            &times;
          </button>
          <img className="lightbox-image" src={image.src} alt={image.alt} />
        </div>,
        document.body,
      )
    : null

  return { open: setImage, close, element }
}
