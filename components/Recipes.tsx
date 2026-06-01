'use client'

import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import RecipeCard, { RecipeData } from '@/components/RecipeCard'
import { RECIPES as RECIPE_DATA } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

const RECIPES: RecipeData[] = RECIPE_DATA.map((r) => ({
  name: r.name,
  spirit: r.baseSpirit,
  accent: r.accentColor,
  bottle: r.bottleFile,
  ingredients: r.ingredients,
  instructions: r.instructions,
}))

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
        <span className="amber-rule" />
        <span
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            fontSize: 10,
            letterSpacing: '0.3em',
            color: 'var(--amber)',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          COCKTAIL RECIPES
        </span>
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
