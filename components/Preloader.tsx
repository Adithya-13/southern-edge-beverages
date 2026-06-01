'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

interface PreloaderProps {
  onComplete?: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  // 'pending' | 'animate' | 'done'
  const [phase, setPhase] = useState<'pending' | 'animate' | 'done'>('pending')
  const containerRef = useRef<HTMLDivElement>(null)
  const logoWrapRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const bloomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('preloaderShown')
    if (alreadyShown) {
      setPhase('done')
      onComplete?.()
    } else {
      setPhase('animate')
    }
  }, [onComplete])

  useGSAP(
    () => {
      if (phase !== 'animate') return
      if (!containerRef.current || !logoWrapRef.current || !textRef.current || !bloomRef.current) return

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('preloaderShown', 'true')
          setPhase('done')
          onComplete?.()
        },
      })

      // t=0.0s — logo fade in + scale
      tl.fromTo(
        logoWrapRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
      )

      // t=0.5s — amber bloom CSS animation trigger
      tl.add(() => {
        if (bloomRef.current) {
          bloomRef.current.style.animationName = 'amberBloom'
          bloomRef.current.style.animationDuration = '1.8s'
          bloomRef.current.style.animationTimingFunction = 'ease-in-out'
          bloomRef.current.style.animationFillMode = 'both'
        }
      }, 0.5)

      // t=1.2s — text fade in + letter spacing expand
      tl.fromTo(
        textRef.current,
        { opacity: 0, letterSpacing: '0.08em' },
        { opacity: 1, letterSpacing: '0.25em', duration: 0.8, ease: 'power2.out' },
        1.2
      )

      // t=3.2s — entire preloader fades out
      tl.to(containerRef.current, { opacity: 0, duration: 0.5, ease: 'power2.in' }, 3.2)
    },
    { scope: containerRef, dependencies: [phase] }
  )

  // 'done' — unmount cleanly
  if (phase === 'done') return null

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--bg-void)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
      }}
    >
      {/* Amber bloom — absolutely positioned behind logo */}
      <div
        ref={bloomRef}
        style={{
          position: 'absolute',
          width: 220,
          height: 220,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--amber) 0%, transparent 70%)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Logo — wrapped so GSAP can target the div for opacity/scale */}
      <div
        ref={logoWrapRef}
        style={{ position: 'relative', zIndex: 1, opacity: 0 }}
      >
        <Image
          src="/images/logo_se.png"
          alt="Southern Edge"
          width={80}
          height={80}
          priority
        />
      </div>

      {/* Brand name */}
      <p
        ref={textRef}
        style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontWeight: 500,
          fontSize: '11px',
          letterSpacing: '0.08em',
          color: 'var(--silver)',
          fontVariant: 'small-caps',
          textTransform: 'uppercase',
          opacity: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        Southern Edge Fine Spirits
      </p>
    </div>
  )
}
