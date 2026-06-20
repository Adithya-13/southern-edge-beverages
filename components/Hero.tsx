'use client'

import { useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'

interface HeroProps {
  isVisible: boolean
}

export default function Hero({ isVisible }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const atmoVideoRef = useRef<HTMLDivElement | null>(null)
  const wordmarkRef = useRef<HTMLDivElement | null>(null)
  const scrollPromptRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      if (!isVisible) return

      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (reduced) {
        gsap.set([atmoVideoRef.current, wordmarkRef.current], { opacity: 1 })
        return
      }

      // Fades in once and stays put — no further change. This is the landing
      // view, not a beat in a sequence.
      gsap.fromTo(atmoVideoRef.current, { opacity: 0 }, { opacity: 1, duration: 1 })
      gsap.fromTo(
        wordmarkRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3 },
      )

      const bob = gsap.to(scrollPromptRef.current, {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 0.9,
        ease: 'sine.inOut',
      })

      return () => {
        bob.kill()
      }
    },
    { scope: sectionRef, dependencies: [isVisible] },
  )

  return (
    <section
      id="hero"
      ref={sectionRef}
      style={{
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: '#080604',
      }}
    >
      {/* Atmosphere: the southern world video opens the home section and just stays. */}
      <div ref={atmoVideoRef} style={{ position: 'absolute', inset: 0, opacity: 0 }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/hero_atmosphere_poster.jpg"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', background: '#080604' }}
        >
          <source src="/videos/hero_atmosphere.mp4" type="video/mp4" />
        </video>
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(8,6,4,0.3) 0%, rgba(8,6,4,0) 35%, rgba(8,6,4,0.65) 100%)',
          }}
        />
      </div>

      {/* Static wordmark — fades in once, never animates again. */}
      <div
        ref={wordmarkRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          opacity: 0,
          zIndex: 4,
          pointerEvents: 'none',
        }}
      >
        <div style={{ width: 48, height: 1, background: 'var(--amber)', margin: '0 auto 12px' }} />
        <div
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(28px,3.5vw,52px)',
            letterSpacing: '0.04em',
            color: 'rgba(240,228,204,0.80)',
            textTransform: 'uppercase',
            lineHeight: 1.1,
          }}
        >
          SOUTHERN EDGE
        </div>
        <div
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(28px,3.5vw,52px)',
            letterSpacing: '0.04em',
            color: 'rgba(240,228,204,0.80)',
            textTransform: 'uppercase',
            lineHeight: 1.1,
          }}
        >
          FINE SPIRITS
        </div>
      </div>

      {/* Scroll prompt — invites the user down into the reveal section below. */}
      <div
        ref={scrollPromptRef}
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 7,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontSize: 11,
            letterSpacing: '0.2em',
            color: 'rgba(200,200,200,0.4)',
            textTransform: 'uppercase',
            display: 'block',
          }}
        >
          Scroll to Reveal
        </span>
        <span
          style={{
            display: 'block',
            color: 'rgba(200,200,200,0.4)',
            fontSize: 18,
            marginTop: 8,
          }}
        >
          ↓
        </span>
      </div>
    </section>
  )
}
