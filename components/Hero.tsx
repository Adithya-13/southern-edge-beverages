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
  lines: [string, string]
  align: 'left' | 'right' | 'center'
  xStyle: React.CSSProperties
}
const STORY_BEATS: StoryBeat[] = [
  { peak: 0.20, lines: ['CRAFTED IN', 'SOUTH CAROLINA'], align: 'left',   xStyle: { left: '8vw', right: 'auto', textAlign: 'left' } },
  { peak: 0.40, lines: ['6× DISTILLED', '60 PROOF'],     align: 'right',  xStyle: { right: '8vw', left: 'auto', textAlign: 'right' } },
  { peak: 0.57, lines: ['NATURAL INGREDIENTS', 'GLUTEN FREE'], align: 'center', xStyle: { left: '50%', transform: 'translateX(-50%)', textAlign: 'center' } },
]
const BEAT_HALF_WIDTH = 0.10

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
        // Once the reveal is done (dwell phase reached), lock final state permanently.
        // This prevents the scrub from rewinding the reveal when scrolling back up.
        let revealDone = false

        const setFinalState = () => {
          if (frameRef.current) frameRef.current.style.opacity = '0'
          if (videoRef.current) videoRef.current.style.opacity = '0.75'
          if (overlayRef.current) overlayRef.current.style.opacity = '1'
          if (bottleOuterRef.current) bottleOuterRef.current.style.opacity = '1'
          if (glowRef.current) glowRef.current.style.opacity = '0.3'
          if (textRef.current) textRef.current.style.opacity = '1'
          if (scrollPromptRef.current) scrollPromptRef.current.style.opacity = '0'
          if (beat0Ref.current) beat0Ref.current.style.opacity = '0'
          if (beat1Ref.current) beat1Ref.current.style.opacity = '0'
          if (beat2Ref.current) beat2Ref.current.style.opacity = '0'
        }

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
            // Once reveal is done, lock final state — scrubbing back never rewinds it
            if (revealDone) {
              setFinalState()
              return
            }

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
                ref.current.style.opacity = String(Math.max(0, 1 - dist / BEAT_HALF_WIDTH))
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

            // Reveal fully complete — lock state and show navbar
            if (p >= FRAME_END_P - 0.01) {
              revealDone = true
              setFinalState()
              // Fire navbar callback only when reveal is 100% done
              if (!revealedRef.current) {
                revealedRef.current = true
                onRevealedRef.current?.()
              }
            }
          },
          // Pin releases here — kill it so back-scroll is a normal 100vh pass
          onLeave: () => {
            revealDone = true
            setFinalState()
            if (!revealedRef.current) {
              revealedRef.current = true
              onRevealedRef.current?.()
            }
            const heroEl = sectionRef.current
            st.kill()
            ScrollTrigger.refresh()
            // Killing the pin removes the 2000px spacer, causing a scroll jump.
            // Snap to right below the hero so the next section lands cleanly.
            if (heroEl) {
              const target = heroEl.offsetTop + heroEl.offsetHeight
              const smoother = ScrollSmoother.get()
              if (smoother) {
                smoother.scrollTo(target, false)
              } else {
                window.scrollTo(0, target)
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

        // After pin releases: bottle inner wrapper drifts up, text fades
        // Target bottleInnerRef (not outer) so flexbox centering is never touched
        gsap.to([bottleInnerRef.current, textRef.current], {
          y: -60,
          opacity: 0,
          scrollTrigger: {
            trigger: sectionRef.current,
            // Start well below hero so this doesn't activate right after pin kill + scroll snap
            start: 'bottom top-=300',
            end: 'bottom top-=600',
            scrub: 1,
          },
        })

        ScrollTrigger.refresh()

        return () => {
          st.kill()
          window.removeEventListener('mousemove', onMouseMove)
        }
      })

      // ── MOBILE: static hero ─────────────────────────────────────────────
      mm.add('(max-width: 768px)', () => {
        if (frameRef.current) {
          frameRef.current.src = frameUrls[59] // frame_060
          frameRef.current.style.opacity = '1'
        }
        if (bottleOuterRef.current) bottleOuterRef.current.style.opacity = '1'
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
              opacity: 0,
              zIndex: 4,
              pointerEvents: 'none',
            }}
          >
            <div style={{
              width: 32,
              height: 1,
              background: 'var(--amber)',
              marginBottom: 12,
              marginLeft: beat.align === 'right' ? 'auto' : beat.align === 'center' ? 'auto' : 0,
              marginRight: beat.align === 'right' ? 0 : 'auto',
            }} />
            {beat.lines.map((line, li) => (
              <div key={li} style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 500,
                fontSize: 'clamp(10px,1.1vw,13px)',
                letterSpacing: '0.25em',
                color: 'rgba(240,228,204,0.65)',
                textTransform: 'uppercase',
                lineHeight: 1.6,
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
