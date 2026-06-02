'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { FRAME_COUNT, frameCache, preloadAllAssets } from '@/lib/preload'

interface HeroProps {
  isVisible: boolean
  onRevealed?: () => void
}

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const revealedRef = useRef(false)
  const onRevealedRef = useRef(onRevealed)
  onRevealedRef.current = onRevealed
  const videoRef = useRef<HTMLVideoElement | null>(null)
  // Lazy video load: the bg video (~2MB) only appears late in the reveal, so it is
  // not loaded at page load (preload="none", no autoPlay). Fetched once the scrub
  // approaches the reveal so it's buffered by the time it fades in.
  const videoStartedRef = useRef(false)
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

      // Frames come from the shared preload module (frameCache). The loader normally
      // warms all 192 before Hero mounts. If it was bypassed, kick the module once as
      // a safety net so scrubbing stays warm in every direction.
      if (frameCache.length !== FRAME_COUNT) {
        preloadAllAssets(() => {})
      }

      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Only the first DECODE_AHEAD frames are decode-warm from the loader; the rest
      // warm only the HTTP cache and decode on demand mid-scroll (flicker). Decode a
      // bounded sliding window ahead of the scrub head so the next frames are bitmap-
      // ready without ever decoding all 192 at once (that ≈530MB RGBA OOMs mobile).
      const DECODE_WINDOW = 6
      let decodeHead = -1
      const warmDecodeWindow = (idx: number) => {
        if (idx === decodeHead) return
        decodeHead = idx
        for (let i = idx; i < idx + DECODE_WINDOW && i < FRAME_COUNT; i++) {
          frameCache[i]?.decode().catch(() => {})
        }
      }

      // Render frames into a canvas via drawImage (synchronous from decoded images).
      // Avoids <img>.src coalescing + async decode that stalls fast scroll.
      const ctx = canvasRef.current?.getContext('2d', { alpha: false }) ?? null
      const drawFrame = (idx: number) => {
        const img = frameCache[idx]
        if (ctx && img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, 0, 0, 960, 720)
        }
      }
      // Paint frame 0 immediately (or as soon as it loads) so the canvas is never blank pre-scroll.
      const first = frameCache[0]
      if (first) {
        if (first.complete && first.naturalWidth) drawFrame(0)
        else first.addEventListener('load', () => drawFrame(0), { once: true })
      }

      // Kick the (preload="none") bg video once, as the scrub nears the reveal.
      const startVideo = () => {
        if (videoStartedRef.current) return
        const v = videoRef.current
        if (!v) return
        videoStartedRef.current = true
        try {
          v.load()
          const pr = v.play()
          if (pr && typeof pr.catch === 'function') pr.catch(() => {})
        } catch {
          /* ignore */
        }
      }

      // Bottle reveal sizing — start the fading-in PNG at the apparent size of the
      // bottle in the final reveal frame (cover-fit 4:3 canvas), then settle it down
      // to its resting size, so the frame→bottle handoff has no size "pop".
      // 0.78 = bottle height as a fraction of the frame; 0.475 = its vertical center.
      const reveal = { scale: 1.45, y: -22, ready: false }
      const computeReveal = () => {
        if (typeof window === 'undefined') return
        const img = bottleInnerRef.current?.querySelector('img')
        const bh = img ? img.getBoundingClientRect().height : window.innerHeight * 0.6
        if (!bh) return
        const coverScale = Math.max(window.innerWidth / 960, window.innerHeight / 720)
        const frameH = 720 * coverScale
        reveal.scale = Math.min(2.6, Math.max(1, (0.78 * frameH) / bh))
        reveal.y = -(0.5 - 0.475) * frameH
      }
      computeReveal()
      if (typeof window !== 'undefined') window.addEventListener('resize', computeReveal)

      const mm = gsap.matchMedia()

      // ── DESKTOP: pinned scroll + dwell ──────────────────────────────────
      mm.add('(min-width: 769px)', () => {
        // Reveal is fully scrub-bound both directions — scrolling back up replays/reverses it.

        // Infinite bob on the scroll arrow (skip for reduced-motion users)
        if (!reduced) {
          gsap.to(scrollPromptRef.current, {
            y: 10,
            repeat: -1,
            yoyo: true,
            duration: 0.9,
            ease: 'sine.inOut',
          })
        }

        let st: ScrollTrigger
        st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${TOTAL_SCROLL}`,
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress

            // Frame draw — clamp to frame range only
            if (canvasRef.current) {
              const frameP = Math.min(p / FRAME_END_P, 1)
              const idx = Math.min(Math.round(frameP * 191), 191)
              drawFrame(idx)
              warmDecodeWindow(idx)
            }

            // Lazy-load the bg video as the scrub approaches the reveal
            if (p > 0.45) startVideo()

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
              if (!reveal.ready) { computeReveal(); reveal.ready = true }
              const phase = Math.min((p - REVEAL_START_P) / (REVEAL_END_P - REVEAL_START_P), 1)
              const eased = phase < 0.5 ? 2 * phase * phase : -1 + (4 - 2 * phase) * phase
              // Bottle crossfades in over the first 60% at the frame's size, then settles
              // to its resting size over the last 40% — seamless frame→bottle handoff.
              const fade = Math.min(phase / 0.6, 1)
              const sr = Math.max(0, (phase - 0.6) / 0.4)
              const settle = sr < 0.5 ? 2 * sr * sr : -1 + (4 - 2 * sr) * sr
              if (canvasRef.current) canvasRef.current.style.opacity = String(1 - fade)
              if (videoRef.current) videoRef.current.style.opacity = String(eased * 0.75)
              if (overlayRef.current) overlayRef.current.style.opacity = String(eased)
              if (bottleOuterRef.current) {
                bottleOuterRef.current.style.opacity = String(fade)
                const s = reveal.scale + (1 - reveal.scale) * settle
                bottleOuterRef.current.style.transform = `translateY(${reveal.y * (1 - settle)}px) scale(${s})`
              }
              if (glowRef.current) glowRef.current.style.opacity = String(eased * 0.3)
              if (textRef.current) textRef.current.style.opacity = String(eased)
            } else {
              // Still in frame phase — keep environment hidden, bottle primed at frame size
              if (canvasRef.current) canvasRef.current.style.opacity = '1'
              if (videoRef.current) videoRef.current.style.opacity = '0'
              if (overlayRef.current) overlayRef.current.style.opacity = '0'
              if (bottleOuterRef.current) {
                bottleOuterRef.current.style.opacity = '0'
                bottleOuterRef.current.style.transform = `translateY(${reveal.y}px) scale(${reveal.scale})`
              }
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

        // Mouse parallax — only affects the inner bottle wrapper and glow.
        // Skipped entirely for reduced-motion users (autonomous-feel motion).
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
        if (!reduced) {
          window.addEventListener('mousemove', onMouseMove)
        }

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

        // Nudge animation (skip for reduced-motion users)
        if (!reduced) {
          gsap.to(scrollPromptRef.current, {
            y: 10,
            repeat: -1,
            yoyo: true,
            duration: 0.9,
            ease: 'sine.inOut',
          })
        }

        let stMobile: ScrollTrigger
        stMobile = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${TOTAL_SCROLL_MOBILE}`,
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress

            if (canvasRef.current) {
              const idx = Math.min(Math.round(p * 191), 191)
              drawFrame(idx)
              warmDecodeWindow(idx)
            }

            // Lazy-load the bg video as the scrub approaches the reveal
            if (p > 0.45) startVideo()

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
              if (!reveal.ready) { computeReveal(); reveal.ready = true }
              const phase = Math.min((p - REVEAL_START_P) / (REVEAL_END_P - REVEAL_START_P), 1)
              const eased = phase < 0.5 ? 2 * phase * phase : -1 + (4 - 2 * phase) * phase
              const fade = Math.min(phase / 0.6, 1)
              const sr = Math.max(0, (phase - 0.6) / 0.4)
              const settle = sr < 0.5 ? 2 * sr * sr : -1 + (4 - 2 * sr) * sr
              if (canvasRef.current) canvasRef.current.style.opacity = String(1 - fade)
              if (videoRef.current) videoRef.current.style.opacity = String(eased * 0.75)
              if (overlayRef.current) overlayRef.current.style.opacity = String(eased)
              if (bottleOuterRef.current) {
                bottleOuterRef.current.style.opacity = String(fade)
                const s = reveal.scale + (1 - reveal.scale) * settle
                bottleOuterRef.current.style.transform = `translateY(${reveal.y * (1 - settle)}px) scale(${s})`
              }
              if (glowRef.current) glowRef.current.style.opacity = String(eased * 0.3)
              if (textRef.current) textRef.current.style.opacity = String(eased)
            } else {
              if (canvasRef.current) canvasRef.current.style.opacity = '1'
              if (videoRef.current) videoRef.current.style.opacity = '0'
              if (overlayRef.current) overlayRef.current.style.opacity = '0'
              if (bottleOuterRef.current) {
                bottleOuterRef.current.style.opacity = '0'
                bottleOuterRef.current.style.transform = `translateY(${reveal.y}px) scale(${reveal.scale})`
              }
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
        if (typeof window !== 'undefined') window.removeEventListener('resize', computeReveal)
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
        <source src="/videos/bourbon_bar.mp4" type="video/mp4" />
      </video>

      {/* L1 — Frame sequencer.
          CSS poster (frame_001) backs the canvas so it's never blank/opaque-black
          before drawFrame(0) decodes — restores the old <img> pre-paint behavior. */}
      <canvas
        ref={canvasRef}
        width={960}
        height={720}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          backgroundImage: 'url(/images/frames/frame_001.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
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
