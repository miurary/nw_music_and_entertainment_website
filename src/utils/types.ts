import { type ReactNode } from 'react'
import jetPong from '../assets/games/jetpong.webp'
import pgaTour from '../assets/games/pgatour.webp'
import bbhr from '../assets/games/bbhr.webp'
import jaws from '../assets/pinball/jaws2.webp'
import deadpool from '../assets/pinball/deadpool.webp'
import kingkong from '../assets/pinball/kingkong.webp'
import smart from '../assets/pool_tables/diamondsmart.webp'
import angelina from '../assets/jukeboxes/angelina.webp'
import virtuo from '../assets/jukeboxes/virtuo.webp'

export type Page = {
  id: string
  label: string
  title: string
  body: ReactNode
  subtitle?: string
  body2?: ReactNode
}

export type CardItem = {
  /** Heading shown beneath the card content. */
  title: string
  /** Primary image URL. */
  imageUrl?: string
  /** Fallback image URL; defaults to a placeholder when omitted. */
  imageAltUrl?: string
  /** Text content, shown when the item has no image. */
  text?: string
  /** Optional description shown beneath the title in the showcase layout. */
  details?: string
  dimensions?: string
  weight?: string
}

export const ARCADE_GAMES: CardItem[] = [
  {
    title: 'Jet Pong',
    imageUrl: jetPong,
    details:
      'Jet-Pong is an electronic coin-operated version of the novelty game Beer-Pong.',
    dimensions: 'L x W x H: 96" x 24.75" x 88.75"',
    weight: 'Weight: 500 Lbs',
  },
  {
    title: 'Golden Tee PGA Tour',
    imageUrl: pgaTour,
    details: 'Perfect for any game room or business, the Golden Tee PGA TOUR Clubhouse Deluxe Edition is the arcade experience that will have your neighbors and coworkers drooling. For those looking to make a statement while bringing gaming joy to their lives, look no further.',
    dimensions: 'L x W x H: 53.8" x 53.2" x 86.4"',
    weight: 'Weight: 240 Lbs',
  },
  {
    title: 'Big Buck Hunter Reloaded',
    imageUrl: bbhr,
    details: 'The undisputed champion of arcade content, the worldwide phenomenon Big Buck Hunter: Reloaded features endless wild hunting adventures – 11 Huntable Animals, 33 Bonus Games and Bow Hunting – as well as five action-packed premium campaign modes.',
    dimensions: 'L x W x H: 49" x 53" x 91"',
    weight: '370 Lbs',
  },
]

export const PINBALL: CardItem[] = [
  {
    title: 'Jaws',
    imageUrl: jaws,
    details: 'Stern',
    dimensions: 'L x W x H: 55" x 27" x 75.5"',
    weight: 'Weight: 250 Lbs',
  },
  {
    title: 'Deadpool',
    imageUrl: deadpool,
    details: 'Stern',
    dimensions: 'L x W x H: 55" x 27" x 75.5"',
    weight: 'Weight: 250 Lbs',
  },
  {
    title: 'King Kong',
    imageUrl: kingkong,
    details: 'Stern',
    dimensions: 'L x W x H: 55" x 27" x 75.5"',
    weight: 'Weight: 250 Lbs',
  },
]

export const POOL_TABLES: CardItem[] = [
  {
    title: 'Diamond Smart',
    imageUrl: smart,
    details: 'The coin-op version of the Pro-Am. The exact same table ready for your business use.',
    dimensions: 'L x W x H: 94" x 54" x 32" to 104" x 59" x 32"',
    weight: 'Weight: 800-1000 Lbs',
  },
]

export const JUKEBOXES: CardItem[] = [
  {
    title: 'TouchTunes Angelina',
    imageUrl: angelina,
    details: 'TouchTunes\' most innovative model to date. Needing only 24 inches of wall space, this eye-catching jukebox is perfect for small spaces and high-traffic areas.',
    dimensions: 'L x W x H: 9.7" x 24" x 31"',
    weight: 'Weight: 88 Lbs',
  },
  {
    title: 'TouchTunes Virtuo',
    imageUrl: virtuo,
    details: 'TouchTunes\' classic model. Slightly larger than the Angelina, but still compact enough to fit in most spaces. Can be mounted to the wall or placed on a pedestal.',
    dimensions: 'L x W x H: 10.4" x 29" x 40"',
    weight: 'Weight: 120 Lbs',
  },
]