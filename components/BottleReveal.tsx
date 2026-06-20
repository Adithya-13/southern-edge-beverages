'use client'

import { useRef, useState, useEffect } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { PRODUCTS } from '@/lib/constants'

// The reveal video bakes in the Salted Caramel bottle (PRODUCTS index 2) — so it
// is the default and the revert target when the reveal plays in reverse.
const DEFAULT_PRODUCT = 2

// Plays once, automatically, as soon as this section becomes visible — no
// scrubbing required. `once: true` on the ScrollTrigger below means scrolling
// away and back doesn't replay it.
const REVEAL_START_P = 0.70
const REVEAL_END_P = 1.0

interface StoryBeat {
  peak: number
  halfWidth: number
  lines: [string, string]
  align: 'left' | 'right'
  xStyle: React.CSSProperties
}
const STORY_BEATS: StoryBeat[] = [
  { peak: 0.30, halfWidth: 0.10, lines: ['CRAFTED IN', 'SOUTH CAROLINA'], align: 'left',  xStyle: { left: '8vw', right: 'auto', textAlign: 'left' } },
  { peak: 0.55, halfWidth: 0.10, lines: ['6× DISTILLED', '60 PROOF'],     align: 'right', xStyle: { right: '8vw', left: 'auto', textAlign: 'right' } },
]

export default function BottleReveal() {
  const sectionRef = useRef<HTMLElement | null>(null)
  // The reveal itself — native video, plays once forward, no canvas/frame sequencing.
  const revealVideoRef = useRef<HTMLVideoElement | null>(null)
  // Environment background video (fades in once the reveal crossfades to the bottle).
  const bgVideoRef = useRef<HTMLVideoElement | null>(null)
  const bgVideoStartedRef = useRef(false)
  const bgVideoReadyRef = useRef(false)
  // Outer wrapper: centering (transform: translate(-50%,-50%))
  const bottleOuterRef = useRef<HTMLDivElement | null>(null)
  // Inner wrapper: idle-sway target (GSAP x/y — no centering conflict)
  const bottleInnerRef = useRef<HTMLDivElement | null>(null)
  const glowRef = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLDivElement | null>(null)
  const scrollPromptRef = useRef<HTMLDivElement | null>(null)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const beat0Ref = useRef<HTMLDivElement | null>(null)
  const beat1Ref = useRef<HTMLDivElement | null>(null)
  // Faux-3D bottle: idle-sway wrapper + a ref to computeReveal so the bottle
  // <img> onLoad can re-measure (raw <img> can report 0 height before load).
  const tiltRef = useRef<HTMLDivElement | null>(null)
  const computeRevealRef = useRef<() => void>(() => {})

  // Product auto-cycle (only while the reveal is fully complete / dwelling).
  const [productIndex, setProductIndex] = useState(DEFAULT_PRODUCT)
  const [atRest, setAtRest] = useState(false)
  const product = PRODUCTS[productIndex]

  useGSAP(
    () => {
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // This section mounts off-screen below the home section — kick the reveal
      // video loading now so it has the entire time a visitor spends on the home
      // section to buffer, well before this section's trigger fires. It's under
      // 1MB, so a plain load() (no critical/tail split needed) is enough.
      revealVideoRef.current?.load()

      // Kick the (preload="none") bg video once. Fired as soon as the reveal
      // crossfade begins so it has the rest of the reveal to buffer. Marks ready
      // on canplay so the fade-in is gated on real readiness, never a black pop-in.
      const startBgVideo = () => {
        if (bgVideoStartedRef.current) return
        const v = bgVideoRef.current
        if (!v) return
        bgVideoStartedRef.current = true
        const markReady = () => { bgVideoReadyRef.current = true }
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
      // bottle in the final reveal frame (cover-fit video), then settle it down to
      // its resting size, so the video→bottle handoff has no size "pop".
      // 0.78 = bottle height as a fraction of the frame; 0.475 = its vertical center.
      const reveal = { scale: 1.45, y: -22, ready: false }
      const computeReveal = () => {
        if (typeof window === 'undefined') return
        const img = bottleInnerRef.current?.querySelector('img')
        // offsetHeight = untransformed layout height (getBoundingClientRect would be
        // polluted by the scale() already applied to the outer wrapper pre-reveal).
        const bh = img ? img.offsetHeight : window.innerHeight * 0.6
        if (!bh) return
        const v = revealVideoRef.current
        const coverScale = v && v.videoWidth && v.videoHeight
          ? Math.max(window.innerWidth / v.videoWidth, window.innerHeight / v.videoHeight)
          : Math.max(window.innerWidth / 960, window.innerHeight / 720)
        const frameH = (v?.videoHeight || 720) * coverScale
        reveal.scale = Math.min(2.6, Math.max(1, (0.78 * frameH) / bh))
        reveal.y = -(0.5 - 0.475) * frameH
      }
      computeReveal()
      computeRevealRef.current = computeReveal
      if (typeof window !== 'undefined') window.addEventListener('resize', computeReveal)

      // Single progress→visuals mapping, driven by the reveal video's own playback
      // (see playReveal below) — p: 0→1 over the video's natural duration.
      const updateReveal = (p: number) => {
        if (p > 0.02) startBgVideo()

        const beatRefs = [beat0Ref, beat1Ref]
        beatRefs.forEach((ref, i) => {
          if (!ref.current) return
          const beat = STORY_BEATS[i]
          if (p >= REVEAL_START_P) {
            ref.current.style.opacity = '0'
            return
          }
          const dist = Math.abs(p - beat.peak)
          ref.current.style.opacity = String(Math.max(0, 1 - dist / beat.halfWidth))
        })

        // Phase 3: reveal video fades OUT, environment fades IN
        if (p >= REVEAL_START_P) {
          if (!reveal.ready) { computeReveal(); reveal.ready = true }
          const phase = Math.min((p - REVEAL_START_P) / (REVEAL_END_P - REVEAL_START_P), 1)
          const eased = phase < 0.5 ? 2 * phase * phase : -1 + (4 - 2 * phase) * phase
          // Bottle crossfades in over the first 60% at the frame's size, then settles
          // to its resting size over the last 40% — seamless video→bottle handoff.
          const fade = Math.min(phase / 0.6, 1)
          const sr = Math.max(0, (phase - 0.6) / 0.4)
          const settle = sr < 0.5 ? 2 * sr * sr : -1 + (4 - 2 * sr) * sr
          if (revealVideoRef.current) revealVideoRef.current.style.opacity = String(1 - fade)
          if (bgVideoRef.current) bgVideoRef.current.style.opacity = String(bgVideoReadyRef.current ? eased * 0.75 : 0)
          if (overlayRef.current) overlayRef.current.style.opacity = String(eased)
          if (bottleOuterRef.current) {
            bottleOuterRef.current.style.opacity = String(fade)
            const s = reveal.scale + (1 - reveal.scale) * settle
            bottleOuterRef.current.style.transform = `translateY(${reveal.y * (1 - settle)}px) scale(${s})`
          }
          if (glowRef.current) glowRef.current.style.opacity = String(eased * 0.3)
          if (textRef.current) textRef.current.style.opacity = String(eased)
        } else {
          // Still mid-reveal — keep environment hidden, bottle primed at frame size
          if (revealVideoRef.current) revealVideoRef.current.style.opacity = '1'
          if (bgVideoRef.current) bgVideoRef.current.style.opacity = '0'
          if (overlayRef.current) overlayRef.current.style.opacity = '0'
          if (bottleOuterRef.current) {
            bottleOuterRef.current.style.opacity = '0'
            bottleOuterRef.current.style.transform = `translateY(${reveal.y}px) scale(${reveal.scale})`
          }
          if (glowRef.current) glowRef.current.style.opacity = '0'
          if (textRef.current) textRef.current.style.opacity = '0'
        }
      }

      const onRevealComplete = () => {
        setAtRest(true)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('hero-revealed'))
        }
      }

      let rafId = 0
      const stepReveal = () => {
        const v = revealVideoRef.current
        if (!v) return
        const duration = v.duration || 8
        const p = Math.min(v.currentTime / duration, 1)
        if (v.ended || p >= 1) {
          updateReveal(1)
          onRevealComplete()
          return
        }
        updateReveal(p)
        rafId = requestAnimationFrame(stepReveal)
      }

      const playReveal = () => {
        const v = revealVideoRef.current
        if (!v) {
          onRevealComplete()
          return
        }
        const pr = v.play()
        if (pr && typeof pr.catch === 'function') pr.catch(() => {})
        rafId = requestAnimationFrame(stepReveal)
      }

      let snapTrigger: ScrollTrigger | null = null
      if (reduced) {
        // Skip straight to the resting state — seek the video to its last frame
        // (frozen, paused) instead of watching the reveal play out.
        const v = revealVideoRef.current
        if (v) {
          const seekToEnd = () => { v.currentTime = Math.max(0, v.duration - 0.04) }
          if (v.readyState >= 1) seekToEnd()
          else v.addEventListener('loadedmetadata', seekToEnd, { once: true })
        }
        updateReveal(1)
        onRevealComplete()
      } else {
        snapTrigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
          onEnter: playReveal,
        })
      }

      // Idle sway — replaces cursor-tilt parallax so the faux-3D bottle effect plays
      // on its own. Bonus: it now also runs on touch devices, which never had a
      // mouse to drive the old effect.
      const sway = { x: -1, y: -0.6 }
      let swayTween: ReturnType<typeof gsap.to> | null = null
      if (!reduced) {
        swayTween = gsap.to(sway, {
          x: 1,
          y: 0.6,
          duration: 5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          onUpdate: () => {
            if (bottleInnerRef.current) {
              gsap.set(bottleInnerRef.current, { x: sway.x * 18, y: sway.y * 18 })
            }
            if (glowRef.current) {
              gsap.set(glowRef.current, { x: sway.x * 10, y: sway.y * 10 })
            }
            if (tiltRef.current) {
              tiltRef.current.style.setProperty('--tiltY', `${sway.x * 9}deg`)
              tiltRef.current.style.setProperty('--tiltX', `${-sway.y * 7}deg`)
              tiltRef.current.style.setProperty('--glx', `${46 + sway.x * 28}%`)
              tiltRef.current.style.setProperty('--gly', `${26 + sway.y * 18}%`)
            }
          },
        })
      }

      // Scroll-prompt bob (skip for reduced-motion users). Visibility is tied to
      // `atRest` in the JSX — an invite to keep browsing, not a "do this to advance"
      // cue, since the reveal itself is no longer gesture-driven.
      let promptTween: ReturnType<typeof gsap.to> | null = null
      if (!reduced) {
        promptTween = gsap.to(scrollPromptRef.current, {
          y: 10,
          repeat: -1,
          yoyo: true,
          duration: 0.9,
          ease: 'sine.inOut',
        })
      }

      return () => {
        if (rafId) cancelAnimationFrame(rafId)
        snapTrigger?.kill()
        swayTween?.kill()
        promptTween?.kill()
        if (typeof window !== 'undefined') window.removeEventListener('resize', computeReveal)
      }
    },
    { scope: sectionRef },
  )

  // Auto-cycle products every 5s while the reveal is at rest (dwell). Paused
  // entirely under reduced-motion.
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
        ref={bgVideoRef}
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

      {/* L1 — The reveal itself: native video, plays once, no scrubbing. */}
      <video
        ref={revealVideoRef}
        muted
        playsInline
        preload="auto"
        poster="/images/bottle_reveal_poster.jpg?v=2"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
        }}
      >
        {/* ?v=2 cache-busts the cropped re-encode — same URL as the pre-crop file otherwise */}
        <source src="/videos/bottle_reveal.mp4?v=2" type="video/mp4" />
      </video>

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

      {/* Story beats */}
      {STORY_BEATS.map((beat, i) => {
        const beatRef = [beat0Ref, beat1Ref][i]
        return (
          <div
            key={i}
            ref={beatRef}
            style={{
              position: 'absolute',
              top: '50%',
              transform: 'translateY(-50%)',
              ...beat.xStyle,
              // Initial opacity: pre-calculated at p=0 so beats start hidden
              opacity: Math.max(0, 1 - Math.abs(0 - beat.peak) / beat.halfWidth),
              zIndex: 4,
              pointerEvents: 'none',
            }}
          >
            <div style={{
              width: 32,
              height: 1,
              background: 'var(--amber)',
              marginBottom: 12,
              marginLeft: beat.align === 'right' ? 'auto' : 0,
              marginRight: beat.align === 'right' ? 0 : 'auto',
            }} />
            {beat.lines.map((line, li) => (
              <div key={li} style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 'clamp(10px,1.1vw,13px)',
                letterSpacing: 'var(--track-eyebrow)',
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

      {/* L3 — Amber glow (also idle-swayed) */}
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

      {/* L5 — Bottle: flexbox centering (avoids transform conflict with the reveal) */}
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
                  {/* Glass glint — masked to the bottle silhouette, swayed by the idle loop */}
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

      {/* L7 — Scroll prompt: invites continued browsing once the reveal settles */}
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
          opacity: atRest ? 1 : 0,
          transition: 'opacity 0.6s ease',
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
          Scroll to Explore
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
