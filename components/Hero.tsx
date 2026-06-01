'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

interface HeroProps {
  isVisible: boolean
}

const FRAME_COUNT = 120
const frameUrls = Array.from(
  { length: FRAME_COUNT },
  (_, i) => `/images/frames/frame_${String(i + 1).padStart(3, '0')}.webp`,
)

export default function Hero({ isVisible }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const frameRef = useRef<HTMLImageElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const bottleWrapRef = useRef<HTMLDivElement | null>(null)
  const glowRef = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLDivElement | null>(null)
  const scrollPromptRef = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      if (!isVisible) return

      // Eager-load first 15 frames
      frameUrls.slice(0, 15).forEach((url) => {
        const img = new window.Image()
        img.src = url
      })
      // Progressive load remaining frames in chunks
      let loaded = 15
      const loadNext = () => {
        if (loaded >= FRAME_COUNT) return
        frameUrls.slice(loaded, loaded + 10).forEach((url) => {
          const img = new window.Image()
          img.src = url
        })
        loaded += 10
        setTimeout(loadNext, 400)
      }
      setTimeout(loadNext, 800)

      const mm = gsap.matchMedia()

      // ── DESKTOP: pinned scroll sequence ──────────────────────────────
      mm.add('(min-width: 769px)', () => {
        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=3000',
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress

            // Frame swap
            if (frameRef.current) {
              const idx = Math.min(Math.round(p * 119), 119)
              frameRef.current.src = frameUrls[idx]
            }

            // Scroll prompt fades out immediately (gone by 2.5%)
            if (scrollPromptRef.current) {
              scrollPromptRef.current.style.opacity = String(
                Math.max(0, 1 - p * 40),
              )
            }

            // Phase 3: reveal environment (last 12%)
            if (p >= 0.88) {
              const phase = (p - 0.88) / 0.12
              // ease-in-out quadratic
              const eased =
                phase < 0.5
                  ? 2 * phase * phase
                  : -1 + (4 - 2 * phase) * phase

              if (videoRef.current)
                videoRef.current.style.opacity = String(eased * 0.75)
              if (bottleWrapRef.current)
                bottleWrapRef.current.style.opacity = String(eased)
              if (glowRef.current)
                glowRef.current.style.opacity = String(eased * 0.3)
              if (textRef.current)
                textRef.current.style.opacity = String(eased)
            } else {
              // Reset when scrolled back into earlier phases
              if (videoRef.current) videoRef.current.style.opacity = '0'
              if (bottleWrapRef.current)
                bottleWrapRef.current.style.opacity = '0'
              if (glowRef.current) glowRef.current.style.opacity = '0'
              if (textRef.current) textRef.current.style.opacity = '0'
            }
          },
        })

        // After pin releases: bottle + text scroll out
        // Use xPercent/yPercent to keep centering intact while animating y
        gsap.to([bottleWrapRef.current, textRef.current], {
          y: -60,
          opacity: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'bottom top+=100',
            end: 'bottom top-=200',
            scrub: 1,
          },
        })

        // Recalculate scroll positions after pin spacer is inserted
        ScrollTrigger.refresh()

        return () => {
          st.kill()
        }
      })

      // ── MOBILE: static hero ───────────────────────────────────────────
      mm.add('(max-width: 768px)', () => {
        // Show mid-reveal frame
        if (frameRef.current) {
          frameRef.current.src = frameUrls[59] // frame_060
          frameRef.current.style.opacity = '1'
        }
        // Reveal bottle, glow and text immediately
        if (bottleWrapRef.current) bottleWrapRef.current.style.opacity = '1'
        if (glowRef.current) glowRef.current.style.opacity = '0.3'
        if (textRef.current) textRef.current.style.opacity = '1'
        if (scrollPromptRef.current) scrollPromptRef.current.style.opacity = '0'
        return () => {}
      })

      return () => {
        mm.revert()
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
      {/* L0 — Background video (fades in during Phase 3, behind frames) */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0,
          zIndex: 0,
        }}
      >
        <source src="/videos/hero_atmosphere.mp4" type="video/mp4" />
      </video>

      {/* L1 — Frame sequencer (full-screen, no blend mode) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={frameRef}
        src="/images/frames/frame_001.webp"
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
        }}
      />

      {/* L2 — Amber glow behind bottle */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '55%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(212,120,26,0.45) 0%, transparent 70%)',
          opacity: 0,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* L3 — Real labeled bottle */}
      <div
        ref={bottleWrapRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          zIndex: 3,
          pointerEvents: 'none',
        }}
      >
        <Image
          src="/images/bottle_caramel.png"
          alt="Southern Edge Salted Caramel Whiskey"
          width={340}
          height={580}
          priority
          style={{
            objectFit: 'contain',
            maxHeight: '70vh',
            width: 'auto',
          }}
        />
      </div>

      {/* L4 — Text overlay */}
      <div
        ref={textRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 4,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Top-left brand mark */}
        <span
          style={{
            position: 'absolute',
            top: 24,
            left: 40,
            fontFamily: 'var(--font-dm-sans)',
            fontSize: 11,
            letterSpacing: '0.25em',
            color: 'var(--silver)',
            textTransform: 'uppercase',
          }}
        >
          Southern Edge Fine Spirits
        </span>

        {/* Center headline */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            width: '100%',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(80px, 12vw, 180px)',
              color: 'var(--cream)',
              lineHeight: 0.9,
              letterSpacing: '0.02em',
            }}
          >
            WORK HARD
          </div>
          <div
            style={{
              fontFamily: 'var(--font-vibes)',
              fontSize: 'clamp(40px, 6vw, 90px)',
              color: 'var(--gold)',
              marginTop: -8,
            }}
          >
            Drink Smooth.
          </div>
        </div>
      </div>

      {/* L5 — Scroll prompt (fades out on scroll start) */}
      <div
        ref={scrollPromptRef}
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 5,
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
