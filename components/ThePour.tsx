'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useGSAP } from '@gsap/react'
import GlassPour from './GlassPour'

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin)

interface Cocktail {
  name: string
  ingredients: string[]
}
interface Pour {
  id: string
  spirit: string
  spiritFull: string
  accent: string
  bottle: string
  tastingNotes: string[]
  cocktail: Cocktail
}

const POURS: Pour[] = [
  {
    id: 'sweettea',
    spirit: 'Sweet Tea Vodka',
    spiritFull: 'Sweet Tea Flavored Vodka',
    accent: '#C23B22',
    bottle: '/images/bottle_caramel.png',
    tastingNotes: ['Green tea nose', 'Sweet, inviting palate', 'Short, delightful finish'],
    cocktail: {
      name: 'Spiked Peach Tea',
      ingredients: ['2 oz SE Sweet Tea Vodka', 'Peach purée', 'Splash of sour mix', 'Peach garnish'],
    },
  },
  {
    id: 'caramel',
    spirit: 'Salted Caramel Whiskey',
    spiritFull: 'Salted Caramel Flavored Whiskey',
    accent: '#D4781A',
    bottle: '/images/bottle_caramel.png',
    tastingNotes: ['Macadamia & hazelnut nose', 'Maple & salted donut palate', 'Caramel finish'],
    cocktail: {
      name: 'Cranberry Caramel Cooler',
      ingredients: ['1½ oz SE Salted Caramel Whiskey', '2 oz cranberry juice', '1 oz simple syrup', 'Club soda', 'Cranberries & rosemary'],
    },
  },
  {
    id: 'limon',
    spirit: 'Se Limón Tequila',
    spiritFull: 'Se Limón Flavored Tequila',
    accent: '#7CB342',
    bottle: '/images/bottle_caramel.png',
    tastingNotes: ['Fresh citrus nose', '100% Blue Agave', '6× distilled, smooth finish'],
    cocktail: {
      name: 'Se Limón Paloma',
      ingredients: ['2 oz Se Limón Tequila', 'Grapefruit soda', 'Squeeze of lime', 'Salt rim'],
    },
  },
]

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-dm-sans)',
  fontWeight: 500,
  fontSize: 11,
  letterSpacing: '0.25em',
  textTransform: 'uppercase',
}

export default function ThePour() {
  const sectionRef = useRef<HTMLElement>(null)
  const detailsRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [inView, setInView] = useState(false)

  const current = POURS[activeIndex]

  // In-view gate via IntersectionObserver — drives GlassPour active + auto-cycle.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Auto-cycle every 6s while in view. Including activeIndex resets the timer on
  // manual selection (effect tears down + rebuilds).
  useEffect(() => {
    if (!inView) return
    intervalRef.current = setInterval(() => {
      setActiveIndex((i) => (i + 1) % POURS.length)
    }, 6000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [inView, activeIndex])

  // Entrance: fade/slide zones in once when section enters viewport.
  useGSAP(
    () => {
      gsap.from('.pour-zone', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%', once: true },
      })
    },
    { scope: sectionRef },
  )

  // Re-draw tasting notes + ingredients on every spirit change (and first mount).
  useGSAP(
    () => {
      const lines = gsap.utils.toArray<SVGLineElement>('.draw-line')
      const texts = gsap.utils.toArray<HTMLElement>('.draw-text')

      gsap.fromTo(
        lines,
        { drawSVG: '0%' },
        { drawSVG: '100%', duration: 0.6, stagger: 0.07, ease: 'power2.out' },
      )
      gsap.fromTo(
        texts,
        { opacity: 0, x: 12 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.07, ease: 'power2.out' },
      )
    },
    { scope: detailsRef, dependencies: [activeIndex] },
  )

  const handleSelect = (i: number) => setActiveIndex(i)

  return (
    <section
      id="thepour"
      ref={sectionRef}
      style={{
        background: 'var(--bg-deep)',
        padding: 'clamp(80px, 10vw, 120px) clamp(20px, 4vw, 56px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div className="pour-zone" style={{ textAlign: 'center', marginBottom: 'clamp(48px, 6vw, 80px)' }}>
        <span style={{ ...labelStyle, color: 'var(--silver)', display: 'block', marginBottom: 16 }}>
          THE POUR
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(56px, 9vw, 120px)',
            color: 'var(--cream)',
            letterSpacing: '0.02em',
            lineHeight: 1,
            margin: 0,
          }}
        >
          Crafted To Order.
        </h2>
      </div>

      {/* 3-zone stage */}
      <div className="pour-stage">
        {/* LEFT — selector */}
        <div className="pour-zone pour-selector">
          {POURS.map((p, i) => {
            const isActive = i === activeIndex
            return (
              <button
                key={p.id}
                onClick={() => handleSelect(i)}
                className="pour-select-row"
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 16,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  padding: '14px 0',
                  width: '100%',
                  position: 'relative',
                  color: isActive ? p.accent : 'rgba(240,228,204,0.5)',
                  transition: 'color 0.4s ease',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontSize: 12,
                    letterSpacing: '0.15em',
                    opacity: 0.8,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-bebas)',
                    fontSize: 'clamp(22px, 2.4vw, 34px)',
                    letterSpacing: '0.03em',
                    lineHeight: 1.05,
                  }}
                >
                  {p.spirit}
                </span>
                {/* drawn underline marker for active row */}
                <svg
                  width="100%"
                  height="2"
                  viewBox="0 0 100 2"
                  preserveAspectRatio="none"
                  style={{
                    position: 'absolute',
                    left: 0,
                    bottom: 4,
                    width: '70%',
                    opacity: isActive ? 1 : 0,
                    transition: 'opacity 0.4s ease',
                  }}
                >
                  <line
                    x1="0"
                    y1="1"
                    x2="100"
                    y2="1"
                    stroke={p.accent}
                    strokeWidth="2"
                    style={{
                      transition: 'stroke 0.4s ease',
                      strokeDasharray: 100,
                      strokeDashoffset: isActive ? 0 : 100,
                      transitionProperty: 'stroke-dashoffset, stroke',
                      transitionDuration: '0.5s',
                    }}
                  />
                </svg>
              </button>
            )
          })}
        </div>

        {/* CENTER — glass */}
        <div className="pour-zone pour-center">
          {/* radial glow */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at 50% 45%, ${current.accent}33, transparent 62%)`,
              transition: 'background 0.6s ease',
              pointerEvents: 'none',
            }}
          />
          {/* secondary bottle, low opacity */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={current.bottle}
            alt=""
            aria-hidden
            className="pour-bottle"
            style={{
              position: 'absolute',
              right: '8%',
              bottom: 0,
              height: '78%',
              width: 'auto',
              opacity: 0.5,
              filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.6))',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          <div className="pour-glass-wrap" style={{ position: 'relative', zIndex: 1 }}>
            <GlassPour color={current.accent} pourId={current.id} active={inView} />
          </div>
          {/* cocktail name under glass */}
          <p
            className="pour-cocktail-name"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontStyle: 'italic',
              fontSize: 'clamp(24px, 3vw, 40px)',
              color: 'var(--cream)',
              textAlign: 'center',
              marginTop: 28,
              position: 'relative',
              zIndex: 1,
            }}
          >
            {current.cocktail.name}
          </p>
        </div>

        {/* RIGHT — details */}
        <div className="pour-zone pour-details" ref={detailsRef}>
          <div style={{ marginBottom: 40 }}>
            <span style={{ ...labelStyle, color: 'var(--silver)', display: 'block', marginBottom: 20 }}>
              Tasting Notes
            </span>
            {current.tastingNotes.map((note, i) => (
              <div key={i} style={{ marginBottom: 18 }}>
                <span
                  className="draw-text"
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: 18,
                    color: 'var(--cream)',
                    display: 'block',
                    marginBottom: 8,
                  }}
                >
                  {note}
                </span>
                <svg width="100%" height="1" viewBox="0 0 100 1" preserveAspectRatio="none" style={{ display: 'block' }}>
                  <line className="draw-line" x1="0" y1="0.5" x2="100" y2="0.5" stroke="rgba(240,228,204,0.25)" strokeWidth="1" />
                </svg>
              </div>
            ))}
          </div>

          <div>
            <span style={{ ...labelStyle, color: 'var(--silver)', display: 'block', marginBottom: 20 }}>
              The Serve
            </span>
            {current.cocktail.ingredients.map((ing, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div className="draw-text" style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span
                    aria-hidden
                    style={{
                      width: 6,
                      height: 6,
                      flexShrink: 0,
                      background: current.accent,
                      transform: 'rotate(45deg)',
                      transition: 'background 0.4s ease',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-dm-sans)',
                      fontWeight: 300,
                      fontSize: 14,
                      letterSpacing: '0.02em',
                      color: 'var(--cream)',
                    }}
                  >
                    {ing}
                  </span>
                </div>
                <svg width="100%" height="1" viewBox="0 0 100 1" preserveAspectRatio="none" style={{ display: 'block' }}>
                  <line className="draw-line" x1="0" y1="0.5" x2="100" y2="0.5" stroke="rgba(240,228,204,0.16)" strokeWidth="1" />
                </svg>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .pour-stage {
          display: grid;
          grid-template-columns: 1fr 1.2fr 1fr;
          gap: clamp(24px, 4vw, 64px);
          align-items: center;
          max-width: 1280px;
          margin: 0 auto;
        }
        .pour-selector {
          display: flex;
          flex-direction: column;
        }
        .pour-center {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 420px;
        }
        .pour-glass-wrap {
          width: 200px;
          max-width: 200px;
        }
        @media (max-width: 768px) {
          .pour-stage {
            grid-template-columns: 1fr;
            gap: 36px;
          }
          .pour-selector {
            flex-direction: row;
            overflow-x: auto;
            gap: 20px;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
          }
          .pour-selector::-webkit-scrollbar { display: none; }
          .pour-select-row {
            width: auto !important;
            flex-shrink: 0;
            padding: 8px 0 !important;
          }
          .pour-select-row svg { display: none; }
          .pour-center { min-height: 320px; order: 2; }
          .pour-glass-wrap { width: 160px; max-width: 160px; }
          .pour-bottle { right: 2% !important; height: 60% !important; }
        }
      `}</style>
    </section>
  )
}
