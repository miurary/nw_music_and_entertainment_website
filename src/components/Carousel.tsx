import { useEffect, useRef, useState, type ReactNode } from 'react'
import './Carousel.css'
import type { CardItem } from '../utils/types'

/** Fallback image used when an item provides no imageUrl/imageAltUrl. */
const PLACEHOLDER_IMAGE_URL = 'https://placehold.co/640x480?text=No+Image'

/** Resolve an item's best available image source. */
function srcOf(item: CardItem): string {
  return item.imageUrl ?? item.imageAltUrl ?? PLACEHOLDER_IMAGE_URL
}

export type CarouselProps = {
  /** The items to display. Uses each item's image and title. */
  items: CardItem[]
  /**
   * "hero" — one large auto-advancing photo with arrows and dot indicators.
   * "filmstrip" — a continuously scrolling reel of every item.
   */
  variant?: 'hero' | 'filmstrip'
  /** Accessible label for the carousel region. */
  ariaLabel?: string
  /** Hero only: auto-advance interval in ms. Pass 0 to disable autoplay. */
  interval?: number
}

/** Reduced-motion preference, checked once per mount (no live updates needed). */
function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * A photo carousel with two looks that share the site's brushed-metal framing:
 * a large "hero" slideshow, or a continuously scrolling "filmstrip" reel. Both
 * put a blurred copy of each photo behind it so off-shape images have no flat
 * dead area in the frame.
 */
function Carousel({
  items,
  variant = 'hero',
  ariaLabel = 'Photo showcase',
  interval = 3500,
}: CarouselProps): ReactNode {
  if (items.length === 0) return null
  return variant === 'filmstrip' ? (
    <Filmstrip items={items} ariaLabel={ariaLabel} />
  ) : (
    <Hero items={items} ariaLabel={ariaLabel} interval={interval} />
  )
}

/** Blurred fill + contained photo, shared by both variants. */
function Framed({ item }: { item: CardItem }): ReactNode {
  const src = srcOf(item)
  return (
    <>
      <div
        className="carousel-blur"
        style={{ backgroundImage: `url(${src})` }}
        aria-hidden="true"
      />
      <img className="carousel-image" src={src} alt={item.title} loading="lazy" />
    </>
  )
}

function Hero({
  items,
  ariaLabel,
  interval,
}: {
  items: CardItem[]
  ariaLabel: string
  interval: number
}): ReactNode {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const count = items.length
  const go = (n: number) => setIndex((n + count) % count)

  // Auto-advance unless paused (hover/focus), a single item, autoplay disabled,
  // or the visitor prefers reduced motion.
  useEffect(() => {
    if (paused || count < 2 || interval <= 0 || prefersReducedMotion()) return
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count)
    }, interval)
    return () => window.clearInterval(id)
  }, [paused, count, interval])

  return (
    <div
      className="carousel-hero"
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="carousel-stage">
        {items.map((item, i) => (
          <div
            className={'carousel-slide' + (i === index ? ' is-active' : '')}
            key={i}
            aria-hidden={i === index ? undefined : true}
          >
            <Framed item={item} />
            <div className="carousel-caption">
              <span className="carousel-caption-diamond" aria-hidden="true">
                &#x25C6;
              </span>
              {item.title}
            </div>
          </div>
        ))}

        {count > 1 && (
          <>
            <button
              type="button"
              className="carousel-arrow carousel-prev"
              aria-label="Previous photo"
              onClick={() => go(index - 1)}
            >
              &#8249;
            </button>
            <button
              type="button"
              className="carousel-arrow carousel-next"
              aria-label="Next photo"
              onClick={() => go(index + 1)}
            >
              &#8250;
            </button>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="carousel-dots" role="tablist" aria-label="Choose photo">
          {items.map((item, i) => (
            <button
              type="button"
              key={i}
              className={'carousel-dot' + (i === index ? ' is-active' : '')}
              aria-label={`Show ${item.title}`}
              aria-selected={i === index}
              role="tab"
              onClick={() => go(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function Filmstrip({
  items,
  ariaLabel,
}: {
  items: CardItem[]
  ariaLabel: string
}): ReactNode {
  const maskRef = useRef<HTMLDivElement>(null)

  // The reel is the item list rendered twice so the CSS translateX(-50%) loop
  // is seamless. The duplicate copy is decorative, so it's aria-hidden.
  return (
    <div
      className="carousel-filmstrip"
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div className="carousel-reel-mask" ref={maskRef}>
        <div className="carousel-reel">
          {items.map((item, i) => (
            <figure className="carousel-cell" key={i}>
              <div className="carousel-cell-frame">
                <Framed item={item} />
              </div>
              <figcaption className="carousel-cell-label">{item.title}</figcaption>
            </figure>
          ))}
          {items.map((item, i) => (
            <figure className="carousel-cell" key={`dup-${i}`} aria-hidden="true">
              <div className="carousel-cell-frame">
                <Framed item={item} />
              </div>
              <figcaption className="carousel-cell-label">{item.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Carousel
