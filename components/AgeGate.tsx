'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

interface AgeGateProps {
  onVerified: () => void
}

export default function AgeGate({ onVerified }: AgeGateProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [declined, setDeclined] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Cookie check — skip gate if already verified
  useGSAP(
    () => {
      if (document.cookie.includes('age_verified=true')) {
        onVerified()
        return
      }
      // Fade in on mount
      gsap.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.1 })
    },
    { scope: containerRef },
  )

  function handleYes() {
    document.cookie = 'age_verified=true; max-age=2592000; path=/'
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.in',
      onComplete: onVerified,
    })
  }

  function handleNo() {
    setDeclined(true)
  }

  if (!mounted) return null

  return createPortal(
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        background: 'var(--bg-void)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      {declined ? (
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontWeight: 300,
              fontSize: '1.5rem',
              color: 'var(--cream)',
              margin: 0,
            }}
          >
            You must be 21 or older to access this site.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              display: 'inline-block',
              marginTop: '24px',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '13px',
              color: 'var(--silver)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            ← Return
          </button>
        </div>
      ) : (
        <>
          <Image
            src="/images/logo_se_circle_white.png"
            alt="Southern Edge"
            height={48}
            width={48}
            style={{ height: 48, width: 'auto', marginBottom: '48px' }}
            priority
          />

          <h1
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontWeight: 300,
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              color: 'var(--cream)',
              textAlign: 'center',
              margin: 0,
            }}
          >
            Are you of legal drinking age?
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: '14px',
              color: 'var(--silver)',
              marginTop: '8px',
              opacity: 0.6,
              textAlign: 'center',
            }}
          >
            Please verify your age to enter.
          </p>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: '16px',
              marginTop: '48px',
              justifyContent: 'center',
              width: '100%',
              maxWidth: '420px',
            }}
          >
            <YesButton onClick={handleYes} />
            <NoButton onClick={handleNo} />
          </div>
        </>
      )}
    </div>,
    document.body,
  )
}

function YesButton({ onClick }: { onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)

  function handleMouseEnter() {
    gsap.to(ref.current, { boxShadow: '0 0 24px rgba(212,120,26,0.5)', duration: 0.2 })
  }
  function handleMouseLeave() {
    gsap.to(ref.current, { boxShadow: '0 0 0px rgba(212,120,26,0)', duration: 0.2 })
  }

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: 'var(--amber)',
        color: 'var(--bg-void)',
        fontFamily: 'var(--font-dm-sans)',
        fontWeight: 500,
        fontSize: '13px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        padding: '16px 32px',
        borderRadius: '2px',
        border: 'none',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flex: '1 1 140px',
      }}
    >
      Yes, I Am 21+
    </button>
  )
}

function NoButton({ onClick }: { onClick: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)

  function handleMouseEnter() {
    gsap.to(ref.current, { borderColor: 'rgba(200,200,200,0.7)', duration: 0.2 })
  }
  function handleMouseLeave() {
    gsap.to(ref.current, { borderColor: 'rgba(200,200,200,0.3)', duration: 0.2 })
  }

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        background: 'transparent',
        border: '1px solid rgba(200,200,200,0.3)',
        color: 'var(--silver)',
        fontFamily: 'var(--font-dm-sans)',
        fontWeight: 500,
        fontSize: '13px',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        padding: '16px 32px',
        borderRadius: '2px',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flex: '1 1 140px',
      }}
    >
      No, I Am Not
    </button>
  )
}
