import { useRef, useState, type ReactNode, type TouchEvent } from 'react'
import { createPortal } from 'react-dom'
import type { LightboxImage } from './Lightbox'

/** Vertical swipe distance (px) past which releasing dismisses the lightbox. */
const SWIPE_DISMISS_PX = 110

/**
 * The fullscreen lightbox overlay. Clicking anywhere (backdrop, image, or the
 * close button) dismisses it. On touch, a vertical swipe drags the image with
 * your finger and fades the backdrop; releasing past the threshold closes it,
 * otherwise it snaps back.
 */
export function LightboxOverlay({
  image,
  onClose,
}: {
  image: LightboxImage
  onClose: () => void
}): ReactNode {
  const [offset, setOffset] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startY = useRef<number | null>(null)
  const startX = useRef(0)
  // Live copy of the offset so touchend reads the final value, not a stale
  // render's closure.
  const offsetRef = useRef(0)
  // True once a gesture is clearly a vertical swipe, so the trailing synthetic
  // click doesn't also fire and close a lightbox that just snapped back.
  const swiped = useRef(false)

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length !== 1) return
    startY.current = e.touches[0].clientY
    startX.current = e.touches[0].clientX
    swiped.current = false
    setDragging(true)
  }

  const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (startY.current === null) return
    const dy = e.touches[0].clientY - startY.current
    const dx = e.touches[0].clientX - startX.current
    if (Math.abs(dy) > 8 && Math.abs(dy) >= Math.abs(dx)) swiped.current = true
    offsetRef.current = dy
    setOffset(dy)
  }

  const endTouch = () => {
    if (startY.current === null) return
    startY.current = null
    setDragging(false)
    if (Math.abs(offsetRef.current) > SWIPE_DISMISS_PX) {
      onClose()
      return
    }
    offsetRef.current = 0
    setOffset(0)
  }

  const onClick = () => {
    if (swiped.current) {
      swiped.current = false
      return
    }
    onClose()
  }

  // Fade the backdrop as the image is dragged away.
  const fade = Math.min(Math.abs(offset) / 600, 0.55)

  return createPortal(
    <div
      className="lightbox-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`Full-size image of ${image.alt}`}
      style={{
        opacity: 1 - fade,
        transition: dragging ? 'none' : 'opacity 0.25s ease',
      }}
      onClick={onClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={endTouch}
      onTouchCancel={endTouch}
    >
      <button
        type="button"
        className="lightbox-close"
        aria-label="Close image"
        onClick={onClose}
        autoFocus
      >
        &times;
      </button>
      <img
        className="lightbox-image"
        src={image.src}
        alt={image.alt}
        style={{
          transform: `translateY(${offset}px)`,
          transition: dragging ? 'none' : 'transform 0.25s ease',
        }}
      />
    </div>,
    document.body,
  )
}
