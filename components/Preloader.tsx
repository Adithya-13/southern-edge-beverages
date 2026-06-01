'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

interface PreloaderProps {
  onComplete: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [skip, setSkip] = useState<boolean | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const bloomRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (sessionStorage.getItem('preloaderShown')) {
      setSkip(true)
      onComplete()
    } else {
      setSkip(false)
    }
  }, [onComplete])

  useGSAP(
    () => {
      if (skip !== false) return

      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('preloaderShown', 'true')
          onComplete()
        },
      })

      // t=0.0 logo fade+scale
      tl.fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }
      )

      // t=0.5 bloom in
      tl.fromTo(
        bloomRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 0.35, scale: 1.2, duration: 0.9, ease: 'power2.inOut' },
        0.5
      )
      // bloom out
      tl.to(bloomRef.current, { opacity: 0, scale: 1.5, duration: 0.9 })

      // t=1.2 text letter-spacing expand
      tl.fromTo(
        textRef.current,
        { opacity: 0, letterSpacing: '0.08em' },
        { opacity: 1, letterSpacing: '0.22em', duration: 0.8, ease: 'power2.out' },
        1.2
      )

      // t=3.2 container fade out
      tl.to(containerRef.current, { opacity: 0, duration: 0.5 }, 3.2)
    },
    { scope: containerRef, dependencies: [skip] }
  )

  // null during SSR and while checking sessionStorage.
  // Must not reference document.body above this guard — server render returns null here.
  if (skip === null || skip === true) return null

  return createPortal(
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
      }}
    >
      {/* Amber bloom — absolutely centered */}
      <div
        ref={bloomRef}
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(212,120,26,0.35) 0%, transparent 70%)',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      {/* Logo */}
      <div ref={logoRef} style={{ opacity: 0, position: 'relative', zIndex: 1 }}>
        <Image
          src="/images/logo_se.png"
          alt="Southern Edge"
          width={80}
          height={80}
          priority
          style={{ objectFit: 'contain' }}
        />
      </div>

      {/* Brand name */}
      <p
        ref={textRef}
        style={{
          fontFamily: 'var(--font-dm-sans), sans-serif',
          fontSize: '11px',
          letterSpacing: '0.08em',
          color: 'var(--silver)',
          marginTop: '20px',
          textTransform: 'uppercase',
          opacity: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        Southern Edge Fine Spirits
      </p>
    </div>,
    document.body,
  )
}
