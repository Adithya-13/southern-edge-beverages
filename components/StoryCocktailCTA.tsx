'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const CARDS = [
  {
    href: '/story',
    eyebrow: 'The Brand',
    title: 'Our Story',
    blurb: 'Southern charm, bottled — the people, places and patience behind every pour.',
  },
  {
    href: '/cocktails',
    eyebrow: 'Recipes',
    title: 'Signature Cocktails',
    blurb: 'Serves built for our spirits, from the It Takes Tea to Mango to the Salty Caramel Sour.',
  },
]

export default function StoryCocktailCTA() {
  return (
    <section
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-void)',
        padding: 'clamp(40px,5vw,64px) clamp(20px,5vw,60px)',
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gap: 'clamp(20px,3vw,32px)',
        }}
        className="cta-grid"
      >
        {CARDS.map((card) => (
          <Link key={card.href} href={card.href} className="cta-card">
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 'var(--fs-eyebrow)',
                letterSpacing: 'var(--track-eyebrow)',
                textTransform: 'uppercase',
                color: 'var(--amber)',
              }}
            >
              {card.eyebrow}
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 400,
                fontSize: 'var(--fs-h2)',
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                color: 'var(--cream)',
                margin: '14px 0 12px',
              }}
            >
              {card.title}
            </h3>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 400,
                fontSize: 'var(--fs-lead)',
                lineHeight: 'var(--lh-body)',
                color: 'rgba(240,228,204,0.66)',
                margin: 0,
              }}
            >
              {card.blurb}
            </p>
            <span
              className="cta-link"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 'clamp(24px,3vw,36px)',
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 14,
                letterSpacing: 'var(--track-data)',
                textTransform: 'uppercase',
                color: 'var(--amber)',
              }}
            >
              Explore
              <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden />
            </span>
          </Link>
        ))}
      </div>

      <style>{`
        .cta-grid { grid-template-columns: repeat(2, 1fr); }
        @media (max-width: 767px) { .cta-grid { grid-template-columns: 1fr; } }
        .cta-card {
          display: flex;
          flex-direction: column;
          padding: clamp(28px,4vw,48px);
          background: var(--bg-surface);
          border: 1px solid var(--smoke);
          border-radius: 14px;
          text-decoration: none;
          transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
          will-change: transform;
        }
        .cta-card:hover {
          transform: translateY(-6px);
          border-color: rgba(212,120,26,0.55);
          box-shadow: 0 20px 44px rgba(8,6,4,0.55), 0 0 0 1px rgba(212,120,26,0.25);
        }
        .cta-card:hover .cta-link { color: var(--cream); }
      `}</style>
    </section>
  )
}
