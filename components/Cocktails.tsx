'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { COCKTAIL_GROUPS, type CocktailGroup, type Cocktail } from '@/lib/constants'

function CocktailRow({ cocktail, accentColor }: { cocktail: Cocktail; accentColor: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      style={{
        borderBottom: '1px solid var(--smoke)',
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '16px 4px',
          textAlign: 'left',
          color: open ? accentColor : 'var(--cream)',
          transition: 'color 0.25s ease',
        }}
        onMouseEnter={(e) => {
          if (!open) e.currentTarget.style.color = accentColor
        }}
        onMouseLeave={(e) => {
          if (!open) e.currentTarget.style.color = 'var(--cream)'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: 15,
            letterSpacing: '0.01em',
            lineHeight: 1.3,
          }}
        >
          {cocktail.name}
        </span>
        <ChevronDown
          size={18}
          color={open ? accentColor : 'var(--silver)'}
          style={{
            flexShrink: 0,
            transition: 'transform 0.3s ease, color 0.25s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      <div
        style={{
          overflow: 'hidden',
          maxHeight: open ? 600 : 0,
          opacity: open ? 1 : 0,
          transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease',
        }}
      >
        <div style={{ padding: '4px 4px 24px' }}>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: 10,
              letterSpacing: 'var(--track-eyebrow-sm)',
              textTransform: 'uppercase',
              color: accentColor,
              marginBottom: 12,
            }}
          >
            Ingredients
          </span>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, marginBottom: 22 }}>
            {cocktail.ingredients.map((ing) => (
              <li
                key={ing}
                style={{
                  position: 'relative',
                  paddingLeft: 18,
                  marginBottom: 8,
                  fontFamily: 'var(--font-body)',
                  fontWeight: 400,
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: 'rgba(240,228,204,0.78)',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '0.55em',
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    background: accentColor,
                  }}
                />
                {ing}
              </li>
            ))}
          </ul>

          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: 10,
              letterSpacing: 'var(--track-eyebrow-sm)',
              textTransform: 'uppercase',
              color: accentColor,
              marginBottom: 12,
            }}
          >
            Instructions
          </span>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 14,
              lineHeight: 1.7,
              color: 'rgba(240,228,204,0.78)',
            }}
          >
            {cocktail.instructions}
          </p>
        </div>
      </div>
    </div>
  )
}

function CocktailColumn({
  group,
  columnRef,
}: {
  group: CocktailGroup
  columnRef: (el: HTMLDivElement | null) => void
}) {
  return (
    <div
      ref={columnRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
      }}
    >
      {/* Column header */}
      <div
        style={{
          textAlign: 'center',
          paddingBottom: 28,
          marginBottom: 8,
          borderBottom: `1px solid ${group.accentColor}33`,
        }}
      >
        <div
          style={{
            height: 150,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <Image
            src={group.bottleFile}
            alt={group.spirit}
            width={120}
            height={300}
            style={{ height: 150, width: 'auto', objectFit: 'contain' }}
          />
        </div>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            fontSize: 9,
            letterSpacing: 'var(--track-eyebrow-sm)',
            textTransform: 'uppercase',
            color: 'var(--silver)',
            marginBottom: 8,
          }}
        >
          Southern Edge
        </span>
        <h3
          style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 'clamp(1.8rem,2.6vw,2.4rem)',
            letterSpacing: '0',
            lineHeight: 1.1,
            color: group.accentColor,
          }}
        >
          {group.spirit}
        </h3>
      </div>

      {/* Body */}
      <div style={{ marginTop: 8 }}>
        {group.cocktails.map((cocktail) => (
          <CocktailRow key={cocktail.id} cocktail={cocktail} accentColor={group.accentColor} />
        ))}
      </div>
    </div>
  )
}

export default function Cocktails() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const columnRefs = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(
    () => {
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      const headerTargets = headerRef.current
        ? Array.from(headerRef.current.children)
        : []

      gsap.fromTo(
        headerTargets,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )

      const columns = columnRefs.current.filter(Boolean)
      gsap.fromTo(
        columns,
        { opacity: 0, y: 36 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 68%' },
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="cocktails"
      ref={sectionRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-void)',
        padding: 'clamp(88px,9vw,130px) clamp(20px,5vw,60px)',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: 'clamp(56px,6vw,80px)' }}>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 'var(--fs-eyebrow)',
              letterSpacing: 'var(--track-eyebrow)',
              textTransform: 'uppercase',
              color: 'var(--amber)',
              marginBottom: 18,
            }}
          >
            Cocktails
          </span>
          <h2
            style={{
              margin: 0,
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'var(--fs-h1)',
              letterSpacing: '-0.01em',
              lineHeight: 'var(--lh-h1)',
              color: 'var(--cream)',
              marginBottom: 24,
            }}
          >
            Signature Cocktails
          </h2>
          <p
            style={{
              margin: '0 auto',
              maxWidth: 620,
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 15,
              lineHeight: 1.7,
              color: 'rgba(240,228,204,0.65)',
            }}
          >
            Discover expertly crafted cocktail recipes featuring our premium spirits. Each recipe is
            designed to showcase the unique flavors of our collection.
          </p>
        </div>

        <div className="cocktails-grid">
          {COCKTAIL_GROUPS.map((group, i) => (
            <CocktailColumn
              key={group.spiritId}
              group={group}
              columnRef={(el) => {
                columnRefs.current[i] = el
              }}
            />
          ))}
        </div>
      </div>

      <style>{`
        .cocktails-grid {
          display: grid;
          grid-template-columns: repeat(${COCKTAIL_GROUPS.length}, 1fr);
          gap: clamp(40px, 6vw, 88px);
          align-items: start;
          max-width: ${Math.min(1180, COCKTAIL_GROUPS.length * 470)}px;
          margin: 0 auto;
        }
        @media (max-width: 900px) {
          .cocktails-grid {
            grid-template-columns: 1fr;
            gap: 56px;
            max-width: 460px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  )
}
