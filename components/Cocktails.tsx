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
            fontFamily: 'var(--font-dm-sans)',
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
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 600,
              fontSize: 10,
              letterSpacing: '0.25em',
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
                  fontFamily: 'var(--font-dm-sans)',
                  fontWeight: 300,
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
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 600,
              fontSize: 10,
              letterSpacing: '0.25em',
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
              fontFamily: 'var(--font-cormorant)',
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 17,
              lineHeight: 1.6,
              color: 'rgba(240,228,204,0.82)',
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
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            fontSize: 9,
            letterSpacing: '0.32em',
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
            fontFamily: 'var(--font-bebas)',
            fontWeight: 400,
            fontSize: 'clamp(1.8rem,2.6vw,2.4rem)',
            letterSpacing: '0.02em',
            lineHeight: 1.05,
            color: group.accentColor,
          }}
        >
          {group.spirit}
        </h3>
      </div>

      {/* Body */}
      {group.comingSoon ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '48px 20px',
            marginTop: 24,
            border: `1px solid ${group.accentColor}26`,
            borderRadius: 10,
            background: `linear-gradient(160deg, ${group.accentColor}0D 0%, transparent 70%)`,
          }}
        >
          <span style={{ display: 'block', width: 32, height: 1, background: group.accentColor, opacity: 0.6, marginBottom: 24 }} />
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-cormorant)',
              fontWeight: 300,
              fontStyle: 'italic',
              fontSize: 'clamp(1.4rem,2vw,1.7rem)',
              lineHeight: 1.35,
              color: 'var(--cream)',
              marginBottom: 16,
            }}
          >
            Signature cocktails coming soon
          </p>
          <p
            style={{
              margin: 0,
              maxWidth: 260,
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: 13,
              lineHeight: 1.6,
              color: 'rgba(240,228,204,0.6)',
            }}
          >
            Our Passionberry recipes are in the lab.
          </p>
          <span
            style={{
              fontFamily: 'var(--font-vibes)',
              fontSize: 26,
              color: group.accentColor,
              opacity: 0.85,
              marginTop: 22,
            }}
          >
            Stay tuned
          </span>
        </div>
      ) : (
        <div style={{ marginTop: 8 }}>
          {group.cocktails.map((cocktail) => (
            <CocktailRow key={cocktail.id} cocktail={cocktail} accentColor={group.accentColor} />
          ))}
        </div>
      )}
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
        padding: 'clamp(80px,8vw,120px) clamp(20px,5vw,60px)',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div ref={headerRef} style={{ textAlign: 'center', marginBottom: 'clamp(56px,6vw,80px)' }}>
          <span className="amber-rule" />
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: '0.3em',
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
              fontFamily: 'var(--font-bebas)',
              fontWeight: 400,
              fontSize: 'clamp(3rem,7vw,6rem)',
              letterSpacing: '0.01em',
              lineHeight: 0.95,
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
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: 15,
              lineHeight: 1.7,
              color: 'rgba(240,228,204,0.65)',
            }}
          >
            Discover expertly crafted cocktail recipes featuring our premium spirits. Each recipe is
            designed to showcase the unique flavors of our collection.
          </p>
        </div>

        {/* 3-column layout */}
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
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(32px, 4vw, 56px);
          align-items: start;
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
