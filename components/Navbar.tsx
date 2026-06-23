'use client'

import { useRef, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { NAV_LINKS } from '@/lib/constants'
import { smoothScrollTo } from '@/lib/scroll'

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const onLanding = pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)
  // On the landing page the navbar is revealed by the hero-revealed event; on every
  // other route there's no hero, so it's visible immediately.
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!onLanding) {
      setVisible(true)
      return
    }
    const handler = () => setVisible(true)
    window.addEventListener('hero-revealed', handler)
    return () => window.removeEventListener('hero-revealed', handler)
  }, [onLanding])

  // Hash links scroll in-page on the landing route; everywhere else they fall back to
  // normal navigation (to '/#section'), and pure route links (/story) always navigate.
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false)
    if (onLanding && href.includes('#')) {
      e.preventDefault()
      smoothScrollTo('#' + href.split('#')[1])
    }
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
          background: 'linear-gradient(180deg, rgba(8,6,4,0.92) 0%, rgba(8,6,4,0.75) 60%, rgba(8,6,4,0) 100%)',
          transition: 'opacity 0.8s ease',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
        }}
        className="px-6 md:px-12 py-4 flex items-center justify-between"
      >
        <Link
          href="/#hero"
          aria-label="Southern Edge home"
          className="flex-shrink-0"
          onClick={(e) => handleLinkClick(e, '/#hero')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            lineHeight: 1,
          }}
        >
          <Image
            src="/images/logo_se_circle_white.png"
            alt=""
            width={34}
            height={34}
            priority
            style={{ width: 34, height: 34, objectFit: 'contain' }}
          />
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: '20px',
              letterSpacing: '0.22em',
              color: 'var(--cream)',
            }}
          >
            SOUTHERN EDGE
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <Link
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
              </Link>
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
          <Link
            key={link.label}
            href={link.href}
            onClick={(e) => handleLinkClick(e, link.href)}
            className="font-bebas text-4xl tracking-widest"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.02em',
              color: 'var(--cream)',
              textDecoration: 'none',
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </>
  )
}
