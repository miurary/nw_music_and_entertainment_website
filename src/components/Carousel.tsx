import { useEffect, useState, type ReactNode } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import type { EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
// import Accessibility from 'embla-carousel-accessibility' # TODO: Add when embla-carousel@9.0.0 is stable release
import './Carousel.css'

export type CarouselProps = {
  /** The slide cells to render inside the reel. Each child should be a
      flex-sized cell — reuse `.carousel-cell` or supply a variant class. */
  children: ReactNode
  /** Accessible label for the carousel region. */
  ariaLabel?: string
  /** Embla options, passed straight through. Omit for Embla's snapping
      defaults; the drifting filmstrip opts into `{ loop, dragFree, skipSnaps }`. */
  options?: EmblaOptionsType
  /** Embla plugins (e.g. AutoScroll). The caller owns reduced-motion gating,
      since only it knows whether a given plugin animates. */
  plugins?: EmblaPluginType[]
  /** Extra class on the filmstrip wrapper, for per-variant styling. */
  className?: string
  /** Show clickable dot indicators, one per scroll snap. Suits snapping,
      one-slide-at-a-time variants; pointless on the free-drifting filmstrip. */
  showDots?: boolean
}

/**
 * Generic Embla carousel shell: a clipping viewport wrapping a flex reel of
 * caller-supplied cells. It owns only the Embla wiring and the framing markup;
 * what each slide looks like, how it scrolls, and any per-cell behavior
 * (lightbox, links) belong to the caller's children. See PhotoReel for the
 * drifting equipment filmstrip built on top of this.
 */
function Carousel({
  children,
  ariaLabel = 'Carousel',
  options,
  plugins,
  className,
  showDots = false,
}: CarouselProps): ReactNode {
  const [viewportRef, emblaApi] = useEmblaCarousel(options, plugins ?? [])
  const [snaps, setSnaps] = useState<number[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Mirror Embla's scroll-snap state into React so the dots can render and
  // highlight the active slide. Only wired up when dots are actually shown.
  useEffect(() => {
    if (!showDots || !emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    const onReInit = () => {
      setSnaps(emblaApi.scrollSnapList())
      onSelect()
    }
    onReInit()
    emblaApi.on('select', onSelect).on('reInit', onReInit)
    return () => {
      emblaApi.off('select', onSelect).off('reInit', onReInit)
    }
  }, [emblaApi, showDots])

  return (
    <div
      className={'carousel-filmstrip' + (className ? ' ' + className : '')}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
    >
      <div className="carousel-viewport" ref={viewportRef}>
        <div className="carousel-reel">{children}</div>
      </div>
      {showDots && snaps.length > 1 && (
        <div className="carousel-dots">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              className={
                'carousel-dot' + (i === selectedIndex ? ' is-selected' : '')
              }
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === selectedIndex}
              onClick={() => emblaApi?.scrollTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Carousel
