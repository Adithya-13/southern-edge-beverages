'use client'

import { useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { MapPin } from 'lucide-react'
import { FIND_US } from '@/lib/constants'

export default function FindUs() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)

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

      if (mapRef.current) {
        gsap.fromTo(
          mapRef.current,
          { opacity: 0, y: 36 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: mapRef.current,
              start: 'top 85%',
              once: true,
            },
          }
        )
      }
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
        padding: 'clamp(80px,8vw,120px) clamp(20px,5vw,60px)',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: 'clamp(40px,5vw,56px)' }}>
          <span className="amber-rule" />
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--amber)',
              margin: '0 0 18px',
            }}
          >
            {FIND_US.eyebrow}
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-bebas)',
              fontWeight: 400,
              fontSize: 'clamp(2.75rem,6vw,5.5rem)',
              lineHeight: 0.95,
              letterSpacing: '0.01em',
              color: 'var(--cream)',
              margin: '0 0 20px',
            }}
          >
            {FIND_US.headline}
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: 'clamp(15px,1.6vw,18px)',
              lineHeight: 1.6,
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
            {FIND_US.states.map((state: string) => (
              <span
                key={state}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 9,
                  padding: '9px 18px',
                  borderRadius: 999,
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--smoke)',
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 400,
                  fontSize: 13,
                  letterSpacing: '0.03em',
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
                {state}
              </span>
            ))}
          </div>

          {/* CTA line */}
          <p
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: '0.04em',
              color: 'var(--amber)',
              margin: '28px 0 0',
            }}
          >
            <MapPin size={16} strokeWidth={1.75} aria-hidden style={{ flexShrink: 0 }} />
            {FIND_US.cta}
          </p>
        </div>

        {/* Map */}
        <div
          ref={mapRef}
          style={{
            maxWidth: 1000,
            margin: '0 auto',
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
      </div>

      <style>{`
        @media (max-width: 767px) {
          #findus .findus-pills {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
    </section>
  )
}
