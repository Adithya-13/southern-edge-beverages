'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

interface HeroProps {
  isVisible: boolean
  onRevealed?: () => void
}

const FRAME_COUNT = 120
const frameUrls = Array.from(
  { length: FRAME_COUNT },
  (_, i) => `/images/frames/frame_${String(i + 1).padStart(3, '0')}.webp`,
)

// Pin distance: 2000px drives the full frame sequence.
// No dwell phase — pin releases immediately when reveal completes.
// On the way back, onLeave kills the pin so back-scroll is one normal 100vh section.
const TOTAL_SCROLL = 2000

// Frames run the entire pin distance
const FRAME_END_P = 1.0

// Reveal window: last 30% of pin (progress 0.70→1.0 = 600px of transition)
const REVEAL_START_P = 0.70
const REVEAL_END_P = 1.0

interface StoryBeat {
  peak: number
  halfWidth: number
  lines: [string, string]
  align: 'left' | 'right' | 'center'
  xStyle: React.CSSProperties
  fontSize?: string
  fontFamily?: string
}
const STORY_BEATS: StoryBeat[] = [
  // Beat 0: welcome — visible at p=0, fades out as scrolling starts
  {
    peak: 0.00, halfWidth: 0.12,
    lines: ['SOUTHERN EDGE', 'FINE SPIRITS'],
    align: 'center',
    xStyle: { left: '50%', transform: 'translateX(-50%)', textAlign: 'center' },
    fontSize: 'clamp(28px,3.5vw,52px)',
    fontFamily: 'var(--font-bebas)',
  },
  { peak: 0.30, halfWidth: 0.10, lines: ['CRAFTED IN', 'SOUTH CAROLINA'], align: 'left',  xStyle: { left: '8vw', right: 'auto', textAlign: 'left' } },
  { peak: 0.55, halfWidth: 0.10, lines: ['6× DISTILLED', '60 PROOF'],     align: 'right', xStyle: { right: '8vw', left: 'auto', textAlign: 'right' } },
]

export default function Hero({ isVisible, onRevealed }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const frameRef = useRef<HTMLImageElement | null>(null)
  const revealedRef = useRef(false)
  const onRevealedRef = useRef(onRevealed)
  onRevealedRef.current = onRevealed
  const videoRef = useRef<HTMLVideoElement | null>(null)
  // Outer wrapper: centering (transform: translate(-50%,-50%))
  const bottleOuterRef = useRef<HTMLDivElement | null>(null)
  // Inner wrapper: mouse parallax target (GSAP x/y — no centering conflict)
  const bottleInnerRef = useRef<HTMLDivElement | null>(null)
  const glowRef = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLDivElement | null>(null)
  const scrollPromptRef = useRef<HTMLDivElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const beat0Ref = useRef<HTMLDivElement | null>(null)
  const beat1Ref = useRef<HTMLDivElement | null>(null)
  const beat2Ref = useRef<HTMLDivElement | null>(null)

  useGSAP(
    () => {
      if (!isVisible) return

      // Eager-load first 15 frames
      frameUrls.slice(0, 15).forEach((url) => {
        const img = new window.Image()
        img.src = url
      })
      // Progressive load remaining in chunks
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

      // ── DESKTOP: pinned scroll + dwell ──────────────────────────────────
      mm.add('(min-width: 769px)', () => {
        // Reveal is fully scrub-bound both directions — scrolling back up replays/reverses it.

        // Infinite bob on the scroll arrow
        gsap.to(scrollPromptRef.current, {
          y: 10,
          repeat: -1,
          yoyo: true,
          duration: 0.9,
          ease: 'sine.inOut',
        })

        let st: ScrollTrigger
        st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${TOTAL_SCROLL}`,
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress

            // Frame swap — clamp to frame range only
            if (frameRef.current) {
              const frameP = Math.min(p / FRAME_END_P, 1)
              const idx = Math.min(Math.round(frameP * 119), 119)
              frameRef.current.src = frameUrls[idx]
            }

            // Scroll prompt fades out immediately
            if (scrollPromptRef.current) {
              scrollPromptRef.current.style.opacity = String(
                Math.max(0, 1 - p * 60),
              )
            }

            // Story beats — fade in/out during frame phase only
            const beatRefs = [beat0Ref, beat1Ref, beat2Ref]
            beatRefs.forEach((ref, i) => {
              if (!ref.current) return
              if (p >= REVEAL_START_P) {
                ref.current.style.opacity = '0'
              } else {
                const dist = Math.abs(p - STORY_BEATS[i].peak)
                ref.current.style.opacity = String(Math.max(0, 1 - dist / STORY_BEATS[i].halfWidth))
              }
            })

            // Phase 3: frame fades OUT, environment fades IN
            if (p >= REVEAL_START_P) {
              const phase = Math.min((p - REVEAL_START_P) / (REVEAL_END_P - REVEAL_START_P), 1)
              const eased = phase < 0.5 ? 2 * phase * phase : -1 + (4 - 2 * phase) * phase
              if (frameRef.current) frameRef.current.style.opacity = String(1 - eased)
              if (videoRef.current) videoRef.current.style.opacity = String(eased * 0.75)
              if (overlayRef.current) overlayRef.current.style.opacity = String(eased)
              if (bottleOuterRef.current) bottleOuterRef.current.style.opacity = String(eased)
              if (glowRef.current) glowRef.current.style.opacity = String(eased * 0.3)
              if (textRef.current) textRef.current.style.opacity = String(eased)
            } else {
              // Still in frame phase — keep environment hidden
              if (frameRef.current) frameRef.current.style.opacity = '1'
              if (videoRef.current) videoRef.current.style.opacity = '0'
              if (overlayRef.current) overlayRef.current.style.opacity = '0'
              if (bottleOuterRef.current) bottleOuterRef.current.style.opacity = '0'
              if (glowRef.current) glowRef.current.style.opacity = '0'
              if (textRef.current) textRef.current.style.opacity = '0'
            }

            // Reveal fully complete — show navbar (fires once, never un-fires)
            if (p >= FRAME_END_P - 0.01 && !revealedRef.current) {
              revealedRef.current = true
              onRevealedRef.current?.()
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('hero-revealed'))
              }
            }
          },
          // Pin stays alive — reveal is scrub-bound both ways so the user can scroll
          // back up and replay it. Just ensure the navbar fires once on first forward exit.
          onLeave: () => {
            if (!revealedRef.current) {
              revealedRef.current = true
              onRevealedRef.current?.()
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('hero-revealed'))
              }
            }
          },
        })

        // Mouse parallax — only affects the inner bottle wrapper and glow
        function onMouseMove(e: MouseEvent) {
          const x = (e.clientX / window.innerWidth - 0.5) * 2
          const y = (e.clientY / window.innerHeight - 0.5) * 2
          if (bottleInnerRef.current) {
            gsap.to(bottleInnerRef.current, { x: x * 18, y: y * 18, duration: 0.9, ease: 'power2.out' })
          }
          if (glowRef.current) {
            gsap.to(glowRef.current, { x: x * 10, y: y * 10, duration: 0.9, ease: 'power2.out' })
          }
        }
        window.addEventListener('mousemove', onMouseMove)

        ScrollTrigger.refresh()

        return () => {
          st.kill()
          window.removeEventListener('mousemove', onMouseMove)
        }
      })

      // ── MOBILE: scroll-driven reveal (mirrors desktop, shorter pin distance) ──
      mm.add('(max-width: 768px)', () => {
        const TOTAL_SCROLL_MOBILE = 1200

        // Reveal is fully scrub-bound both directions — scrolling back up replays/reverses it.

        // Nudge animation
        gsap.to(scrollPromptRef.current, {
          y: 10,
          repeat: -1,
          yoyo: true,
          duration: 0.9,
          ease: 'sine.inOut',
        })

        let stMobile: ScrollTrigger
        stMobile = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${TOTAL_SCROLL_MOBILE}`,
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress

            if (frameRef.current) {
              const idx = Math.min(Math.round(p * 119), 119)
              frameRef.current.src = frameUrls[idx]
            }

            if (scrollPromptRef.current) {
              scrollPromptRef.current.style.opacity = String(Math.max(0, 1 - p * 60))
            }

            // Story beats
            const beatRefs = [beat0Ref, beat1Ref, beat2Ref]
            beatRefs.forEach((ref, i) => {
              if (!ref.current) return
              if (p >= REVEAL_START_P) {
                ref.current.style.opacity = '0'
              } else {
                const dist = Math.abs(p - STORY_BEATS[i].peak)
                ref.current.style.opacity = String(Math.max(0, 1 - dist / STORY_BEATS[i].halfWidth))
              }
            })

            if (p >= REVEAL_START_P) {
              const phase = Math.min((p - REVEAL_START_P) / (REVEAL_END_P - REVEAL_START_P), 1)
              const eased = phase < 0.5 ? 2 * phase * phase : -1 + (4 - 2 * phase) * phase
              if (frameRef.current) frameRef.current.style.opacity = String(1 - eased)
              if (videoRef.current) videoRef.current.style.opacity = String(eased * 0.75)
              if (overlayRef.current) overlayRef.current.style.opacity = String(eased)
              if (bottleOuterRef.current) bottleOuterRef.current.style.opacity = String(eased)
              if (glowRef.current) glowRef.current.style.opacity = String(eased * 0.3)
              if (textRef.current) textRef.current.style.opacity = String(eased)
            } else {
              if (frameRef.current) frameRef.current.style.opacity = '1'
              if (videoRef.current) videoRef.current.style.opacity = '0'
              if (overlayRef.current) overlayRef.current.style.opacity = '0'
              if (bottleOuterRef.current) bottleOuterRef.current.style.opacity = '0'
              if (glowRef.current) glowRef.current.style.opacity = '0'
              if (textRef.current) textRef.current.style.opacity = '0'
            }

            if (p >= FRAME_END_P - 0.01 && !revealedRef.current) {
              revealedRef.current = true
              onRevealedRef.current?.()
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('hero-revealed'))
              }
            }
          },
          // Pin stays alive — reveal is scrub-bound both ways so the user can replay it.
          onLeave: () => {
            if (!revealedRef.current) {
              revealedRef.current = true
              onRevealedRef.current?.()
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('hero-revealed'))
              }
            }
          },
        })

        return () => {
          stMobile.kill()
        }
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
      {/* L0 — Background video (fades in during Phase 3) */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          // Zoom in — crops ~11% off each edge to fully hide the AI watermark at bottom-right
          transform: 'scale(1.22)',
          transformOrigin: 'center',
          opacity: 0,
          zIndex: 0,
        }}
      >
        <source src="/videos/hero_atmosphere.mp4" type="video/mp4" />
      </video>

      {/* L1 — Frame sequencer */}
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

      {/* L2 — Dark overlay: dims video without touching bottle */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          opacity: 0,
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Story beats — appear during frame scroll phase */}
      {STORY_BEATS.map((beat, i) => {
        const beatRef = [beat0Ref, beat1Ref, beat2Ref][i]
        return (
          <div
            key={i}
            ref={beatRef}
            style={{
              position: 'absolute',
              top: '50%',
              transform: beat.align === 'center'
                ? 'translate(-50%, -50%)'
                : 'translateY(-50%)',
              ...beat.xStyle,
              // Initial opacity: pre-calculated at p=0 so beat 0 (welcome) is visible on load
              opacity: Math.max(0, 1 - Math.abs(0 - beat.peak) / beat.halfWidth),
              zIndex: 4,
              pointerEvents: 'none',
            }}
          >
            <div style={{
              width: beat.fontFamily ? 48 : 32,
              height: 1,
              background: 'var(--amber)',
              marginBottom: 12,
              marginLeft: beat.align === 'right' ? 'auto' : beat.align === 'center' ? 'auto' : 0,
              marginRight: beat.align === 'right' ? 0 : 'auto',
            }} />
            {beat.lines.map((line, li) => (
              <div key={li} style={{
                fontFamily: beat.fontFamily ?? 'var(--font-dm-sans)',
                fontWeight: beat.fontFamily ? 400 : 500,
                fontSize: beat.fontSize ?? 'clamp(10px,1.1vw,13px)',
                letterSpacing: beat.fontFamily ? '0.08em' : '0.25em',
                color: 'rgba(240,228,204,0.80)',
                textTransform: 'uppercase',
                lineHeight: 1.1,
              }}>
                {line}
              </div>
            ))}
          </div>
        )
      })}

      {/* L3 — Amber glow (also mouse-parallaxed) */}
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
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      {/* L5 — Bottle: flexbox centering (avoids transform conflict with GSAP scroll-out) */}
      <div
        ref={bottleOuterRef}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          zIndex: 5,
          pointerEvents: 'none',
        }}
      >
        <div ref={bottleInnerRef}>
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
      </div>

      {/* L6 — Text overlay */}
      <div
        ref={textRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 6,
          opacity: 0,
          pointerEvents: 'none',
        }}
      >
        {/* Brand label removed — navbar wordmark covers this role post-reveal (was doubling) */}

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

      {/* L7 — Scroll prompt */}
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
