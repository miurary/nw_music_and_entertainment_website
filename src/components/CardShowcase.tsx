import { useEffect, useRef, type ReactNode } from 'react'
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

  if (items.length === 0) return null

  return (
    <ul className="spec-showcase" aria-label={ariaLabel} ref={listRef}>
      {items.map((item, index) => (
        <li className="spec-row" key={index}>
          <figure className="spec-photo">
            {item.text != null ? (
              <div className="spec-photo-text">{item.text}</div>
            ) : (
              <img
                className="spec-photo-image"
                src={item.imageUrl ?? item.imageAltUrl ?? PLACEHOLDER_IMAGE_URL}
                alt={item.title}
                loading="lazy"
              />
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
          </div>
        </li>
      ))}
    </ul>
  )
}

export default CardShowcase
