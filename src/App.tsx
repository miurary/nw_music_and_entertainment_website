import { useState, type ReactNode } from 'react'
import './App.css'
import Carousel from './components/Carousel'
import type { CarouselItem } from './components/Carousel'

type Page = {
  id: string
  label: string
  title: string
  body: ReactNode
}

const ARCADE_GAMES: CarouselItem[] = [
  {
    title: 'Jet Pong',
    imageUrl: 'https://www.jet-pong.com/wp-content/uploads/2022/05/home_page_placeholder_new.jpg',
  },
  {
    title: 'Lucky Duck Claw Machine',
    imageUrl: 'https://www.betson.com/wp-content/uploads/2022/04/Lucky-Duck-Left.jpg',
  },
  {
    title: 'Golden Tee PGA Tour',
    imageUrl: 'https://www.betson.com/wp-content/uploads/2021/04/Golden-Tee-PGA-Tour.jpg',
  },
  {
    title: 'Big Buck Hunter Reloaded',
    imageUrl: 'https://www.gameroomshop.com/cdn/shop/files/big-buck-hunter-reloaded-panorama-shooting-arcade-game-online-version-monthly-subscription-2_1024x1024.jpg?v=1701772649',
  },
  {
    title: 'Pinball',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQNuOOkgtdrR_pqsbDgGioFKVYllAf7o9TkjE3gNdBRDw&s=10'
  }
]

const PAGES: Page[] = [
  {
    id: 'home',
    label: 'Home',
    title: 'Home',
    body: (
      <>
        <p>
          Welcome to NW Music &amp; Entertainment. We bring arcade games,
          jukeboxes, pool tables, and full-service amusement equipment to
          businesses across the region.
        </p>
        <p>
          Use the menu on the left to explore what we offer, find a location,
          or get in touch.
        </p>
      </>
    ),
  },
  {
    id: 'about',
    label: 'About Us',
    title: 'About Us',
    body: (
      <p>
        For years we&apos;ve provided, installed, and serviced coin-op and
        free-play entertainment equipment. Our team handles everything from
        delivery to ongoing maintenance so your machines stay in top shape.
      </p>
    ),
  },
  {
    id: 'arcade',
    label: 'Arcade Games',
    title: 'Arcade Games',
    body: (
      <>
        <p>
          Classic cabinets, modern hits, and redemption games. We can build a
          lineup tailored to your venue and rotate titles to keep things fresh.
        </p>
        <Carousel
          ariaLabel="Games on Site"
          items={ARCADE_GAMES}
        />
      </>
    ),
  },
  {
    id: 'jukeboxes',
    label: 'Jukeboxes',
    title: 'Jukeboxes',
    body: (
      <p>
        Digital and classic jukeboxes with full catalogs and easy management.
        Perfect for bars, restaurants, and game rooms.
      </p>
    ),
  },
  {
    id: 'pool',
    label: 'Pool Tables',
    title: 'Pool Tables',
    body: (
      <p>
        Tournament-grade and recreational pool tables, professionally leveled
        and maintained with regular recloth and repair service.
      </p>
    ),
  },
  {
    id: 'photobooths',
    label: 'Photo Booths',
    title: 'Photo Booths',
    body: (
      <p>
        Modern photo booths for events and permanent installations. Custom
        branding and prints available.
      </p>
    ),
  },
  {
    id: 'locations',
    label: 'Locations',
    title: 'Locations',
    body: (
      <p>
        We serve venues throughout the Pacific Northwest. Reach out to confirm
        coverage in your area.
      </p>
    ),
  },
  {
    id: 'contact',
    label: 'Contact Us',
    title: 'Contact Us',
    body: (
      <>
        <p>Ready to get started or have a machine that needs service?</p>
        <p>
          Email us at <a href="mailto:info@example.com">info@example.com</a> or
          call (555) 123-4567.
        </p>
      </>
    ),
  },
]

function App() {
  const [activeId, setActiveId] = useState(PAGES[0].id)
  const activePage = PAGES.find((p) => p.id === activeId) ?? PAGES[0]

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="brand-mark">NW</span>
          <span className="brand-text">
            Music &amp;<br />Entertainment
          </span>
        </div>
        <nav className="sidebar-nav">
          {PAGES.map((page) => (
            <button
              key={page.id}
              type="button"
              className={
                'nav-button' + (page.id === activeId ? ' is-active' : '')
              }
              onClick={() => setActiveId(page.id)}
            >
              {page.label}
            </button>
          ))}
        </nav>
      </aside>

      <header className="header">
        <h1 className="header-title">{activePage.title}</h1>
      </header>

      <main className="content">
        <div className="content-inner">{activePage.body}</div>
      </main>
    </div>
  )
}

export default App
