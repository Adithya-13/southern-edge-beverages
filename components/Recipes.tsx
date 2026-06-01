'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import RecipeCard, { RecipeData } from '@/components/RecipeCard'

gsap.registerPlugin(ScrollTrigger)

const RECIPES: RecipeData[] = [
  {
    name: 'Spiked Peach Tea',
    spirit: 'Sweet Tea Vodka',
    accent: '#C23B22',
    bottle: '/images/bottle_sweettea.png',
    ingredients: [
      '2 oz SE Sweet Tea Vodka',
      'Peach purée',
      'Splash of sour mix',
      'Peach garnish',
    ],
    instructions: 'Build in a glass over ice. Garnish with fresh peach.',
  },
  {
    name: 'Cranberry Caramel Cooler',
    spirit: 'Salted Caramel Whiskey',
    accent: '#D4781A',
    bottle: '/images/bottle_caramel.png',
    ingredients: [
      '1½ oz SE Salted Caramel Whiskey',
      '2 oz cranberry juice',
      '1 oz simple syrup',
      'Club soda',
      'Fresh cranberries and rosemary for garnish',
    ],
    instructions:
      'Shake whiskey, juice, syrup with ice. Top with club soda. Garnish with cranberries and rosemary.',
  },
  {
    name: 'Pineapple Edge',
    spirit: 'Sweet Tea Vodka',
    accent: '#C23B22',
    bottle: '/images/bottle_sweettea.png',
    ingredients: [
      '2 oz SE Sweet Tea Vodka',
      '2 oz pineapple juice',
      '1 oz lemonade',
      'Simple syrup (adjust to taste)',
      'Pineapple slices and lemon slices for garnish',
    ],
    instructions: 'Pour, shake, enjoy. Garnish with pineapple and lemon slices.',
  },
]

export default function Recipes() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useGSAP(
    () => {
      const cards = cardRefs.current.filter(Boolean)
      if (!cards.length) return

      gsap.fromTo(
        cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            once: true,
          },
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="cocktails"
      ref={sectionRef}
      style={{
        background: 'var(--bg-deep)',
        padding: 'clamp(80px,10vw,120px) clamp(20px,5vw,40px)',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--silver)',
            marginBottom: 16,
          }}
        >
          Cocktail Recipes
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontWeight: 300,
            fontSize: 'clamp(2.5rem,5vw,5rem)',
            fontStyle: 'italic',
            color: 'var(--cream)',
          }}
        >
          MIX IT UP.
        </h2>
      </div>

      {/* Card grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 24,
          maxWidth: 1200,
          margin: '0 auto',
        }}
        className="recipes-grid"
      >
        {RECIPES.map((recipe, i) => (
          <RecipeCard
            key={recipe.name}
            recipe={recipe}
            cardRef={(el) => {
              cardRefs.current[i] = el
            }}
          />
        ))}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .recipes-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}
