'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Award } from 'lucide-react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { PRODUCTS } from '@/lib/constants'

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      gsap.fromTo(
        '.product-card',
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' },
        }
      )

      gsap.fromTo(
        '.product-bottle',
        { y: 48 },
        {
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
        }
      )
    },
    { scope: sectionRef }
  )

  const handleEnter = (e: React.MouseEvent<HTMLElement>, accent: string) => {
    e.currentTarget.style.borderColor = `${accent}66`
    e.currentTarget.style.transform = 'translateY(-6px)'
  }
  const handleLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.borderColor = 'var(--smoke)'
    e.currentTarget.style.transform = 'translateY(0)'
  }

  return (
    <section
      id="products"
      ref={sectionRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-void)',
        padding: 'clamp(80px,8vw,120px) clamp(20px,5vw,60px)',
      }}
    >
      <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(48px,6vw,80px)' }}>
          <span className="amber-rule" />
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-dm-sans)',
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--amber)',
              marginBottom: 20,
            }}
          >
            Our Premium Collection
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-bebas)',
              fontSize: 'clamp(48px,8vw,88px)',
              lineHeight: 0.95,
              letterSpacing: '0.01em',
              color: 'var(--cream)',
              margin: '0 0 24px',
            }}
          >
            Our Premium Collection
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontSize: 'clamp(15px,1.5vw,17px)',
              lineHeight: 1.7,
              color: 'rgba(240,228,204,0.6)',
              maxWidth: 560,
              margin: '0 auto',
            }}
          >
            Discover our carefully crafted selection of premium beverages, each with its own
            unique character and story.
          </p>
        </div>

        {/* Grid */}
        <div className="products-grid">
          {PRODUCTS.map((product) => (
            <article
              key={product.id}
              className="product-card"
              onMouseEnter={(e) => handleEnter(e, product.accentColor)}
              onMouseLeave={handleLeave}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg-deep)',
                border: '1px solid var(--smoke)',
                borderRadius: 4,
                padding: 'clamp(28px,3vw,40px) clamp(24px,2.5vw,32px) clamp(32px,3vw,40px)',
                transition: 'transform 0.4s ease, border-color 0.4s ease',
                willChange: 'transform',
              }}
            >
              {/* Bottle + glow */}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  height: 'clamp(300px,34vw,360px)',
                  marginBottom: 36,
                }}
              >
                <div
                  aria-hidden
                  style={{
                    position: 'absolute',
                    bottom: '6%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '78%',
                    height: '70%',
                    background: `radial-gradient(ellipse at center, ${product.accentColor}40 0%, ${product.accentColor}14 42%, transparent 72%)`,
                    filter: 'blur(8px)',
                    pointerEvents: 'none',
                  }}
                />
                <Image
                  className="product-bottle"
                  src={product.bottleFile}
                  alt={product.name}
                  width={148}
                  height={391}
                  style={{
                    position: 'relative',
                    height: '100%',
                    width: 'auto',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 24px 40px rgba(0,0,0,0.55))',
                  }}
                />
              </div>

              {/* Type label */}
              <span
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.28em',
                  textTransform: 'uppercase',
                  color: product.accentColor,
                  marginBottom: 10,
                }}
              >
                {product.type}
              </span>

              {/* Name */}
              <h3
                style={{
                  fontFamily: 'var(--font-bebas)',
                  fontSize: 'clamp(28px,3vw,36px)',
                  lineHeight: 1,
                  letterSpacing: '0.02em',
                  color: 'var(--cream)',
                  margin: '0 0 18px',
                }}
              >
                {product.spiritShort}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontFamily: 'var(--font-dm-sans)',
                  fontSize: 14,
                  lineHeight: 1.7,
                  color: 'rgba(240,228,204,0.62)',
                  margin: '0 0 22px',
                }}
              >
                {product.description}
              </p>

              {/* Tasting notes chips */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '8px 10px',
                  marginBottom: 24,
                }}
              >
                {product.tastingNotes.map((note, i) => (
                  <span
                    key={note}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontFamily: 'var(--font-dm-sans)',
                      fontSize: 11,
                      letterSpacing: '0.04em',
                      color: 'var(--silver)',
                    }}
                  >
                    {i > 0 && (
                      <span
                        aria-hidden
                        style={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          background: `${product.accentColor}99`,
                          marginRight: 2,
                        }}
                      />
                    )}
                    {note}
                  </span>
                ))}
              </div>

              {/* Award badge — anchored to bottom for equal alignment */}
              <div
                style={{
                  marginTop: 'auto',
                  paddingTop: product.award ? 20 : 0,
                  borderTop: product.award ? '1px solid var(--smoke)' : 'none',
                  minHeight: 22,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {product.award && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      fontFamily: 'var(--font-dm-sans)',
                      fontSize: 11,
                      letterSpacing: '0.04em',
                      color: 'var(--gold)',
                    }}
                  >
                    <Award size={14} strokeWidth={1.6} aria-hidden />
                    {product.award}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(20px, 2.5vw, 32px);
          align-items: stretch;
        }
        @media (max-width: 900px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .products-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
