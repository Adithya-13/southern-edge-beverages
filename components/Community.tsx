'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const HEIGHTS = [240, 180, 300, 200, 260, 180, 300, 220, 240]
const ACCENTS = ['var(--amber)', 'var(--coral)', 'var(--lime)']

// Split 9 items into 3 columns (col 0: items 0,3,6 | col 1: items 1,4,7 | col 2: items 2,5,8)
const COLUMNS = [
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
]

export default function Community() {
  const sectionRef = useRef<HTMLElement>(null)
  const col0Ref = useRef<HTMLDivElement>(null)
  const col1Ref = useRef<HTMLDivElement>(null)
  const col2Ref = useRef<HTMLDivElement>(null)
  const colRefs = [col0Ref, col1Ref, col2Ref]

  useGSAP(
    () => {
      colRefs.forEach((colRef, i) => {
        if (!colRef.current) return
        const isOdd = i === 1
        gsap.fromTo(
          colRef.current,
          { x: isOdd ? 60 : -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        )
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="community"
      ref={sectionRef}
      style={{
        background: 'var(--bg-void)',
        padding: 'clamp(80px,10vw,120px) clamp(20px,5vw,40px)',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--silver)',
            marginBottom: 16,
          }}
        >
          THE COMMUNITY
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: 'clamp(2.5rem,5vw,5rem)',
            color: 'var(--cream)',
          }}
        >
          Taste The Edge.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: 16,
            color: 'rgba(240,228,204,0.6)',
            maxWidth: 480,
            margin: '16px auto 0',
          }}
        >
          Join us at tastings, events, and everywhere Southern Edge pours.
        </p>
        <span
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            fontSize: 14,
            color: 'var(--amber)',
            marginTop: 16,
            display: 'block',
            textAlign: 'center',
          }}
        >
          @southernedgebeverages
        </span>
      </div>

      {/* Masonry Grid */}
      <div className="community-grid" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {COLUMNS.map((itemIndices, colIdx) => (
          <div key={colIdx} ref={colRefs[colIdx]} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {itemIndices.map((itemIdx) => {
              const accent = ACCENTS[itemIdx % 3]
              return (
                <div
                  key={itemIdx}
                  style={{
                    height: HEIGHTS[itemIdx],
                    background: 'var(--bg-surface)',
                    borderRadius: 8,
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* Radial accent overlay */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `radial-gradient(circle at 30% 40%, ${accent}22 0%, transparent 60%)`,
                      zIndex: 0,
                    }}
                  />
                  {/* SE circle logo watermark */}
                  <div style={{ position: 'absolute', zIndex: 1, opacity: 0.12 }}>
                    <Image
                      src="/images/logo_se_circle.png"
                      alt=""
                      width={48}
                      height={48}
                      aria-hidden="true"
                    />
                  </div>
                  {/* Handle watermark text */}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      left: 12,
                      fontFamily: 'var(--font-dm-sans)',
                      fontSize: 11,
                      color: 'rgba(240,228,204,0.06)',
                      userSelect: 'none',
                      zIndex: 2,
                    }}
                  >
                    @southernedgebeverages
                  </span>
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <style>{`
        .community-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 1199px) and (min-width: 768px) {
          .community-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 767px) {
          .community-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}
