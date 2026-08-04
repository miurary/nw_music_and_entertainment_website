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
import silver_star_1 from '../assets/testimonials/silver_star/silver_star_1.webp'
import silver_star_2 from '../assets/testimonials/silver_star/silver_star_2.webp'
import stanley_1 from '../assets/testimonials/stanleys/stanley_1.webp'
import stanley_2 from '../assets/testimonials/stanleys/stanley_2.webp'

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

export type Testimonial = {
  id: string
  /** Business the testimonial is from — shown in the eyebrow and byline. */
  businessName: string
  /** Optional short editorial headline pulled from the testimonial. Omit to
      render no headline (space is not reserved). */
  headline?: string
  /** Where the business is, e.g. 'Vancouver, WA'. Rendered as a subheader under
      the headline; omit to render nothing. */
  location?: string
  /** Emphasized lead sentence of the quote; rendered in darker, heavier type. */
  lead?: string
  /** The rest of the quote, following the lead. */
  body: string
  /** Owner's full name — drives the byline and its medallion initials. Omit to
      hide the attribution row entirely. */
  owner?: string
  /** Owner's title/role, e.g. 'President, Erickco Inc.'. */
  role?: string
  /** Supporting install photos, shown as a 2-up thumbnail grid below the quote. */
  images: { src: string; alt: string }[]
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'silver-star',
    headline: 'Silver Star Saloon',
    businessName: 'Silver Star Saloon',
    location: 'Vancouver, WA',
    owner: 'Timothy V. Erickson',
    role: 'President, Erickco Inc.',
    lead: `It's been my pleasure to have had Blake Miura and his company, NW Entertainment & Music, as my coin operator for the past 10 years.`,
    body: `He has been nothing short of exceptional in his service and reliability. Blake has never made a promise he didn't keep or a problem he didn't doggedly pursue the solution to. We have been, and will continue to be, partners working together for the benefit and in the service of each others business. I can't recommend Blake and his company more enthusiastically other than to say that after almost 27 years in the hospitality business I have not dealt with a more honest or honorable person than Blake Miura.`,
    images: [
      { src: silver_star_1, alt: 'Arcade games and jukeboxes installed at Silver Star Saloon' },
      { src: silver_star_2, alt: 'Pool tables installed at Silver Star Saloon' },
    ],
  },
  {
    id: '82nd-bar-and-grill',
    headline: `Stanley's Corner`,
    businessName: `Stanley's Corner, 82nd Bar and Grill, Ace Tavern 2`,
    location: 'Gladstone, OR',
    owner: '88 Badillo Inc.',
    body: `I've partnered with NW Entertainment & Music for the past 15 years across multiple of my locations. The quality of service is what has kept the relationship intact. Very reliable, equipment always kept up to date with maintenance and professional service. For any business managing multiple venues, NW Entertainment & Music offers a rare combination of reliability, adaptability, and genuine professionalism. Fifteen years in, I still don't hesitate to recommend them.`,
    images: [
      { src: stanley_2, alt: `Pool tables installed at Stanley's Corner` },
      { src: stanley_1, alt: `Pinball installed at Stanley's Corner` },
    ],
  },
]

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