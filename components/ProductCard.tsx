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

  return (
    <div
      ref={cardRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        background: 'var(--bg-surface)',
        borderRadius: 12,
        border: '1px solid rgba(240,228,204,0.06)',
        overflow: 'hidden',
        flex: 1,
        minWidth: 0,
      }}
    >
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
            background: `radial-gradient(circle at center, ${product.accent}22 0%, transparent 70%)`,
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
        <span
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            fontSize: 10,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--silver)',
            display: 'block',
            marginBottom: 8,
          }}
        >
          {product.spiritType}
        </span>

        <h3
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontWeight: 400,
            fontSize: 'clamp(1.3rem, 2vw, 1.8rem)',
            color: 'var(--cream)',
            marginBottom: 12,
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
            marginBottom: 16,
            margin: '0 0 16px',
          }}
        >
          {product.tagline}
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {product.notes.map((note, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontSize: 11,
                color: 'rgba(240,228,204,0.5)',
              }}
            >
              {'· '}{note}
            </span>
          ))}
        </div>

        {product.award && (
          <p
            style={{
              marginTop: 16,
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: 11,
              color: 'rgba(200,200,200,0.5)',
              margin: '16px 0 0',
            }}
          >
            {product.award}
          </p>
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
