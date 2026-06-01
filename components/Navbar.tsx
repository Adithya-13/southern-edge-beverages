'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const NAV_LINKS = [
  { label: 'Our Story', href: '#manifesto' },
  { label: 'Products', href: '#products' },
  { label: 'Cocktails', href: '#cocktails' },
  { label: 'Community', href: '#community' },
]

interface NavbarProps {
  visible?: boolean
}

export default function Navbar({ visible = false }: NavbarProps) {
  const navRef = useRef<HTMLElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useGSAP(
    () => {
      ScrollTrigger.create({
        start: 'top -50',
        end: 'max',
        onEnter: () => {
          gsap.to(navRef.current, {
            backgroundColor: 'rgba(16,13,9,0.92)',
            backdropFilter: 'blur(12px)',
            duration: 0.4,
            ease: 'power2.out',
          })
        },
        onLeaveBack: () => {
          gsap.to(navRef.current, {
            backgroundColor: 'rgba(0,0,0,0)',
            backdropFilter: 'blur(0px)',
            duration: 0.4,
            ease: 'power2.out',
          })
        },
      })
    },
    { scope: navRef },
  )

  const handleLinkClick = () => {
    setMenuOpen(false)
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
          zIndex: 50,
          backgroundColor: 'rgba(0,0,0,0)',
          transition: 'opacity 0.8s ease',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
        }}
        className="px-6 md:px-12 py-4 flex items-center justify-between"
      >
        {/* Logo */}
        <a href="#hero" aria-label="Southern Edge home" className="flex-shrink-0">
          <Image
            src="/images/logo_se.png"
            alt="Southern Edge"
            width={31}
            height={32}
            style={{ width: 'auto', height: '32px' }}
            priority
          />
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="font-sans font-light text-sm tracking-wide"
                style={{ color: 'rgba(240,228,204,0.70)', transition: 'color 0.2s' }}
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

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex items-center justify-center"
          style={{ color: 'var(--cream)', background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile full-screen overlay */}
      <div
        className="md:hidden"
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 49,
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
            onClick={handleLinkClick}
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
