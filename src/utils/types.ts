import { type ReactNode } from 'react'
import jetPong from '../assets/games/jetpong.webp'
import duckClaw from '../assets/games/duckclaw.webp'
import pgaTour from '../assets/games/pgatour.webp'
import bbhr from '../assets/games/bbhr.webp'
import jaws from '../assets/games/jawspin.webp'
import proam from '../assets/pool_tables/diamondproam.webp'
import smart from '../assets/pool_tables/diamondsmart.webp'
import professional from '../assets/pool_tables/diamondpro.webp'
import angelina from '../assets/jukeboxes/angelina.webp'
import virtuo from '../assets/jukeboxes/virtuo.webp'

export type Page = {
  id: string
  label: string
  title: string
  body: ReactNode
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
    title: 'Lucky Duck Claw Machine',
    imageUrl: duckClaw,
    details: 'Lucky Duck is a high-earning crane with a small footprint and programmable pricing.  Store up to 1,000 rubber ducks.',
    dimensions: 'L x W x H: 27.56" x 24.4" x 74.8"',
    weight: '245 Lbs',
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
  {
    title: 'Pinball',
    imageUrl: jaws,
    details: 'A classic addition to any business. A wide variety of pinball machines are available, including Stern, Jersey Jack, and more.',
    dimensions: 'L x W x H: 55" x 27" x 75.5"',
    weight: 'Weight: 250 Lbs',
  },
]


export const POOL_TABLES: CardItem[] = [
  {
    title: 'Diamond Pro-Am',
    imageUrl: proam,
    details: 'Popular choice for tournaments and residential game rooms. Features solid wood exterior aprons and rails, but omits the cast-iron subframe of the Professional for a more traditional build.',
    dimensions: 'L x W x H: 94" x 54" x 32" to 114" x 64" x 32"',
    weight: 'Weight: 800-1200 Lbs',
  },
  {
    title: 'Diamond Smart',
    imageUrl: smart,
    details: 'The coin-op version of the Pro-Am. The exact same table ready for your business use.',
    dimensions: 'L x W x H: 94" x 54" x 32" to 114" x 64" x 32"',
    weight: 'Weight: 800-1200 Lbs',
  },
  {
    title: 'Diamond Professional',
    imageUrl: professional,
    details: 'Premier model used in major tournaments. Features a heavy-duty internal steel frame, an exclusive leveling system, tighter pocket openings, and deeper shelves.',
    dimensions: 'L x W x H: 94" x 54" x 32" to 114" x 64" x 32"',
    weight: 'Weight: 800-1200 Lbs',
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