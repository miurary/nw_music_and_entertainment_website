import { type ReactNode } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import AutoScroll from 'embla-carousel-auto-scroll'
import './Carousel.css'
import { useLightbox } from './Lightbox'
import type { CardItem } from '../utils/types'

/** Fallback image used when an item provides no imageUrl/imageAltUrl. */
const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/640x480?text=No+Image'

/** Resolve an item's best available image source. */
function srcOf(item: CardItem): string {
  return item.imageUrl ?? item.imageAltUrl ?? PLACEHOLDER_IMAGE_URL
}

/** Cell sizing must match .carousel-cell in Carousel.css: content width plus
    the per-cell spacing, used to convert `interval` into a scroll speed. */
const CELL_TOTAL_WIDTH_PX = 240 + 16

/** After the visitor stops interacting, wait this long before the auto-scroll
    resumes so it doesn't fight the tail end of a drag or fling. */
const RESUME_DELAY_MS = 1200

export type CarouselProps = {
  /** The items to display. Uses each item's image and title. */
  items: CardItem[]
  /** Accessible label for the carousel region. */
  ariaLabel?: string
  /** Auto-scroll pace: one cell width per `interval` ms. Pass 0 to disable. */
  interval?: number
}

/** Reduced-motion preference, checked once per mount (no live updates needed). */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

/** Embla's AutoScroll speed is px per ~60fps frame; ours is one cell per
    `interval` ms. */
function speedFor(interval: number): number {
  return (CELL_TOTAL_WIDTH_PX * (1000 / 60)) / interval
}

/**
 * A continuously drifting filmstrip of photos in the site's brushed-metal
 * framing, built on Embla. Loops seamlessly in both directions, drags/flings
 * naturally on mouse and touch, and resumes its drift shortly after the
 * visitor lets go. Clicking a photo opens it in the shared fullscreen
 * lightbox; Embla suppresses the click that trails a drag, so dragging never
 * accidentally opens one. A blurred copy of each photo fills its frame so
 * off-shape images have no flat dead area.
 */
function Carousel({
  items,
  ariaLabel = 'Photo showcase',
  interval = 3500,
}: CarouselProps): ReactNode {
  const lightbox = useLightbox()

  const autoScroll =
    interval > 0 && items.length > 1 && !prefersReducedMotion()
  const [viewportRef] = useEmblaCarousel(
    { loop: true, dragFree: true, skipSnaps: true },
    autoScroll
      ? [
          AutoScroll({
            speed: speedFor(interval),
            startDelay: RESUME_DELAY_MS,
            // Resume the drift after every interaction instead of stopping
            // for good the first time the visitor touches the reel.
            stopOnInteraction: false,
          }),
        ]
      : [],
  )

  if (items.length === 0) return null

  return (
    <div
      className="carousel-filmstrip"
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div className="carousel-viewport" ref={viewportRef}>
        <div className="carousel-reel">
          {items.map((item, i) => (
            <figure className="carousel-cell" key={i}>
              <button
                type="button"
                className="carousel-cell-frame"
                aria-label={`View a larger image of ${item.title}`}
                onClick={() =>
                  lightbox.open({ src: srcOf(item), alt: item.title })
                }
              >
                {/* A blurred, darkened copy of the same photo fills the
                    letterbox space so off-shape images have no flat dead
                    area behind them. */}
                <div
                  className="carousel-blur"
                  style={{ backgroundImage: `url(${srcOf(item)})` }}
                  aria-hidden="true"
                />
                <img
                  className="carousel-image"
                  src={srcOf(item)}
                  alt={item.title}
                  loading="lazy"
                />
              </button>
              <figcaption className="carousel-cell-label">
                {item.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      {lightbox.element}
    </div>
  )
}

export default Carousel
