import { useRef, type ReactNode } from 'react'
import './Carousel.css'

/** Fallback image used when an item provides no imageUrl/imageAltUrl. */
const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/320x200?text=No+Image'

export type CarouselItem = {
  /** Heading shown beneath the card content. */
  title: string
  /** Primary image URL. */
  imageUrl?: string
  /** Fallback image URL; defaults to a placeholder when omitted. */
  imageAltUrl?: string
  /** Text content, shown when the item has no image. */
  text?: string
}

export type CarouselProps = {
  /** The list of objects to display. */
  items: CarouselItem[]
  /** Accessible label for the carousel region. */
  ariaLabel?: string
}

/** A reusable horizontally-scrolling carousel. */
function Carousel({ items, ariaLabel = 'Carousel' }: CarouselProps): ReactNode {
  const trackRef = useRef<HTMLUListElement>(null)

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    // Scroll by roughly one card's width so each click advances cleanly.
    const card = track.querySelector<HTMLElement>('.carousel-card')
    const amount = card ? card.offsetWidth + 16 : track.clientWidth * 0.8
    track.scrollBy({ left: amount * direction, behavior: 'smooth' })
  }

  if (items.length === 0) return null

  return (
    <section className="carousel" aria-label={ariaLabel}>
      <button
        type="button"
        className="carousel-arrow carousel-arrow--prev"
        aria-label="Previous"
        onClick={() => scrollByCard(-1)}
      >
        ‹
      </button>

      <ul className="carousel-track" ref={trackRef}>
        {items.map((item, index) => (
          <li className="carousel-card" key={index}>
            {item.text != null ? (
              <div className="carousel-card-text">{item.text}</div>
            ) : (
              <img
                className="carousel-card-image"
                src={item.imageUrl ?? item.imageAltUrl ?? PLACEHOLDER_IMAGE_URL}
                alt={item.title}
              />
            )}
            <p className="carousel-card-title">{item.title}</p>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="carousel-arrow carousel-arrow--next"
        aria-label="Next"
        onClick={() => scrollByCard(1)}
      >
        ›
      </button>
    </section>
  )
}

export default Carousel
