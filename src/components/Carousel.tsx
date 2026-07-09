import { useEffect, useRef, useState, type ReactNode } from 'react'
import './Carousel.css'
import { useLightbox } from './Lightbox'
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
    <Filmstrip items={items} ariaLabel={ariaLabel} interval={interval} />
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

/** Copies of the item list rendered side by side so the scroll can wrap
    seamlessly in either direction. Three is the minimum that keeps content on
    both sides of the middle copy at every wrap point. */
const REEL_COPIES = 3

/** After the visitor stops touching the reel, wait this long before the
    auto-scroll takes over again so it doesn't fight trackpad/wheel momentum. */
const RESUME_DELAY_MS = 1200

/** A mouse pointer that moves more than this (px) between press and release is
    treated as a drag, so the click that follows doesn't also open the lightbox. */
const DRAG_THRESHOLD_PX = 6

/** Our own scrollLeft writes land within a pixel of the accumulator (the
    browser only rounds); any larger divergence means the visitor — or their
    fling's momentum — is driving the scroll. */
const EXTERNAL_SCROLL_EPSILON_PX = 2

/** How long scroll events must go quiet before we consider a native scroll
    (touch pan / momentum fling / trackpad inertia) settled. */
const SCROLL_SETTLE_MS = 200

function Filmstrip({
  items,
  ariaLabel,
  interval,
}: {
  items: CardItem[]
  ariaLabel: string
  interval: number
}): ReactNode {
  const scrollRef = useRef<HTMLDivElement>(null)
  const reelRef = useRef<HTMLDivElement>(null)
  // Set true while a mouse drag is in progress so the trailing click is ignored
  // instead of opening the lightbox. Read by each cell's onClick.
  const draggedRef = useRef(false)
  const lightbox = useLightbox()

  useEffect(() => {
    const scroller = scrollRef.current
    const reel = reelRef.current
    if (!scroller || !reel) return

    // Width of a single copy of the list; the wrap keeps scrollLeft inside the
    // middle copy's band [oneSet, 2*oneSet) so there's always a copy to either
    // side. Re-measured on resize since cell widths can change.
    let oneSet = reel.scrollWidth / REEL_COPIES
    const measure = () => {
      oneSet = reel.scrollWidth / REEL_COPIES
    }

    // Start in the middle copy so the very first drag/scroll left has content.
    scroller.scrollLeft = oneSet

    // Drag state is declared before wrap() so wrap can keep the drag anchor in
    // sync when it shifts scrollLeft mid-drag (see below).
    let pointerDown = false
    let dragging = false
    let startX = 0
    let startLeft = 0
    let activePointerId = -1

    // Auto-scroll accumulates position in this float. The browser rounds
    // scrollLeft to a whole pixel, so if we read it back each frame every
    // sub-pixel step (any interval that works out to < ~1px/frame) would be
    // rounded away and the reel would sit frozen. Owning the fractional
    // position lets those small steps add up. While the visitor is driving,
    // pos just tracks the real scrollLeft so auto-scroll resumes from there.
    // It also serves as "where we last put it" for external-scroll detection.
    let pos = scroller.scrollLeft

    const wrap = () => {
      if (oneSet <= 0) return
      let shift = 0
      if (scroller.scrollLeft >= oneSet * 2) shift = -oneSet
      else if (scroller.scrollLeft < oneSet) shift = oneSet
      if (shift !== 0) {
        scroller.scrollLeft += shift
        // Shift the accumulator too so the external-scroll check in onScroll
        // doesn't mistake the wrap jump for the visitor driving.
        pos += shift
        // Keep a long in-progress drag continuous across the wrap point.
        if (dragging) startLeft += shift
      }
    }

    const reduce = prefersReducedMotion()
    // px/ms so that one cell scrolls past every `interval` ms — the same "one
    // step per interval" cadence the hero uses. Disabled for reduced motion or
    // interval <= 0; the reel is still draggable in those cases.
    const velocity = () =>
      interval > 0 && !reduce ? oneSet / items.length / interval : 0

    let lastTouch = -Infinity
    const touch = () => {
      lastTouch = performance.now()
    }

    let raf = 0
    let prev = performance.now()
    const tick = (t: number) => {
      const dt = t - prev
      prev = t
      const idle = !dragging && t - lastTouch >= RESUME_DELAY_MS
      const v = velocity()
      if (idle && v > 0) {
        pos += v * dt
        if (oneSet > 0) {
          if (pos >= oneSet * 2) pos -= oneSet
          else if (pos < oneSet) pos += oneSet
        }
        scroller.scrollLeft = pos
      } else {
        // Paused (dragging or within the resume delay): the visitor owns the
        // scroll position, so keep the accumulator synced to it.
        pos = scroller.scrollLeft
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Native scrolling (touch pan, momentum fling, trackpad/wheel inertia):
    // never wrap mid-gesture — a programmatic scrollLeft write cancels native
    // momentum dead, which is why flings used to hard-stop at a copy boundary
    // (always showing the first item). Instead, mark the interaction so the
    // auto-scroll stays out of the way, and only wrap once scroll events have
    // gone quiet. At rest the wrap is invisible: the content one copy over is
    // pixel-identical.
    let settleTimer = 0
    const onWheel = () => touch()
    const onScroll = () => {
      // Our own writes (auto-scroll tick, wrap, mouse drag) land within a
      // pixel of pos; anything further means the visitor is driving.
      if (Math.abs(scroller.scrollLeft - pos) <= EXTERNAL_SCROLL_EPSILON_PX)
        return
      pos = scroller.scrollLeft
      touch()
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(wrap, SCROLL_SETTLE_MS)
    }
    scroller.addEventListener('wheel', onWheel, { passive: true })
    scroller.addEventListener('scroll', onScroll, { passive: true })

    // Mouse drag-to-scroll. Touch/pen fall through to native scrolling above.
    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') {
        touch()
        return
      }
      // Don't capture the pointer or preventDefault yet: a plain click must keep
      // its native `click` event so the cell can open the lightbox. We only
      // begin dragging (and capture) once the pointer actually moves past the
      // threshold, in onPointerMove.
      pointerDown = true
      dragging = false
      draggedRef.current = false
      startX = e.clientX
      startLeft = scroller.scrollLeft
      activePointerId = e.pointerId
      touch()
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!pointerDown) return
      const dx = e.clientX - startX
      if (!dragging) {
        if (Math.abs(dx) <= DRAG_THRESHOLD_PX) return
        // Crossed the threshold: promote to a drag. Capturing now (not on press)
        // is what keeps a plain click's `click` event intact.
        dragging = true
        draggedRef.current = true
        scroller.setPointerCapture(activePointerId)
        scroller.classList.add('is-dragging')
      }
      scroller.scrollLeft = startLeft - dx
      // Sync the accumulator and wrap immediately: this is our own write (no
      // native momentum to cancel), and a long drag must wrap mid-gesture so
      // it never runs into the physical end of the reel.
      pos = scroller.scrollLeft
      wrap()
      touch()
    }
    const endDrag = () => {
      if (!pointerDown) return
      pointerDown = false
      touch() // start the resume timer from release, not from press
      if (!dragging) return // was a plain click; let it open the lightbox
      dragging = false
      // Clear the drag flag on the next tick — after the click that this
      // pointerup triggers has been handled — so future keyboard/plain clicks
      // aren't swallowed.
      setTimeout(() => {
        draggedRef.current = false
      }, 0)
      try {
        scroller.releasePointerCapture(activePointerId)
      } catch {
        /* pointer already released */
      }
      scroller.classList.remove('is-dragging')
    }
    scroller.addEventListener('pointerdown', onPointerDown)
    scroller.addEventListener('pointermove', onPointerMove)
    scroller.addEventListener('pointerup', endDrag)
    scroller.addEventListener('pointercancel', endDrag)

    const onResize = () => {
      measure()
      wrap()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(settleTimer)
      scroller.removeEventListener('wheel', onWheel)
      scroller.removeEventListener('scroll', onScroll)
      scroller.removeEventListener('pointerdown', onPointerDown)
      scroller.removeEventListener('pointermove', onPointerMove)
      scroller.removeEventListener('pointerup', endDrag)
      scroller.removeEventListener('pointercancel', endDrag)
      window.removeEventListener('resize', onResize)
    }
  }, [items, interval])

  return (
    <div
      className="carousel-filmstrip"
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div className="carousel-reel-mask" ref={scrollRef}>
        <div className="carousel-reel" ref={reelRef}>
          {Array.from({ length: REEL_COPIES }, (_, copy) =>
            items.map((item, i) => (
              <figure
                className="carousel-cell"
                key={`${copy}-${i}`}
                // Only the first copy is exposed to assistive tech; the extra
                // copies exist purely to make the scroll loop seamless.
                aria-hidden={copy === 0 ? undefined : true}
              >
                <button
                  type="button"
                  className="carousel-cell-frame"
                  // Duplicate copies are aria-hidden, so keep them out of the
                  // tab order while still clickable by mouse/touch.
                  tabIndex={copy === 0 ? undefined : -1}
                  aria-label={`View a larger image of ${item.title}`}
                  onClick={() => {
                    if (draggedRef.current) return
                    lightbox.open({ src: srcOf(item), alt: item.title })
                  }}
                >
                  <Framed item={item} />
                </button>
                <figcaption className="carousel-cell-label">
                  {item.title}
                </figcaption>
              </figure>
            )),
          )}
        </div>
      </div>
      {lightbox.element}
    </div>
  )
}

export default Carousel
