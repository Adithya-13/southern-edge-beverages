'use client'

import { useRef, useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '@/lib/constants'
import { smoothScrollTo } from '@/lib/scroll'

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  // Manages own visibility — revealed when hero-revealed event fires
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handler = () => setVisible(true)
    window.addEventListener('hero-revealed', handler)
    return () => window.removeEventListener('hero-revealed', handler)
  }, [])

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMenuOpen(false)
    smoothScrollTo(href)
  }

  return (
    <>
      <nav
        ref={navRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(0,0,0,0)',
          transition: 'opacity 0.8s ease',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
        }}
        className="px-6 md:px-12 py-4 flex items-center justify-between"
      >
        <a
          href="#hero"
          aria-label="Southern Edge home"
          className="flex-shrink-0"
          onClick={(e) => handleLinkClick(e, '#hero')}
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: '20px',
            letterSpacing: '0.14em',
            color: 'var(--cream)',
            textDecoration: 'none',
            lineHeight: 1,
          }}
        >
          SOUTHERN EDGE
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="font-sans font-light text-sm tracking-wide"
                style={{ color: 'rgba(240,228,204,0.70)', transition: 'color 0.2s' }}
                onClick={(e) => handleLinkClick(e, link.href)}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = '#F0E4CC')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color =
                    'rgba(240,228,204,0.70)')
                }
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden flex items-center justify-center"
          style={{ color: 'var(--cream)', background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      <div
        className="md:hidden"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          backgroundColor: 'rgba(8,6,4,0.97)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '2.5rem',
          transition: 'opacity 0.3s, pointer-events 0.3s',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            onClick={(e) => handleLinkClick(e, link.href)}
            className="font-bebas text-4xl tracking-widest"
            style={{ color: 'var(--cream)', textDecoration: 'none' }}
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  )
}
