'use client'

import { Award } from 'lucide-react'
import { MARQUEE_TEXT, AWARDS, PRESS } from '@/lib/constants'

export default function Events() {
  return (
    <section
      id="events"
      style={{
        background: 'var(--bg-deep)',
        padding: 'clamp(80px,8vw,100px) clamp(20px,5vw,40px)',
      }}
    >
      <div className="events-layout" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* LEFT — Marquee */}
        <div>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--silver)',
              marginBottom: 24,
            }}
          >
            UPCOMING EVENTS
          </p>

          <div style={{ marginBottom: 48, position: 'relative' }}>
            <span style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(80px, 10vw, 140px)',
              color: 'var(--amber)',
              opacity: 0.10,
              lineHeight: 1,
              display: 'block',
              position: 'absolute',
              top: 0,
              left: 0,
              pointerEvents: 'none',
              userSelect: 'none',
            }}>
              2024
            </span>
            <div style={{ display: 'flex', gap: 32, paddingTop: 8, position: 'relative', zIndex: 1 }}>
              <div>
                <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 40, color: 'var(--cream)', display: 'block', lineHeight: 1 }}>2</span>
                <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--silver)', textTransform: 'uppercase' }}>Silver Medals</span>
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-bebas)', fontSize: 40, color: 'var(--cream)', display: 'block', lineHeight: 1 }}>3+</span>
                <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 10, letterSpacing: '0.2em', color: 'var(--silver)', textTransform: 'uppercase' }}>Events This Year</span>
              </div>
            </div>
          </div>

          <div
            style={{
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                animation: 'marqueeScroll 22s linear infinite',
                whiteSpace: 'nowrap',
                width: 'max-content',
              }}
            >
              {/* Doubled for seamless loop */}
              <span
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 300,
                  fontSize: 14,
                  color: 'rgba(240,228,204,0.7)',
                  letterSpacing: '0.05em',
                }}
              >
                {MARQUEE_TEXT}
                {MARQUEE_TEXT}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT — Recognition */}
        <div>
          <span style={{ display: 'block', width: 32, height: 1, background: 'var(--amber)', marginBottom: 16, opacity: 0.6 }} />
          <h2
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontWeight: 300,
              fontSize: '2rem',
              color: 'var(--cream)',
              marginBottom: 40,
            }}
          >
            Recognition.
          </h2>

          {/* Award Badges */}
          <div
            className="awards-row"
            style={{
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
              marginBottom: 32,
            }}
          >
            {AWARDS.map((award) => (
              <a
                key={award.points}
                href="https://usaspiritsratings.com/en/winner-companies/2024/southern-edge-beverage-company-2660.htm"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none', display: 'block', flex: '1 1 200px' }}
                onMouseEnter={(e) => {
                  const badge = e.currentTarget.firstElementChild as HTMLElement | null
                  if (badge) {
                    badge.style.borderLeftColor = '#F0C040'
                    badge.style.transform = 'scale(1.02)'
                    badge.style.background = 'linear-gradient(135deg, var(--bg-surface) 0%, rgba(240,192,64,0.06) 50%, var(--bg-surface) 100%)'
                    badge.style.boxShadow = '0 0 24px rgba(212,120,26,0.12)'
                  }
                }}
                onMouseLeave={(e) => {
                  const badge = e.currentTarget.firstElementChild as HTMLElement | null
                  if (badge) {
                    badge.style.borderLeftColor = 'var(--gold)'
                    badge.style.transform = 'scale(1)'
                    badge.style.background = 'var(--bg-surface)'
                    badge.style.boxShadow = 'none'
                  }
                }}
              >
                <div
                  style={{
                    background: 'var(--bg-surface)',
                    borderRadius: 8,
                    padding: '20px 24px',
                    borderLeft: '3px solid var(--gold)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    backdropFilter: 'blur(4px)',
                    transition: 'border-color 0.2s, transform 0.2s, background 0.4s, box-shadow 0.2s',
                  }}
                >
                  <Award size={18} color="var(--gold)" style={{ marginBottom: 4 }} />
                  <span
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontWeight: 500,
                      fontSize: '1rem',
                      color: 'var(--cream)',
                    }}
                  >
                    {award.medal}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-sans)',
                      fontWeight: 300,
                      fontSize: 12,
                      color: 'var(--silver)',
                    }}
                  >
                    {award.competition}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-sans)',
                      fontWeight: 400,
                      fontSize: 13,
                      color: 'var(--amber)',
                    }}
                  >
                    {award.points}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-sans)',
                      fontWeight: 300,
                      fontSize: 11,
                      color: 'rgba(200,200,200,0.5)',
                    }}
                  >
                    {award.location}
                  </span>
                </div>
              </a>
            ))}
          </div>

          {/* Press Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {PRESS.map((item) => (
              <div
                key={item.pub}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--smoke)',
                  borderLeft: '2px solid var(--amber)',
                  borderRadius: 8,
                  padding: '20px 24px 20px 16px',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontWeight: 500,
                    fontSize: 10,
                    color: 'var(--silver)',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: 8,
                  }}
                >
                  {item.pub}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    fontSize: '1rem',
                    color: 'var(--cream)',
                    lineHeight: 1.5,
                    marginBottom: 12,
                  }}
                >
                  {item.quote}
                </p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontWeight: 400,
                    fontSize: 12,
                    color: 'var(--amber)',
                    textDecoration: 'none',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.7')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
                >
                  Read Article →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .events-layout {
          display: grid;
          grid-template-columns: 40% 60%;
          gap: 60px;
          align-items: start;
          position: relative;
        }
        @media (min-width: 768px) {
          .events-layout::after {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            left: calc(40% + 30px);
            width: 1px;
            background: var(--amber);
            opacity: 0.20;
            pointer-events: none;
          }
        }
        @media (max-width: 767px) {
          .events-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .awards-row {
            flex-direction: column;
          }
          .awards-row > * {
            flex: 1 1 auto !important;
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}
