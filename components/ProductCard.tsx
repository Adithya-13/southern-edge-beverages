'use client'

import Image from 'next/image'
import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export type ProductCardData = {
  id: string
  spiritType: string
  name: string
  bottle: string
  accent: string
  tagline: string
  notes: string[]
  award: string | null
}

type Props = {
  product: ProductCardData
  index: number
  cardRef?: (el: HTMLDivElement | null) => void
}

export default function ProductCard({ product, index, cardRef }: Props) {
  const bottleRef = useRef<HTMLImageElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (bottleRef.current) {
      gsap.to(bottleRef.current, { y: -12, duration: 0.35, ease: 'power2.out' })
    }
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0.35, duration: 0.35 })
    }
  }

  const handleMouseLeave = () => {
    if (bottleRef.current) {
      gsap.to(bottleRef.current, { y: 0, duration: 0.35 })
    }
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0.15, duration: 0.35 })
    }
  }

  const spiritTypeStyle = {
    fontFamily: 'var(--font-dm-sans)',
    fontWeight: 500,
    fontSize: 10,
    letterSpacing: '0.2em',
    textTransform: 'uppercase' as const,
    color: 'var(--silver)',
    display: 'block',
  }

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        background: 'var(--bg-surface)',
        borderRadius: 4,
        border: '1px solid rgba(240,228,204,0.06)',
        overflow: 'hidden',
        flex: 1,
        minWidth: 0,
      }}
    >
      {/* Top accent stripe */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: `${product.accent}4d`,
          zIndex: 2,
        }}
      />

      {/* Image area */}
      <div
        style={{
          height: 'clamp(260px, 22vw, 320px)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Glow */}
        <div
          ref={glowRef}
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(160deg, transparent 30%, ${product.accent}18 100%)`,
            opacity: 0.15,
            zIndex: 0,
          }}
        />
        {/* Bottle image */}
        <div style={{ position: 'relative', zIndex: 1, height: 280, display: 'flex', alignItems: 'center' }}>
          <Image
            ref={bottleRef as React.Ref<HTMLImageElement>}
            src={product.bottle}
            alt={product.name}
            width={200}
            height={280}
            style={{
              objectFit: 'contain',
              maxHeight: 280,
              width: 'auto',
              display: 'block',
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 28px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <span style={{ display: 'block', width: 16, height: 1, background: product.accent, flexShrink: 0 }} />
          <span style={{ ...spiritTypeStyle }}>
            {product.spiritType}
          </span>
        </div>

        <h3
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontWeight: 500,
            fontSize: 'clamp(1.4rem, 2.2vw, 2rem)',
            color: 'var(--cream)',
            lineHeight: 1.2,
            margin: '0 0 12px',
          }}
        >
          {product.name}
        </h3>

        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: 13,
            color: 'rgba(240,228,204,0.6)',
            lineHeight: 1.6,
            fontStyle: 'italic',
            margin: '0 0 16px',
          }}
        >
          {product.tagline}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
          {product.notes.map((note, i) => (
            <span key={i} style={{ display: 'contents' }}>
              {i > 0 && <span style={{ color: 'var(--amber)', opacity: 0.5, margin: '0 4px' }}>·</span>}
              <span style={{ fontFamily: 'var(--font-dm-sans)', fontSize: 11, color: 'rgba(240,228,204,0.6)' }}>{note}</span>
            </span>
          ))}
        </div>

        {product.award && (
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid rgba(240,228,204,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--gold)', fontSize: 14 }}>🥈</span>
            <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 400, fontSize: 11, color: 'var(--amber)', letterSpacing: '0.05em' }}>
              {product.award}
            </span>
          </div>
        )}
      </div>

      {/* Bottom accent strip */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 3,
          background: product.accent,
        }}
      />
    </div>
  )
}
