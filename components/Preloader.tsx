'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { preloadAllAssets } from '@/lib/preload'

interface PreloaderProps {
  onComplete: () => void
}

const MIN_DISPLAY_MS = 1100
// Hard ceiling on the loader: even if a loader is ever changed to drop a timeout,
// completion is bounded so the user always reaches the site.
const MAX_WAIT_MS = 15000

export default function Preloader({ onComplete }: PreloaderProps) {
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)
  const [minElapsed, setMinElapsed] = useState(false)
  // Eased display percentage (0..100) — tweened toward the real fraction.
  const [display, setDisplay] = useState(0)

  // Live target fraction (0..1) written by onProgress; read by the easing tween.
  const targetRef = useRef(0)
  const displayProxyRef = useRef({ val: 0 })
  const exitStarted = useRef(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const curtainRef = useRef<HTMLDivElement>(null)
  const bloomRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)
  const barFillRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLParagraphElement>(null)
  const wordmarkRef = useRef<HTMLDivElement>(null)

  // Mount guard so createPortal(document.body) only runs client-side.
  useEffect(() => setMounted(true), [])

  // Kick off real asset prewarming + the minimum-display timer. The RESOLVED
  // promise is the authoritative "ready" signal — onProgress only feeds the
  // visual counter and can legitimately never fire (idempotency drops a second
  // caller's callback), so we never gate completion on progress >= 1.
  useEffect(() => {
    let alive = true

    preloadAllAssets((fraction) => {
      if (alive) targetRef.current = fraction
    })
      .then(() => {
        if (!alive) return
        targetRef.current = 1
        setReady(true)
      })
      .catch(() => {
        if (alive) {
          targetRef.current = 1
          setReady(true)
        }
      })

    const t = setTimeout(() => {
      if (alive) setMinElapsed(true)
    }, MIN_DISPLAY_MS)

    const failsafe = setTimeout(() => {
      if (alive) {
        targetRef.current = 1
        setReady(true)
      }
    }, MAX_WAIT_MS)

    return () => {
      alive = false
      clearTimeout(t)
      clearTimeout(failsafe)
    }
  }, [])

  useGSAP(
    () => {
      // Portal mounts on the second render; on the first (mounted=false) the refs
      // are null, so bail — otherwise the entrance fromTo's target null and the
      // logo/wordmark/counter/label stay stuck at their inline opacity:0 forever.
      if (!mounted) return

      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Continuously ease the displayed number toward the real target so a warm
      // cache (0->1 instantly) slides up instead of snapping, and a slow load
      // never jitters. Drives a React state mirror for the rendered digits.
      const ease = gsap.to(displayProxyRef.current, {
        duration: 0.36,
        ease: 'none',
        repeat: -1,
        onUpdate: () => {
          const v = displayProxyRef.current
          v.val += (targetRef.current * 100 - v.val) * 0.18
          setDisplay(v.val)
          if (barFillRef.current) {
            gsap.set(barFillRef.current, { scaleX: v.val / 100 })
          }
        },
      })

      if (reduced) {
        gsap.set(
          [logoRef.current, counterRef.current, wordmarkRef.current, labelRef.current],
          { opacity: 1, y: 0 }
        )
        return () => ease.kill()
      }

      // Entrance: mark, counter, wordmark and label rise in sequence.
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } })
      intro
        .fromTo(
          logoRef.current,
          { opacity: 0, y: 14, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.9 }
        )
        .fromTo(
          wordmarkRef.current,
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.8 },
          '-=0.55'
        )
        .fromTo(
          counterRef.current,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.85 },
          '-=0.5'
        )
        .fromTo(
          labelRef.current,
          { opacity: 0, letterSpacing: '0.18em' },
          { opacity: 0.75, letterSpacing: '0.42em', duration: 0.9 },
          '-=0.55'
        )

      // Slow breathing amber bloom under the mark for atmosphere.
      gsap.fromTo(
        bloomRef.current,
        { opacity: 0.18, scale: 0.95 },
        {
          opacity: 0.4,
          scale: 1.12,
          duration: 2.6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        }
      )

      return () => ease.kill()
    },
    { scope: containerRef, dependencies: [mounted] }
  )

  // Orchestrated exit — runs exactly once when both gates are satisfied.
  useGSAP(
    () => {
      if (!(ready && minElapsed)) return
      if (exitStarted.current) return
      exitStarted.current = true

      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Force the number/bar to settle on a clean 100 regardless of easing lag.
      targetRef.current = 1
      displayProxyRef.current.val = 100
      setDisplay(100)
      if (barFillRef.current) gsap.set(barFillRef.current, { scaleX: 1 })

      if (reduced) {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.25,
          onComplete,
        })
        return
      }

      const tl = gsap.timeline({ onComplete })
      // Brief hold on 100, lift the content, then a curtain wipes up to reveal.
      tl.to({}, { duration: 0.45 })
        .to(
          [logoRef.current, wordmarkRef.current, counterRef.current, labelRef.current],
          { opacity: 0, y: -18, duration: 0.5, ease: 'power2.in', stagger: 0.05 },
          0.2
        )
        .to(bloomRef.current, { opacity: 0, duration: 0.5 }, 0.2)
        .set(curtainRef.current, { transformOrigin: 'top' })
        .to(
          curtainRef.current,
          { scaleY: 1, duration: 0.9, ease: 'expo.inOut' },
          '-=0.1'
        )
        .to(containerRef.current, { autoAlpha: 0, duration: 0.35 }, '-=0.2')
    },
    { scope: containerRef, dependencies: [ready, minElapsed] }
  )

  if (!mounted) return null

  const shown = Math.min(100, Math.round(display))
  const padded = String(shown).padStart(2, '0')

  return createPortal(
    <div
      ref={containerRef}
      aria-busy="true"
      role="progressbar"
      aria-valuenow={shown}
      aria-valuemin={0}
      aria-valuemax={100}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--bg-void)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Amber bloom behind the mark */}
      <div
        ref={bloomRef}
        aria-hidden
        style={{
          position: 'absolute',
          width: 620,
          height: 620,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(212,120,26,0.30) 0%, rgba(212,120,26,0.08) 38%, transparent 70%)',
          left: '50%',
          top: '42%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          filter: 'blur(2px)',
        }}
      />

      {/* Top-edge hairline + corner micro-label */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 28,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 1,
          height: 34,
          background:
            'linear-gradient(to bottom, transparent, rgba(212,120,26,0.55))',
          pointerEvents: 'none',
        }}
      />

      {/* SE mark */}
      <div
        ref={logoRef}
        style={{ opacity: 0, position: 'relative', zIndex: 2, marginBottom: 26 }}
      >
        <Image
          src="/images/logo_se_circle_white.png"
          alt="Southern Edge"
          width={66}
          height={66}
          priority
          style={{ objectFit: 'contain', filter: 'drop-shadow(0 0 18px rgba(212,120,26,0.25))' }}
        />
      </div>

      {/* Wordmark */}
      <div
        ref={wordmarkRef}
        style={{
          opacity: 0,
          position: 'relative',
          zIndex: 2,
          fontFamily: 'var(--font-bebas), sans-serif',
          fontSize: 'clamp(26px, 4.5vw, 40px)',
          letterSpacing: '0.34em',
          color: 'var(--cream)',
          lineHeight: 1,
          textIndent: '0.34em',
          marginBottom: 38,
        }}
      >
        SOUTHERN EDGE
      </div>

      {/* Hero percentage counter */}
      <div
        ref={counterRef}
        style={{
          opacity: 0,
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'flex-start',
          fontFamily: 'var(--font-bebas), sans-serif',
          lineHeight: 0.82,
          color: 'var(--cream)',
        }}
      >
        <span
          style={{
            fontSize: 'clamp(96px, 22vw, 200px)',
            fontVariantNumeric: 'tabular-nums',
            background:
              'linear-gradient(180deg, var(--cream) 0%, var(--silver) 70%, rgba(200,200,200,0.5) 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {padded}
        </span>
        <span
          style={{
            fontSize: 'clamp(22px, 4vw, 40px)',
            color: 'var(--amber)',
            marginTop: '0.35em',
            marginLeft: '0.08em',
          }}
        >
          %
        </span>
      </div>

      {/* Amber progress line */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: 'min(260px, 56vw)',
          height: 1,
          marginTop: 30,
          background: 'rgba(240,228,204,0.10)',
          overflow: 'hidden',
        }}
      >
        <div
          ref={barFillRef}
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: 'left center',
            transform: 'scaleX(0)',
            background:
              'linear-gradient(90deg, rgba(212,120,26,0.4), var(--amber) 60%, var(--gold))',
            boxShadow: '0 0 12px rgba(212,120,26,0.6)',
          }}
        />
      </div>

      {/* Micro-label */}
      <p
        ref={labelRef}
        style={{
          opacity: 0,
          position: 'relative',
          zIndex: 2,
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: 10,
          letterSpacing: '0.42em',
          color: 'var(--silver)',
          marginTop: 24,
          textTransform: 'uppercase',
          textIndent: '0.42em',
        }}
      >
        Preparing the Pour
      </p>

      {/* Curtain that wipes up on exit */}
      <div
        ref={curtainRef}
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 3,
          background: 'var(--bg-void)',
          transformOrigin: 'top',
          transform: 'scaleY(0)',
          pointerEvents: 'none',
        }}
      />
    </div>,
    document.body
  )
}
