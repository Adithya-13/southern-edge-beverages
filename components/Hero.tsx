'use client'

import { useRef, useState, useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { FRAME_COUNT, frameCache, preloadAllAssets } from '@/lib/preload'
import { PRODUCTS } from '@/lib/constants'

// The reveal frames bake in the Salted Caramel bottle (PRODUCTS index 2) — so it
// is the default and the revert target when the reveal plays in reverse.
const DEFAULT_PRODUCT = 2

interface HeroProps {
  isVisible: boolean
  onRevealed?: () => void
}

// Pin distance: 2000px drives the full frame sequence.
// No dwell phase — pin releases immediately when reveal completes.
// On the way back, onLeave kills the pin so back-scroll is one normal 100vh section.
// Pin distance: the reveal occupies the first REVEAL_DONE_P of the pin; the
// remaining tail is a DWELL where the bottle rests and auto-cycles products.
const TOTAL_SCROLL = 3300

// Atmosphere phase: the southern world plays first; frames begin once it fades.
// Pin lengths chosen so the frame phase and dwell keep their original px feel.
const ATMO_P = 0.21

// Reveal completes at this fraction of the pin; [REVEAL_DONE_P, 1] is the dwell.
const REVEAL_DONE_P = 0.82

// Frames + reveal run against rp remapped to [ATMO_P, REVEAL_DONE_P], so the
// reveal feel is unchanged — atmosphere is prepended, the dwell appended.
const FRAME_END_P = 1.0

// Reveal window within rp: last 30% (rp 0.70→1.0).
const REVEAL_START_P = 0.70
const REVEAL_END_P = 1.0

interface StoryBeat {
  phase: 'atmo' | 'frames'
  peak: number
  halfWidth: number
  lines: [string, string]
  align: 'left' | 'right' | 'center'
  xStyle: React.CSSProperties
  fontSize?: string
  fontFamily?: string
}
// Atmo beats run on ap (atmosphere progress); frames beats run on rp as before.
const STORY_BEATS: StoryBeat[] = [
  // Beat 0: welcome — visible at p=0, lingers through the atmosphere phase
  {
    phase: 'atmo',
    peak: 0.00, halfWidth: 0.40,
    lines: ['SOUTHERN EDGE', 'FINE SPIRITS'],
    align: 'center',
    xStyle: { left: '50%', transform: 'translateX(-50%)', textAlign: 'center' },
    fontSize: 'clamp(28px,3.5vw,52px)',
    fontFamily: 'var(--font-bebas)',
  },
  { phase: 'frames', peak: 0.30, halfWidth: 0.10, lines: ['CRAFTED IN', 'SOUTH CAROLINA'], align: 'left',  xStyle: { left: '8vw', right: 'auto', textAlign: 'left' } },
  { phase: 'frames', peak: 0.55, halfWidth: 0.10, lines: ['6× DISTILLED', '60 PROOF'],     align: 'right', xStyle: { right: '8vw', left: 'auto', textAlign: 'right' } },
  { phase: 'atmo',   peak: 0.60, halfWidth: 0.25, lines: ['SOUTHERN HOSPITALITY,', 'BOTTLED'], align: 'left', xStyle: { left: '8vw', right: 'auto', textAlign: 'left' } },
]

export default function Hero({ isVisible, onRevealed }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const revealedRef = useRef(false)
  const onRevealedRef = useRef(onRevealed)
  onRevealedRef.current = onRevealed
  const videoRef = useRef<HTMLVideoElement | null>(null)
  // Lazy video load: the bg video (~2MB) only appears late in the reveal, so it is
  // not loaded at page load (preload="none", no autoPlay). Buffering is kicked the
  // moment the frame phase begins so it's ready well before it fades in, and the
  // fade itself is gated on canplay so it never pops in mid-download.
  const videoStartedRef = useRef(false)
  const videoReadyRef = useRef(false)
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
  const beat3Ref = useRef<HTMLDivElement | null>(null)
  // Atmosphere layer: visible at p=0, fades out as the frame phase begins.
  const atmoRef = useRef<HTMLDivElement | null>(null)
  // Faux-3D bottle: cursor-tilt wrapper + a ref to computeReveal so the bottle
  // <img> onLoad can re-measure (raw <img> can report 0 height before load).
  const tiltRef = useRef<HTMLDivElement | null>(null)
  const computeRevealRef = useRef<() => void>(() => {})
  // Edge-tracker so onUpdate only flips the React atRest state on transitions.
  const atRestEdgeRef = useRef(false)

  // Product auto-cycle (only while the reveal is fully complete / dwelling).
  const [productIndex, setProductIndex] = useState(DEFAULT_PRODUCT)
  const [atRest, setAtRest] = useState(false)
  const product = PRODUCTS[productIndex]

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

      // Kick the (preload="none") bg video once. Fired as soon as the frame phase
      // begins so ~2MB has the whole frame-scroll to buffer. Marks ready on canplay
      // so the reveal fade is gated on real readiness, never a black pop-in.
      const startVideo = () => {
        if (videoStartedRef.current) return
        const v = videoRef.current
        if (!v) return
        videoStartedRef.current = true
        const markReady = () => { videoReadyRef.current = true }
        if (v.readyState >= 3) markReady()
        else {
          v.addEventListener('canplay', markReady, { once: true })
          v.addEventListener('canplaythrough', markReady, { once: true })
        }
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
        // offsetHeight = untransformed layout height (getBoundingClientRect would be
        // polluted by the scale() already applied to the outer wrapper pre-reveal).
        const bh = img ? img.offsetHeight : window.innerHeight * 0.6
        if (!bh) return
        const coverScale = Math.max(window.innerWidth / 960, window.innerHeight / 720)
        const frameH = 720 * coverScale
        reveal.scale = Math.min(2.6, Math.max(1, (0.78 * frameH) / bh))
        reveal.y = -(0.5 - 0.475) * frameH
      }
      computeReveal()
      computeRevealRef.current = computeReveal
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
            // Atmosphere occupies [0, ATMO_P]; frames + reveal run on rp remapped
            // to [ATMO_P, REVEAL_DONE_P]; [REVEAL_DONE_P, 1] of the pin is the dwell.
            const ap = Math.min(p / ATMO_P, 1)
            const rp = Math.min(Math.max((p - ATMO_P) / (REVEAL_DONE_P - ATMO_P), 0), 1)

            // Atmosphere fades out as the frame phase takes over
            if (atmoRef.current) {
              const aEased = ap < 0.5 ? 2 * ap * ap : -1 + (4 - 2 * ap) * ap
              atmoRef.current.style.opacity = String(1 - aEased)
            }

            // Frame draw — clamp to frame range only
            if (canvasRef.current) {
              const idx = Math.min(Math.round(rp * 191), 191)
              drawFrame(idx)
              warmDecodeWindow(idx)
            }

            // Buffer the bg video as soon as the frame phase begins so it's ready
            // long before the reveal fades it in.
            if (rp > 0.02) startVideo()

            // Scroll prompt fades out immediately
            if (scrollPromptRef.current) {
              scrollPromptRef.current.style.opacity = String(
                Math.max(0, 1 - p * 60),
              )
            }

            // Story beats — atmo beats track ap, frames beats track rp
            const beatRefs = [beat0Ref, beat1Ref, beat2Ref, beat3Ref]
            beatRefs.forEach((ref, i) => {
              if (!ref.current) return
              const beat = STORY_BEATS[i]
              if (beat.phase === 'frames' && rp >= REVEAL_START_P) {
                ref.current.style.opacity = '0'
                return
              }
              const ph = beat.phase === 'atmo' ? ap : rp
              const dist = Math.abs(ph - beat.peak)
              ref.current.style.opacity = String(Math.max(0, 1 - dist / beat.halfWidth))
            })

            // Phase 3: frame fades OUT, environment fades IN
            if (rp >= REVEAL_START_P) {
              if (!reveal.ready) { computeReveal(); reveal.ready = true }
              const phase = Math.min((rp - REVEAL_START_P) / (REVEAL_END_P - REVEAL_START_P), 1)
              const eased = phase < 0.5 ? 2 * phase * phase : -1 + (4 - 2 * phase) * phase
              // Bottle crossfades in over the first 60% at the frame's size, then settles
              // to its resting size over the last 40% — seamless frame→bottle handoff.
              const fade = Math.min(phase / 0.6, 1)
              const sr = Math.max(0, (phase - 0.6) / 0.4)
              const settle = sr < 0.5 ? 2 * sr * sr : -1 + (4 - 2 * sr) * sr
              if (canvasRef.current) canvasRef.current.style.opacity = String(1 - fade)
              if (videoRef.current) videoRef.current.style.opacity = String(videoReadyRef.current ? eased * 0.75 : 0)
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

            // At-rest (dwell) edge → drives the React auto-cycle. Scroll back below
            // REVEAL_DONE_P flips this false and the effect reverts to the default bottle.
            const nowAtRest = p >= REVEAL_DONE_P
            if (nowAtRest !== atRestEdgeRef.current) {
              atRestEdgeRef.current = nowAtRest
              setAtRest(nowAtRest)
            }

            // Reveal fully complete — show navbar (fires once, never un-fires)
            if (rp >= FRAME_END_P - 0.01 && !revealedRef.current) {
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
            // Scrolled past the pin — bottle is off-screen; stop cycling + reset.
            atRestEdgeRef.current = false
            setAtRest(false)
            if (!revealedRef.current) {
              revealedRef.current = true
              onRevealedRef.current?.()
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('hero-revealed'))
              }
            }
          },
          onLeaveBack: () => {
            atRestEdgeRef.current = false
            setAtRest(false)
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
          // Faux-3D: tilt the bottle toward the cursor + slide the glass glint
          // (CSS vars inherit down to the masked glint child).
          if (tiltRef.current) {
            tiltRef.current.style.setProperty('--tiltY', `${x * 9}deg`)
            tiltRef.current.style.setProperty('--tiltX', `${-y * 7}deg`)
            tiltRef.current.style.setProperty('--glx', `${46 + x * 28}%`)
            tiltRef.current.style.setProperty('--gly', `${26 + y * 18}%`)
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
        const TOTAL_SCROLL_MOBILE = 1600

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
            // Atmosphere occupies [0, ATMO_P]; frames + reveal run on rp remapped
            // to [ATMO_P, REVEAL_DONE_P]; [REVEAL_DONE_P, 1] of the pin is the dwell.
            const ap = Math.min(p / ATMO_P, 1)
            const rp = Math.min(Math.max((p - ATMO_P) / (REVEAL_DONE_P - ATMO_P), 0), 1)

            // Atmosphere fades out as the frame phase takes over
            if (atmoRef.current) {
              const aEased = ap < 0.5 ? 2 * ap * ap : -1 + (4 - 2 * ap) * ap
              atmoRef.current.style.opacity = String(1 - aEased)
            }

            if (canvasRef.current) {
              const idx = Math.min(Math.round(rp * 191), 191)
              drawFrame(idx)
              warmDecodeWindow(idx)
            }

            // Buffer the bg video as soon as the frame phase begins so it's ready
            // long before the reveal fades it in.
            if (rp > 0.02) startVideo()

            if (scrollPromptRef.current) {
              scrollPromptRef.current.style.opacity = String(Math.max(0, 1 - p * 60))
            }

            // Story beats — atmo beats track ap, frames beats track rp
            const beatRefs = [beat0Ref, beat1Ref, beat2Ref, beat3Ref]
            beatRefs.forEach((ref, i) => {
              if (!ref.current) return
              const beat = STORY_BEATS[i]
              if (beat.phase === 'frames' && rp >= REVEAL_START_P) {
                ref.current.style.opacity = '0'
                return
              }
              const ph = beat.phase === 'atmo' ? ap : rp
              const dist = Math.abs(ph - beat.peak)
              ref.current.style.opacity = String(Math.max(0, 1 - dist / beat.halfWidth))
            })

            if (rp >= REVEAL_START_P) {
              if (!reveal.ready) { computeReveal(); reveal.ready = true }
              const phase = Math.min((rp - REVEAL_START_P) / (REVEAL_END_P - REVEAL_START_P), 1)
              const eased = phase < 0.5 ? 2 * phase * phase : -1 + (4 - 2 * phase) * phase
              const fade = Math.min(phase / 0.6, 1)
              const sr = Math.max(0, (phase - 0.6) / 0.4)
              const settle = sr < 0.5 ? 2 * sr * sr : -1 + (4 - 2 * sr) * sr
              if (canvasRef.current) canvasRef.current.style.opacity = String(1 - fade)
              if (videoRef.current) videoRef.current.style.opacity = String(videoReadyRef.current ? eased * 0.75 : 0)
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

            // At-rest (dwell) edge → drives the React auto-cycle (mobile).
            const nowAtRest = p >= REVEAL_DONE_P
            if (nowAtRest !== atRestEdgeRef.current) {
              atRestEdgeRef.current = nowAtRest
              setAtRest(nowAtRest)
            }

            if (rp >= FRAME_END_P - 0.01 && !revealedRef.current) {
              revealedRef.current = true
              onRevealedRef.current?.()
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('hero-revealed'))
              }
            }
          },
          // Pin stays alive — reveal is scrub-bound both ways so the user can replay it.
          onLeave: () => {
            // Scrolled past the pin — bottle is off-screen; stop cycling + reset.
            atRestEdgeRef.current = false
            setAtRest(false)
            if (!revealedRef.current) {
              revealedRef.current = true
              onRevealedRef.current?.()
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent('hero-revealed'))
              }
            }
          },
          onLeaveBack: () => {
            atRestEdgeRef.current = false
            setAtRest(false)
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

  // Auto-cycle products every 5s while the reveal is at rest (dwell). When atRest
  // flips false (scroll-back or scroll-past), this reverts to the default Salted
  // Caramel bottle baked into the reveal frames, so the reverse reveal stays
  // frame-perfect. Paused entirely under reduced-motion.
  useEffect(() => {
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!atRest || reduced) {
      setProductIndex(DEFAULT_PRODUCT)
      return
    }
    const id = setInterval(() => {
      setProductIndex((i) => (i + 1) % PRODUCTS.length)
    }, 5000)
    return () => clearInterval(id)
  }, [atRest])

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
          transition: 'opacity 0.3s linear',
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

      {/* L2.5 — Atmosphere: the southern world opens the hero, fades as frames begin.
          Same z as the overlay but later in DOM so it sits above it; overlay is
          transparent during the atmosphere phase anyway. */}
      <div
        ref={atmoRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 2,
          opacity: 1,
          background: '#080604',
          pointerEvents: 'none',
        }}
      >
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

      {/* Story beats — atmo beats during the atmosphere phase, frames beats during scroll */}
      {STORY_BEATS.map((beat, i) => {
        const beatRef = [beat0Ref, beat1Ref, beat2Ref, beat3Ref][i]
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
                fontFamily: beat.fontFamily ?? 'var(--font-body)',
                fontWeight: beat.fontFamily ? 400 : 500,
                fontSize: beat.fontSize ?? 'clamp(10px,1.1vw,13px)',
                // tracking by role: display welcome tight, data labels wider
                letterSpacing: beat.fontFamily ? '0.04em' : 'var(--track-eyebrow)',
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
          background: `radial-gradient(circle, ${product.accentColor}73 0%, transparent 70%)`,
          transition: 'background 0.6s ease',
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
          <div className="hero-bottle-float">
            <div className="hero-bottle-persp">
              <div ref={tiltRef} className="hero-bottle-tilt">
                <div className="hero-bottle-stack" key={productIndex}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.bottleFile}
                    alt={`Southern Edge ${product.spiritShort}`}
                    width={340}
                    height={580}
                    onLoad={() => computeRevealRef.current()}
                    className="hero-bottle-img"
                    style={{
                      display: 'block',
                      objectFit: 'contain',
                      maxHeight: '70vh',
                      width: 'auto',
                      height: 'auto',
                    }}
                  />
                  {/* Glass glint — masked to the bottle silhouette, tracks the cursor */}
                  <div
                    className="hero-bottle-glint"
                    aria-hidden
                    style={{
                      WebkitMaskImage: `url(${product.bottleFile})`,
                      maskImage: `url(${product.bottleFile})`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
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
            left: 'clamp(20px, 6vw, 88px)',
            bottom: 'clamp(24px, 5vh, 56px)',
            textAlign: 'left',
            maxWidth: '92vw',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 6vw, 92px)',
              color: 'var(--cream)',
              lineHeight: 1.0,
              letterSpacing: '-0.01em',
            }}
          >
            Work Hard.
          </div>
          <div
            style={{
              fontFamily: 'var(--font-accent)',
              fontStyle: 'italic',
              fontSize: 'clamp(24px, 4vw, 54px)',
              color: 'var(--amber)',
              lineHeight: 1.05,
              marginTop: 6,
            }}
          >
            Drink Smooth.
          </div>
        </div>
      </div>

      {/* Product name — fades in only during the dwell auto-cycle */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 6,
          opacity: atRest ? 1 : 0,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
        }}
      >
        <div
          key={productIndex}
          className="hero-prod-label"
          style={{
            display: 'inline-block',
            padding: '14px 32px 16px',
            borderRadius: 16,
            background: 'rgba(12, 9, 6, 0.5)',
            backdropFilter: 'blur(14px) saturate(120%)',
            WebkitBackdropFilter: 'blur(14px) saturate(120%)',
            border: '1px solid rgba(240, 228, 204, 0.12)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
          }}
        >
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: 'var(--amber)',
              marginBottom: 10,
            }}
          >
            {product.type}
          </span>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(22px, 3vw, 38px)',
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              color: 'var(--cream)',
            }}
          >
            {product.spiritShort}
          </span>
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

      <style>{`
        .hero-bottle-float {
          animation: heroBottleFloat 6.5s ease-in-out infinite;
          will-change: transform;
        }
        .hero-bottle-persp { perspective: 1100px; }
        .hero-bottle-tilt {
          transform-style: preserve-3d;
          transform: rotateX(var(--tiltX, 0deg)) rotateY(var(--tiltY, 0deg));
          transition: transform 0.3s ease-out;
        }
        .hero-bottle-stack { position: relative; display: inline-block; animation: heroBottleSwap 0.55s ease; }
        .hero-bottle-img { filter: drop-shadow(0 30px 55px rgba(0,0,0,0.6)); }
        .hero-bottle-glint {
          position: absolute;
          inset: 0;
          background: radial-gradient(140px 240px at var(--glx, 46%) var(--gly, 26%),
            rgba(255,244,224,0.45), rgba(255,255,255,0.05) 40%, transparent 62%);
          -webkit-mask-size: contain; mask-size: contain;
          -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
          -webkit-mask-position: center; mask-position: center;
          mix-blend-mode: screen;
          pointer-events: none;
        }
        @keyframes heroBottleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes heroBottleSwap {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .hero-prod-label { animation: heroLabelIn 0.6s ease; }
        @keyframes heroLabelIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-bottle-float { animation: none; }
          .hero-bottle-tilt { transition: none; }
          .hero-bottle-stack, .hero-prod-label { animation: none; }
        }
      `}</style>
    </section>
  )
}
