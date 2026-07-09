import { useEffect, useState, type ReactNode } from 'react'
import './Lightbox.css'
import { LightboxOverlay } from './LightboxOverlay'

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

  const element = image ? (
    <LightboxOverlay image={image} onClose={close} />
  ) : null

  return { open: setImage, close, element }
}
