import { useEffect, useState } from 'react'
import './App.css'
import CardShowcase from './components/CardShowcase'
import ContactForm from './components/ContactForm'
import { submitInquiry } from './utils/submitInquiry'
import locationsMap from './assets/locations.webp'
import jawsBanner from './assets/pinball/jaws2.webp'
import poolBanner from './assets/pool_tables/diamondsmart.webp'
import jukeboxBanner from './assets/jukeboxes/virtuo.webp'
import type { Page } from './utils/types'
import { ARCADE_GAMES, POOL_TABLES, JUKEBOXES, PINBALL, TESTIMONIALS } from './utils/types'
import Carousel from './components/Carousel'
import PhotoReel from './components/PhotoReel'
import { ClickableImage } from './components/ClickableImage'

/** First + last initial of a name, e.g. 'Timothy V. Erickson' -> 'TE'. */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ''
  const first = parts[0][0]
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

// Decorative triptych shown in the header banner: one machine from each of the
// headline categories. Purely visual, so it's marked aria-hidden in the markup.
const BANNER_IMAGES = [
  { src: jawsBanner, label: 'JAWS pinball machine' },
  { src: poolBanner, label: 'Diamond pool table' },
  { src: jukeboxBanner, label: 'TouchTunes jukebox' },
]

const PAGES: Page[] = [
  {
    id: 'home',
    label: 'Home',
    title: 'Home',
    body: (
      <>
        <p>
          Welcome to NW Entertainment &amp; Music. We bring arcade games,
          jukeboxes, pool tables, ATMs, and full-service amusement equipment to
          businesses across the region.
        </p>
        <PhotoReel
          items = {[...ARCADE_GAMES, ...POOL_TABLES, ...JUKEBOXES, ...PINBALL]}
          ariaLabel = "NW Entertainment & Music Equipment Showcase"
          interval = {7000}
        />
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
        Responsive to your needs.
        A partner you can trust to keep your entertainment equipment running smoothly.
      </p>
    ),
    subtitle: 'Mission',
    body2: (
      <p>
          Our mission is to maximize earning potential by forming a partnership
          with our locations to create joint financial success. We aim to create
          value for our accounts and players by providing the best equipment and
          delivering unmatched service to keep our equipment earning.
      </p>
    ),
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    title: 'Testimonials',
    body: (
      <>
        <Carousel
          ariaLabel="Customer testimonials"
          className="carousel--wide"
          options={{ align: 'center' }}
          showDots
        >
          {TESTIMONIALS.map((t) => (
            <figure className="testimonial-cell" key={t.id}>
              <div className="testimonial-card">

                {t.headline && (
                  <p className="testimonial-headline">{t.businessName}</p>
                )}

                {t.images.length > 0 && (
                  <div className="testimonial-installs">
                    <div className="testimonial-photos">
                      {t.images.map((img) => (
                        <ClickableImage
                          key={img.src}
                          src={img.src}
                          alt={img.alt}
                        />
                      ))}
                    </div>
                  </div>
                )}

                <span className="testimonial-qmark" aria-hidden="true">
                  &ldquo;
                </span>

                <blockquote className="testimonial-quote">
                  {t.lead && (
                    <span>{t.lead} </span>
                  )}
                  {t.body}
                </blockquote>

                <span className="testimonial-qmark" aria-hidden="true">
                  &rdquo;
                </span>

                <div className="testimonial-rule" aria-hidden="true" />

                {t.owner && (
                  <div className="testimonial-byline">
                    <span className="testimonial-medallion" aria-hidden="true">
                      {initialsOf(t.owner)}
                    </span>
                    <span className="testimonial-byline-text">
                      <span className="testimonial-name">{t.owner}</span>
                      {(t.role || t.businessName) && (
                        <span className="testimonial-role">
                          {[t.role, t.businessName]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
            </figure>
          ))}
        </Carousel>
        {TESTIMONIALS.length > 1 && (
          <div className="carousel-hint">&#x2039; Swipe for more &#x203A;</div>
        )}
      </>
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
    id: 'team-rewards',
    label: 'Team Rewards',
    title: 'TouchTunes Team Rewards',
    body: (
      <>
        <p>
          TouchTunes offers Team Rewards as a loyalty program for businesses.
          Staff members are able to earn free credits weekly for playing music on the jukebox.
          Sign up through TouchTunes to get started and start earning rewards for your team.
        </p>
        <a className="opt-lever" href="https://www.touchtunes.com/rewards/team-rewards" target="_blank" rel="noopener noreferrer">
          TouchTunes Team Rewards
        </a>
      </>
    )
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
        <ClickableImage
          imgClassName="location-map"
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
        <div className="header-copy">
          <h1 className="header-title" key={activePage.id}>
            NW Entertainment &amp; Music
          </h1>
          <ul className="diamond-rule" aria-hidden="true">
            <li>Arcade Games</li>
            <li>Pinball</li>
            <li>Jukeboxes</li>
            <li>Pool Tables</li>
            <li>ATMs</li>
          </ul>
        </div>
        <div className="header-banner" aria-hidden="true">
          {BANNER_IMAGES.map((img) => (
            <figure className="banner-panel" key={img.src}>
              <img src={img.src} alt={img.label} loading="eager" />
            </figure>
          ))}
        </div>
      </header>

      <main className="content">
        <h2 className="header-subtitle" key={activePage.id + '-title'}>
            {activePage.title}
        </h2>
        <div className="content-inner">{activePage.body}</div>
        {activePage.subtitle && (
          <h2 className="header-subtitle" key={activePage.id + '-subtitle'}>
            {activePage.subtitle}
          </h2>
        )}
        {activePage.body2 && (
          <div className="content-inner">{activePage.body2}</div>
        )}
      </main>
    </div>
  )
}

export default App
