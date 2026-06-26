import { type ReactNode } from 'react'
import jetPong from '../assets/games/jetpong.webp'
import duckClaw from '../assets/games/duckclaw.webp'
import pgaTour from '../assets/games/pgatour.webp'
import bbhr from '../assets/games/bbhr.webp'
import hpp from '../assets/games/hpp.webp'
import jaws from '../assets/games/jawspin.webp'
import elvira from '../assets/games/elvirapin.webp'
import proam from '../assets/pool_tables/diamondproam.webp'
import smart from '../assets/pool_tables/diamondsmart.webp'
import professional from '../assets/pool_tables/diamondpro.webp'
import paragon from '../assets/pool_tables/diamondparagon.webp'
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
}

export const ARCADE_GAMES: CardItem[] = [
  {
    title: 'Jet Pong',
    imageUrl: jetPong,
  },
  {
    title: 'Lucky Duck Claw Machine',
    imageUrl: duckClaw,
  },
  {
    title: 'Golden Tee PGA Tour',
    imageUrl: pgaTour,
  },
  {
    title: 'Big Buck Hunter Reloaded',
    imageUrl: bbhr,
  },
  {
    title: 'Harry Potter Pinball',
    imageUrl: hpp,
  },
  {
    title: 'Jaws Pinball',
    imageUrl: jaws,
  },
  {
    title: 'Elvira Pinball',
    imageUrl: elvira,
  },
]

export const POOL_TABLES: CardItem[] = [
  {
    title: 'Diamond Pro-Am',
    imageUrl: proam,
  },
  {
    title: 'Diamond Smart',
    imageUrl: smart,
  },
  {
    title: 'Diamond Professional',
    imageUrl: professional,
  },
  {
    title: 'Diamond Paragon',
    imageUrl: paragon,
  },
]

export const JUKEBOXES: CardItem[] = [
  {
    title: 'TouchTunes Angelina',
    imageUrl: angelina,
  },
  {
    title: 'TouchTunes Virtuo',
    imageUrl: virtuo,
  },
]