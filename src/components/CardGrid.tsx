import { type ReactNode } from 'react'
import './CardGrid.css'
import type { CardItem } from '../utils/types'

/** Fallback image used when an item provides no imageUrl/imageAltUrl. */
const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/320x200?text=No+Image'

export type CardGridProps = {
  /** The list of objects to display. */
  items: CardItem[]
  /** Accessible label for the grid region. */
  ariaLabel?: string
  /** Minimum width of each card, in pixels. Cards fill the row and wrap. Defaults to 240. */
  minCardWidth?: number
}

/** A reusable responsive grid of image/text cards that fills its container. */
function CardGrid({
  items,
  ariaLabel = 'Card grid',
  minCardWidth = 240,
}: CardGridProps): ReactNode {
  if (items.length === 0) return null

  return (
    <ul
      className="card-grid"
      aria-label={ariaLabel}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minCardWidth}px, 1fr))`,
      }}
    >
      {items.map((item, index) => (
        <li className="card-grid-card" key={index}>
          {item.text != null ? (
            <div className="card-grid-card-text">{item.text}</div>
          ) : (
            <img
              className="card-grid-card-image"
              src={item.imageUrl ?? item.imageAltUrl ?? PLACEHOLDER_IMAGE_URL}
              alt={item.title}
            />
          )}
          <p className="card-grid-card-title">{item.title}</p>
        </li>
      ))}
    </ul>
  )
}

export default CardGrid
