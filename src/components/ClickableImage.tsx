import { type ReactNode } from 'react'
import { useLightbox } from './Lightbox'

export type ClickableImageProps = {
  src: string
  alt: string
  /** Class applied to the inner <img> so it keeps its existing styling. */
  imgClassName?: string
  loading?: 'lazy' | 'eager'
}

/**
 * A self-contained image that opens in the shared lightbox when clicked. Handy
 * for one-off images (e.g. the locations map) that aren't already inside a
 * component managing its own lightbox.
 */
export function ClickableImage({
  src,
  alt,
  imgClassName,
  loading = 'lazy',
}: ClickableImageProps): ReactNode {
  const { open, element } = useLightbox()
  return (
    <>
      <button
        type="button"
        className="lightbox-trigger"
        onClick={() => open({ src, alt })}
        aria-label={`View a larger image of ${alt}`}
      >
        <img className={imgClassName} src={src} alt={alt} loading={loading} />
      </button>
      {element}
    </>
  )
}
