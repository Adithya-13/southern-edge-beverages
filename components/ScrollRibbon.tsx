'use client'

import { useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { RIBBON_ITEMS } from '@/lib/constants'

export default function ScrollRibbon() {
  const ribbonRef = useRef<HTMLDivElement>(null)
  const driftRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!trackRef.current || !ribbonRef.current) return

    gsap.to(trackRef.current, {
      x: '-50%',
      repeat: -1,
      duration: 18,
      ease: 'linear',
    })

    // Scroll-driven counter-drift applied to an INNER wrapper so the amber band
    // itself stays full-bleed (no exposed background gap on the sides).
    gsap.fromTo(
      driftRef.current,
      { x: 0 },
      {
        x: 40,
        ease: 'none',
        scrollTrigger: {
          trigger: ribbonRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      }
    )
  }, { scope: ribbonRef })

  const allItems = [...RIBBON_ITEMS, ...RIBBON_ITEMS]

  return (
    <div
      ref={ribbonRef}
      style={{
        overflow: 'hidden',
        background: 'var(--amber)',
        padding: '14px 0',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div ref={driftRef} style={{ willChange: 'transform' }}>
        <div
          ref={trackRef}
          style={{
            display: 'flex',
            gap: 0,
            whiteSpace: 'nowrap',
            willChange: 'transform',
          }}
        >
          {allItems.map((item, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '18px',
                letterSpacing: '0.15em',
                color: '#080604',
                paddingLeft: 40,
                paddingRight: 40,
                flexShrink: 0,
              }}
            >
              {item} ◆
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
