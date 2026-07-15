'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { NAV_LINKS, SOCIAL } from '@/lib/constants'
import { LABEL_STYLE, LINK_STYLE } from '@/lib/styles'
import { smoothScrollTo } from '@/lib/scroll'

function hoverIn(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.color = 'var(--cream)'
}
function hoverOut(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.color = 'rgba(240,228,204,0.55)'
}

export default function Footer() {
  const onLanding = usePathname() === '/'

  function handleSectionClick(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (!onLanding || !href.includes('#')) return
    e.preventDefault()
    smoothScrollTo('#' + href.split('#')[1])
  }

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
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 18, color: 'var(--cream)', display: 'block', letterSpacing: '0.2em', lineHeight: 1, marginBottom: 8 }}>
              SOUTHERN EDGE
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontWeight: 500, fontSize: 14, color: 'var(--silver)', display: 'block', letterSpacing: '0.24em', opacity: 0.6, marginBottom: 16 }}>
              FINE SPIRITS
            </span>
            <a
              href={`mailto:${SOCIAL.email}`}
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 300,
                fontSize: '13px',
                color: 'rgba(200,200,200,0.5)',
                marginTop: '16px',
                display: 'block',
                textDecoration: 'none',
              }}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
            >
              contact@southernedgebeverages.com
            </a>
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 300, fontSize: 11, color: 'rgba(200,200,200,0.25)', display: 'block', marginTop: 8, letterSpacing: '0.08em' }}>
              Crafted in South Carolina.
            </span>
          </div>

          {/* Col 2 — Explore */}
          <div>
            <span style={LABEL_STYLE}>Explore</span>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={LINK_STYLE}
                onClick={(e) => handleSectionClick(e, link.href)}
                onMouseEnter={hoverIn}
                onMouseLeave={hoverOut}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Col 3 — Connect */}
          <div>
            <span style={LABEL_STYLE}>Connect</span>
            <a href={SOCIAL.instagramUrl} target="_blank" rel="noopener noreferrer" style={LINK_STYLE} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
              Instagram
            </a>
            <a href={SOCIAL.facebookUrl} target="_blank" rel="noopener noreferrer" style={LINK_STYLE} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
              Facebook
            </a>
            <a href={SOCIAL.tiktokUrl} target="_blank" rel="noopener noreferrer" style={LINK_STYLE} onMouseEnter={hoverIn} onMouseLeave={hoverOut}>
              TikTok
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
            &copy; 2026 The Southern Edge Beverage Company, LLC. All rights reserved.
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
