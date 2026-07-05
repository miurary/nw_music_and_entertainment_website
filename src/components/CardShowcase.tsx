import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import './CardShowcase.css'
import type { CardItem } from '../utils/types'

/** Fallback image used when an item provides no imageUrl/imageAltUrl. */
const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/640x480?text=No+Image'

export type CardShowcaseProps = {
  /** The list of objects to display. */
  items: CardItem[]
  /** Accessible label for the list region. */
  ariaLabel?: string
  /** Small category label shown above each item's name (e.g. "Jukebox"). */
  kicker?: string
}

/**
 * An alternating "spec plate" showcase: each item is a full-width row with a
 * framed photo on one side and an engraved brushed-metal plate on the other,
 * sides alternating down the page. On narrow screens every row collapses to a
 * single stacked column (photo above plate). Reads as an equipment catalog and
 * looks deliberate even with only a couple of items.
 */
function CardShowcase({
  items,
  ariaLabel = 'Equipment',
  kicker,
}: CardShowcaseProps): ReactNode {
  const listRef = useRef<HTMLUListElement>(null)
  // The image currently shown fullscreen, or null when the lightbox is closed.
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(
    null,
  )

  // Reveal each row as it scrolls into view.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const rows = Array.from(list.querySelectorAll('.spec-row'))
    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            obs.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
    )
    rows.forEach((row) => io.observe(row))
    return () => io.disconnect()
  }, [items])

  // While the lightbox is open, lock page scroll and let Escape close it.
  useEffect(() => {
    if (!lightbox) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [lightbox])

  if (items.length === 0) return null

  return (
    <>
    <ul className="spec-showcase" aria-label={ariaLabel} ref={listRef}>
      {items.map((item, index) => (
        <li className="spec-row" key={index}>
          <figure className="spec-photo">
            {item.text != null ? (
              <div className="spec-photo-text">{item.text}</div>
            ) : (
              (() => {
                const src =
                  item.imageUrl ?? item.imageAltUrl ?? PLACEHOLDER_IMAGE_URL
                return (
                  <button
                    type="button"
                    className="spec-photo-frame"
                    onClick={() => setLightbox({ src, alt: item.title })}
                    aria-label={`View a larger image of ${item.title}`}
                  >
                    {/* A blurred, darkened copy of the same photo fills the
                        letterbox space so off-shape images have no flat dead
                        area behind them. */}
                    <div
                      className="spec-photo-blur"
                      style={{ backgroundImage: `url(${src})` }}
                      aria-hidden="true"
                    />
                    <img
                      className="spec-photo-image"
                      src={src}
                      alt={item.title}
                      loading="lazy"
                    />
                  </button>
                )
              })()
            )}
          </figure>
          <div className="spec-plate">
            {kicker && (
              <p className="spec-kicker">
                <span className="spec-kicker-diamond" aria-hidden="true">
                  &#x25C6;
                </span>
                {kicker}
              </p>
            )}
            <h3 className="spec-title">{item.title}</h3>
            <span className="spec-rule" aria-hidden="true" />
            {item.details && <p className="spec-details">{item.details}</p>}
            {item.dimensions && <p className="spec-details">{item.dimensions}</p>}
            {item.weight && <p className="spec-details">{item.weight}</p>}
          </div>
        </li>
      ))}
    </ul>

    {lightbox &&
      createPortal(
        <div
          className="lightbox-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label={`Full-size image of ${lightbox.alt}`}
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            className="lightbox-close"
            aria-label="Close image"
            onClick={() => setLightbox(null)}
            autoFocus
          >
            &times;
          </button>
          {/* Tapping anywhere (backdrop or image) closes; the image is inside
              the backdrop so the click bubbles up. */}
          <img
            className="lightbox-image"
            src={lightbox.src}
            alt={lightbox.alt}
          />
        </div>,
        document.body,
      )}
    </>
  )
}

export default CardShowcase
