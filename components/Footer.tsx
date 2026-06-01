'use client'

import Image from 'next/image'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

const LABEL_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontWeight: 500,
  fontSize: '10px',
  color: 'var(--silver)',
  letterSpacing: '0.2em',
  marginBottom: '20px',
  textTransform: 'uppercase',
  display: 'block',
}

const LINK_STYLE: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontWeight: 300,
  fontSize: '14px',
  color: 'rgba(240,228,204,0.55)',
  display: 'block',
  marginBottom: '12px',
  textDecoration: 'none',
}

const EXPLORE_LINKS = [
  { label: 'Our Story', href: '#manifesto' },
  { label: 'The Pour', href: '#thepour' },
  { label: 'Community', href: '#community' },
]

function hoverIn(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.color = 'var(--cream)'
}
function hoverOut(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.color = 'rgba(240,228,204,0.55)'
}

function handleSectionClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith('#')) return
  e.preventDefault()
  const target = document.querySelector(href)
  if (!target) return
  const smoother = ScrollSmoother.get()
  if (smoother) {
    smoother.scrollTo(target, true, 'top top+=80')
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function Footer() {
  return (
    <footer
      style={{
        position: 'relative',
        background: 'var(--bg-void)',
        borderTop: '1px solid var(--smoke)',
        paddingTop: 'clamp(60px,8vw,80px)',
        paddingBottom: '40px',
        paddingLeft: 'clamp(20px,5vw,40px)',
        paddingRight: 'clamp(20px,5vw,40px)',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, var(--amber), transparent)', opacity: 0.3 }} />
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Three-column grid — Tailwind responsive */}
        <div className="footer-cols">
          {/* Col 1 — Brand */}
          <div>
            <Image src="/images/logo_se_circle_white.png" alt="Southern Edge Fine Spirits" width={56} height={56} style={{ width: 56, height: 56, objectFit: 'contain', marginBottom: 16 }} />
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 18, color: 'var(--cream)', display: 'block', letterSpacing: '0.08em', lineHeight: 1, marginBottom: 8 }}>
              SOUTHERN EDGE
            </span>
            <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 14, color: 'var(--silver)', display: 'block', letterSpacing: '0.12em', opacity: 0.6, marginBottom: 16 }}>
              FINE SPIRITS
            </span>
            <span
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 300,
                fontSize: '13px',
                color: 'rgba(200,200,200,0.5)',
                marginTop: '16px',
                display: 'block',
              }}
            >
              southernedgespirits.com
            </span>
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: 11, color: 'rgba(200,200,200,0.25)', display: 'block', marginTop: 8, letterSpacing: '0.08em' }}>
              Crafted in South Carolina.
            </span>
          </div>

          {/* Col 2 — Explore */}
          <div>
            <span style={LABEL_STYLE}>Explore</span>
            {EXPLORE_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={LINK_STYLE}
                onClick={(e) => handleSectionClick(e, link.href)}
                onMouseEnter={hoverIn}
                onMouseLeave={hoverOut}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Col 3 — Connect */}
          <div>
            <span style={LABEL_STYLE}>Connect</span>
            <a href="https://www.instagram.com/southernedgebeverages/" target="_blank" rel="noopener noreferrer" style={LINK_STYLE} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
              Instagram ↗
            </a>
            <a href="https://web.facebook.com/SouthernEdgeBeverages" target="_blank" rel="noopener noreferrer" style={LINK_STYLE} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
              Facebook ↗
            </a>
            <a href="https://www.tiktok.com/@southernedgebeverages" target="_blank" rel="noopener noreferrer" style={LINK_STYLE} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
              TikTok ↗
            </a>
            <a href="https://linktr.ee/southernedgebeverages" target="_blank" rel="noopener noreferrer" style={LINK_STYLE} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
              Linktree ↗
            </a>
            <a href="mailto:contact@southernedgespirits.com" style={{ ...LINK_STYLE, marginTop: 4 }} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
              contact@southernedgespirits.com
            </a>
            <div style={{ borderTop: '1px solid var(--smoke)', marginTop: '20px', paddingTop: '20px' }}>
              <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: '12px', color: 'rgba(200,200,200,0.3)', letterSpacing: '0.05em' }}>
                #TasteTheEdge&nbsp;&nbsp;#SavorYourExperience
              </span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: '1px solid var(--smoke)',
            marginTop: '60px',
            paddingTop: '32px',
            textAlign: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: '12px',
              color: 'rgba(200,200,200,0.4)',
              display: 'block',
            }}
          >
            &copy; 2026 Southern Edge Beverage Company. All rights reserved.
          </span>
          <span
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: '12px',
              color: 'rgba(200,200,200,0.4)',
              display: 'block',
              marginTop: '4px',
            }}
          >
            Please drink responsibly. Must be 21+ to consume alcohol.
          </span>
        </div>
      </div>
    </footer>
  )
}
