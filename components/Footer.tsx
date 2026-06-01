'use client'

import Image from 'next/image'

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
  { label: 'Our Story', href: '#story' },
  { label: 'Products', href: '#products' },
  { label: 'Cocktail Recipes', href: '#cocktails' },
  { label: 'Community', href: '#community' },
]

function hoverIn(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.color = 'var(--cream)'
}
function hoverOut(e: React.MouseEvent<HTMLAnchorElement>) {
  e.currentTarget.style.color = 'rgba(240,228,204,0.55)'
}

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-void)',
        borderTop: '1px solid var(--smoke)',
        paddingTop: 'clamp(60px,8vw,80px)',
        paddingBottom: '40px',
        paddingLeft: 'clamp(20px,5vw,40px)',
        paddingRight: 'clamp(20px,5vw,40px)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Three-column grid — Tailwind responsive */}
        <div className="footer-cols">
          {/* Col 1 — Brand */}
          <div>
            <Image
              src="/images/logo_lockup_hd.png"
              alt="Southern Edge Fine Spirits"
              width={200}
              height={80}
              style={{ height: '80px', width: 'auto', objectFit: 'contain' }}
            />
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
          </div>

          {/* Col 2 — Explore */}
          <div>
            <span style={LABEL_STYLE}>Explore</span>
            {EXPLORE_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                style={LINK_STYLE}
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
            <a
              href="https://linktr.ee/southernedgebeverages"
              target="_blank"
              rel="noopener noreferrer"
              style={LINK_STYLE}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
            >
              Linktree ↗
            </a>
            <span
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 300,
                fontSize: '14px',
                color: 'rgba(240,228,204,0.55)',
                display: 'block',
                marginBottom: '12px',
              }}
            >
              @southernedgebeverages
            </span>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              style={LINK_STYLE}
              onMouseEnter={hoverIn}
              onMouseLeave={hoverOut}
            >
              Facebook ↗
            </a>
            <div
              style={{
                borderTop: '1px solid var(--smoke)',
                marginTop: '20px',
                paddingTop: '20px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 300,
                  fontSize: '12px',
                  color: 'rgba(200,200,200,0.3)',
                  letterSpacing: '0.05em',
                }}
              >
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
