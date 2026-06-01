'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import ProductCard, { type ProductCardData } from './ProductCard'

gsap.registerPlugin(ScrollTrigger)

const PRODUCTS: ProductCardData[] = [
  {
    id: 'sweettea',
    spiritType: 'Sweet Tea Vodka',
    name: 'Sweet Tea Flavored Vodka',
    bottle: '/images/bottle_caramel.png',
    accent: '#C23B22',
    tagline: 'Made with succulent corn, authentic black tea, and juicy sugar cane.',
    notes: ['Green tea nose', 'Sweet inviting palate', 'Delightful finish'],
    award: 'Silver Medal — USA Spirits Ratings 2024 — 83pts',
  },
  {
    id: 'caramel',
    spiritType: 'Salted Caramel Whiskey',
    name: 'Salted Caramel Flavored Whiskey',
    bottle: '/images/bottle_caramel.png',
    accent: '#D4781A',
    tagline: 'Aged in oak barrels, with a pleasing balance of salty and sweet that does not overpower.',
    notes: ['Hazelnut nose', 'Maple & salted donut palate', 'Caramel finish'],
    award: 'Silver Medal — USA Spirits Ratings 2024 — 84pts',
  },
  {
    id: 'limon',
    spiritType: 'Se Limón Tequila',
    name: 'Se Limón Flavored Tequila',
    bottle: '/images/bottle_caramel.png',
    accent: '#7CB342',
    tagline: 'Originating in Jalisco Mexico, 100% Blue Agave with refreshing citrus notes of lemon and lime.',
    notes: ['100% Blue Agave', 'Lemon & lime citrus', '6× distilled'],
    award: null,
  },
]

export default function Products() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(
    () => {
      const cards = cardRefs.current.filter(Boolean)
      if (!cards.length) return

      gsap.fromTo(
        cards,
        { opacity: 0, x: 80 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
          },
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="products"
      ref={sectionRef}
      style={{
        background: 'var(--bg-void)',
        padding: 'clamp(80px, 10vw, 120px) 0',
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: 'center',
          paddingBottom: 64,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: '0.25em',
            color: 'var(--silver)',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 16,
          }}
        >
          THE SPIRITS
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(56px, 9vw, 120px)',
            color: 'var(--cream)',
            letterSpacing: '0.02em',
            lineHeight: 1,
            margin: 0,
          }}
        >
          TASTE THE EDGE.
        </h2>
      </div>

      {/* Cards container */}
      <div
        style={{
          display: 'flex',
          gap: 24,
          padding: '0 clamp(20px, 3vw, 40px)',
          flexWrap: 'nowrap',
        }}
        className="products-cards"
      >
        {PRODUCTS.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            cardRef={(el) => {
              cardRefs.current[index] = el
            }}
          />
        ))}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .products-cards {
            flex-direction: column !important;
            padding: 0 20px !important;
          }
        }
        @media (min-width: 769px) {
          .products-cards {
            padding: 0 40px !important;
          }
        }
      `}</style>
    </section>
  )
}
