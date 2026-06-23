'use client'

import { useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { MapPin, ArrowUpRight, ChevronDown, Search, X } from 'lucide-react'
import { FIND_US, STORES, type StoreLocation } from '@/lib/constants'

const SHOW_MAP = false

function mapsUrl(store: StoreLocation) {
  const query = encodeURIComponent(`${store.name} ${store.addressLines.join(' ')}`)
  return `https://www.google.com/maps/search/?api=1&query=${query}`
}

export default function FindUs() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  // All states collapsed on load; one open at a time.
  const [openState, setOpenState] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  const q = query.trim().toLowerCase()
  const matches = (store: StoreLocation) =>
    !q ||
    store.name.toLowerCase().includes(q) ||
    store.addressLines.some((l) => l.toLowerCase().includes(q))
  const filteredStores = STORES.map((group) => ({
    ...group,
    locations: group.locations.filter(matches),
  })).filter((group) => group.locations.length > 0)
  const totalMatches = filteredStores.reduce((n, g) => n + g.locations.length, 0)

  useGSAP(
    () => {
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      const revealTargets = headerRef.current
        ? Array.from(headerRef.current.children)
        : []

      gsap.fromTo(
        revealTargets,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      )

      // NOTE: the map is intentionally NOT animated. A Google My Maps embed that
      // initializes while its container is opacity:0 / transformed (mid scroll-reveal)
      // renders permanently blank — so the map stays static and fully visible.
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="findus"
      ref={sectionRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-deep)',
        padding: 'clamp(80px,8vw,112px) clamp(20px,5vw,60px)',
      }}
    >
      {/* Ghosted oversized wordmark behind the header (type-as-texture) — OUTSIDE headerRef */}
      <span
        className="ghost-word"
        aria-hidden
        style={{ top: '4%', left: '50%', transform: 'translateX(-50%)' }}
      >
        FIND US
      </span>

      <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: 'clamp(40px,5vw,56px)' }}>
          <span className="amber-rule" />
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 'var(--fs-eyebrow)',
              letterSpacing: 'var(--track-eyebrow)',
              textTransform: 'uppercase',
              color: 'var(--amber)',
              margin: '0 0 18px',
            }}
          >
            {FIND_US.eyebrow}
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'var(--fs-h1)',
              lineHeight: 'var(--lh-h1)',
              letterSpacing: '-0.01em',
              color: 'var(--cream)',
              margin: '0 0 20px',
            }}
          >
            {FIND_US.headline}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 'var(--fs-lead)',
              lineHeight: 'var(--lh-body)',
              color: 'rgba(240,228,204,0.7)',
              maxWidth: 560,
              margin: '0 auto',
            }}
          >
            {FIND_US.sub}
          </p>

          {/* State pills */}
          <div
            className="findus-pills"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 12,
              margin: '28px 0 0',
            }}
          >
            {STORES.map((group) => (
              <span
                key={group.state}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '9px 18px',
                  borderRadius: 999,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--smoke)',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  fontSize: 13,
                  letterSpacing: 'var(--track-data)',
                  color: 'var(--cream)',
                  whiteSpace: 'nowrap',
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    background: 'var(--amber)',
                    boxShadow: '0 0 8px rgba(212,120,26,0.7)',
                    flexShrink: 0,
                  }}
                />
                {group.state}
              </span>
            ))}
          </div>

          {/* CTA line */}
          <p
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: 'var(--track-data)',
              color: 'var(--amber)',
              margin: '28px 0 0',
            }}
          >
            <MapPin size={16} strokeWidth={1.75} aria-hidden style={{ flexShrink: 0 }} />
            {FIND_US.cta}
          </p>
        </div>

        {/* Store search */}
        <div style={{ maxWidth: 1000, margin: '0 auto clamp(20px,2.5vw,28px)' }}>
          <div className="store-search">
            <Search size={18} strokeWidth={1.75} aria-hidden style={{ color: 'var(--amber)', flexShrink: 0 }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by store or city…"
              aria-label="Search stores by name or city"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="store-search-clear"
              >
                <X size={16} strokeWidth={1.75} aria-hidden />
              </button>
            )}
          </div>
          {q && (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 13,
                letterSpacing: 'var(--track-data)',
                color: 'rgba(240,228,204,0.55)',
                margin: '14px 0 0',
                textAlign: 'center',
              }}
            >
              {totalMatches} {totalMatches === 1 ? 'store' : 'stores'} found
            </p>
          )}
        </div>

        {/* Store list — one collapsible dropdown per state (all collapsed on load) */}
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gap: 16 }}>
          {filteredStores.length === 0 && (
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'var(--fs-lead)',
                color: 'rgba(240,228,204,0.6)',
                textAlign: 'center',
                padding: 'clamp(28px,4vw,44px)',
              }}
            >
              No stores match &ldquo;{query}&rdquo;. Try a different name or city.
            </p>
          )}
          {filteredStores.map((group) => {
            // While searching, every matching state is expanded; otherwise it's the accordion.
            const isOpen = q ? true : openState === group.state
            const panelId = `stores-${group.state.replace(/\s+/g, '-').toLowerCase()}`
            return (
              <div
                key={group.state}
                style={{
                  border: '1px solid var(--smoke)',
                  borderRadius: 12,
                  background: 'var(--bg-surface)',
                  overflow: 'hidden',
                }}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenState((s) => (s === group.state ? null : group.state))}
                  className="state-toggle"
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-accent)',
                      fontWeight: 400,
                      fontStyle: 'italic',
                      fontSize: 'var(--fs-h3)',
                      color: 'var(--cream)',
                    }}
                  >
                    {group.state}
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontWeight: 500,
                        fontSize: 13,
                        letterSpacing: 'var(--track-data)',
                        color: 'rgba(240,228,204,0.55)',
                      }}
                    >
                      {group.locations.length} {group.locations.length === 1 ? 'store' : 'stores'}
                    </span>
                    <ChevronDown
                      size={20}
                      strokeWidth={1.75}
                      aria-hidden
                      style={{
                        color: 'var(--amber)',
                        transition: 'transform 0.3s ease',
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        flexShrink: 0,
                      }}
                    />
                  </span>
                </button>
                {isOpen && (
                  <div id={panelId} className="state-panel">
                    <div className="store-grid">
                      {group.locations.map((store) => (
                        <a
                          key={store.name}
                          href={mapsUrl(store)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="store-card"
                          aria-label={`Open ${store.name} in Google Maps`}
                        >
                          <p
                            style={{
                              fontFamily: 'var(--font-accent)',
                              fontWeight: 500,
                              fontSize: '1.05rem',
                              lineHeight: 1.35,
                              color: 'var(--cream)',
                              margin: 0,
                            }}
                          >
                            {store.name}
                          </p>
                          <p
                            style={{
                              fontFamily: 'var(--font-body)',
                              fontWeight: 400,
                              fontSize: 14,
                              lineHeight: 1.55,
                              color: 'rgba(240,228,204,0.66)',
                              margin: 0,
                            }}
                          >
                            {store.addressLines.map((line) => (
                              <span key={line} style={{ display: 'block' }}>
                                {line}
                              </span>
                            ))}
                          </p>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              fontFamily: 'var(--font-body)',
                              fontWeight: 500,
                              fontSize: 13,
                              letterSpacing: 'var(--track-data)',
                              color: 'var(--amber)',
                              marginTop: 'auto',
                            }}
                          >
                            Get Directions
                            <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden />
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {SHOW_MAP && (
          <div
            ref={mapRef}
            style={{
              maxWidth: 1000,
              margin: 'clamp(40px,5vw,56px) auto 0',
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid var(--smoke)',
              boxShadow:
                '0 0 0 1px rgba(212,120,26,0.08), 0 30px 80px -40px rgba(212,120,26,0.4), 0 20px 60px -30px rgba(8,6,4,0.9)',
              background: 'var(--bg-surface)',
            }}
          >
            <iframe
              src={FIND_US.mapEmbed}
              title="Where to purchase Southern Edge"
              width="100%"
              height={480}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ border: 0, display: 'block' }}
            />
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 767px) {
          #findus .findus-pills {
            flex-direction: column;
            align-items: center;
          }
        }
        .store-search {
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 520px;
          margin: 0 auto;
          padding: 13px 18px;
          background: var(--bg-surface);
          border: 1px solid var(--smoke);
          border-radius: 999px;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .store-search:focus-within {
          border-color: rgba(212,120,26,0.55);
          box-shadow: 0 0 0 1px rgba(212,120,26,0.25);
        }
        .store-search input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--cream);
          font-family: var(--font-body);
          font-weight: 400;
          font-size: 15px;
          letter-spacing: 0.01em;
        }
        .store-search input::placeholder { color: rgba(240,228,204,0.4); }
        .store-search-clear {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          color: rgba(240,228,204,0.55);
          padding: 0;
          transition: color 0.2s ease;
        }
        .store-search-clear:hover { color: var(--cream); }
        .state-toggle {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: clamp(20px,2.5vw,28px) clamp(20px,3vw,32px);
          background: transparent;
          border: none;
          cursor: pointer;
          text-align: left;
          transition: background 0.25s ease;
        }
        .state-toggle:hover { background: rgba(212,120,26,0.06); }
        .state-panel {
          padding: 0 clamp(20px,3vw,32px) clamp(24px,3vw,32px);
          animation: statePanelIn 0.35s ease;
        }
        @keyframes statePanelIn {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .store-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(16px, 2vw, 24px);
          align-items: stretch;
        }
        @media (max-width: 1023px) and (min-width: 640px) {
          .store-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 639px) {
          .store-grid {
            grid-template-columns: 1fr;
            max-width: 420px;
            margin: 0 auto;
          }
        }
        .store-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 24px 24px 22px;
          background: var(--bg-surface);
          border: 1px solid var(--smoke);
          border-radius: 12px;
          text-decoration: none;
          transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
          will-change: transform;
        }
        .store-card:hover {
          transform: translateY(-5px);
          border-color: rgba(212,120,26,0.55);
          box-shadow: 0 16px 36px rgba(8,6,4,0.5), 0 0 0 1px rgba(212,120,26,0.25);
        }
      `}</style>
    </section>
  )
}
