import { useEffect, useState } from 'react'
import './App.css'
import CardShowcase from './components/CardShowcase'
import ContactForm from './components/ContactForm'
import { submitInquiry } from './utils/submitInquiry'
import locationsMap from './assets/locations.webp'
import type { Page } from './utils/types'
import { ARCADE_GAMES, POOL_TABLES, JUKEBOXES, PINBALL } from './utils/types'

const PAGES: Page[] = [
  {
    id: 'home',
    label: 'Home',
    title: 'Home',
    body: (
      <>
        <p>
          Welcome to NW Entertainment &amp; Music. We bring arcade games,
          jukeboxes, pool tables, and full-service amusement equipment to
          businesses across the region.
        </p>
        <div className="contact-card">
          <p className="contact-name">Blake Miura</p>
          <p className="contact-line">
            <a href="tel:+15037097216">(503) 709-7216</a>
          </p>
          <p className="contact-line">
            <a href="mailto:nwentertainmentandmusic@gmail.com">
              nwentertainmentandmusic@gmail.com
            </a>
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'about',
    label: 'About Us',
    title: 'About Us',
    body: (
      <p>
        30 years of experience in the amusement and entertainment industry. 
        Our team handles everything from planning to installation and maintenance.
        Responsive to your needs. Give us a call if things break. 
        A partner you can trust to keep your entertainment equipment running smoothly.
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
          <CardShowcase
            ariaLabel="Games on Site"
            kicker="Arcade Game"
            items={ARCADE_GAMES}
          />
        </>
      ),
  },
  {
    id: 'pinball',
    label: 'Pinball',
    title: 'Pinball',
    body: (
      <>
        <p>
          A classic addition to any business. 
          A wide variety of pinball machines are available, including Stern, Jersey Jack, and more.
        </p>
        <CardShowcase
          ariaLabel="Pinball Machines"
          kicker="Pinball Machine"
          items={PINBALL}
        />
      </>
    ),
  },
  {
    id: 'jukeboxes',
    label: 'Jukeboxes',
    title: 'Jukeboxes',
    body: (
      <>
        <p>
          Digital jukeboxes with full catalogs and easy management.
          Perfect for bars, restaurants, and game rooms.
        </p>
        <CardShowcase
          ariaLabel="Jukeboxes"
          kicker="Jukebox"
          items={JUKEBOXES}
        />
      </>
    ),
  },
  {
    id: 'pool',
    label: 'Pool Tables',
    title: 'Pool Tables',
    body: (
      <>
        <p>
          Tournament-grade and recreational pool tables, professionally leveled
          and maintained with regular recloth and repair service. Available sizes are 
          7' with a 40" x 80" play area and 8' with a 45" x 90" play area. 
          Minimum room sizes from 14.5' x 18' to 15' x 18.5'.
        </p>
        <CardShowcase
          ariaLabel="Pool Tables"
          kicker="Pool Table"
          items={POOL_TABLES}
        />
      </>
    ),
  },
  {
    id: 'locations',
    label: 'Locations',
    title: 'Locations',
    body: (
      <>
        <p>
          We serve venues throughout the Pacific Northwest. Reach out to confirm
          coverage in your area.
        </p>
        <img
          className="location-map"
          src={locationsMap}
          alt="Map of our service area across the Pacific Northwest"
        />
      </>
    ),
  },
  {
    id: 'contact',
    label: 'Contact Us',
    title: 'Contact Us',
    body: (
      <>
        <p>
          Ready to get started or have a machine that needs service? Send us a
          note and we&apos;ll be in touch.
        </p>
        <ContactForm onSubmit={submitInquiry} />
      </>
    ),
  },
]

function App() {
  const [activeId, setActiveId] = useState(PAGES[0].id)
  // Mobile only: the sidebar collapses to an off-canvas drawer toggled by the
  // hamburger button. Ignored on desktop, where the sidebar is always visible.
  const [menuOpen, setMenuOpen] = useState(false)
  const activePage = PAGES.find((p) => p.id === activeId) ?? PAGES[0]

  // Switching tabs swaps the body within one scrolling document, so reset the
  // scroll position to the top whenever the active page changes.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeId])

  // While the drawer is open, lock page scroll and let Escape close it.
  useEffect(() => {
    if (!menuOpen) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const selectPage = (id: string) => {
    setActiveId(id)
    setMenuOpen(false)
  }

  return (
    <div className="layout">
      <button
        type="button"
        className="nav-toggle"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="sidebar-nav"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span className="nav-toggle-bars" aria-hidden="true" />
      </button>

      <div
        className={'nav-overlay' + (menuOpen ? ' is-visible' : '')}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="sidebar-nav"
        className={'sidebar' + (menuOpen ? ' is-open' : '')}
      >
        <div className="sidebar-brand">
          <span className="brand-mark">NW</span>
          <span className="brand-text">
            Entertainment &amp;<br />Music
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
              onClick={() => selectPage(page.id)}
            >
              {page.label}
            </button>
          ))}
        </nav>
      </aside>

      <header className="header">
        <h1 className="header-title" key={activePage.id}>
          {activePage.title}
        </h1>
        <ul className="diamond-rule" aria-hidden="true">
          <li>Arcade Games</li>
          <li>Pinball</li>
          <li>Jukeboxes</li>
          <li>Pool Tables</li>
        </ul>
      </header>

      <main className="content">
        <div className="content-inner">{activePage.body}</div>
      </main>
    </div>
  )
}

export default App
