'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

export type RecipeData = {
  name: string
  spirit: string
  accent: string
  bottle: string
  ingredients: string[]
  instructions: string
}

type Props = {
  recipe: RecipeData
  cardRef?: (el: HTMLDivElement | null) => void
}

export default function RecipeCard({ recipe, cardRef }: Props) {
  const [open, setOpen] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  const toggleOpen = () => {
    const next = !open
    setOpen(next)
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        height: next ? contentRef.current.scrollHeight : 0,
        duration: 0.5,
        ease: 'power2.inOut',
      })
    }
  }

  return (
    <div
      ref={cardRef}
      style={{
        background: 'var(--bg-surface)',
        borderRadius: 12,
        overflow: 'hidden',
        border: '1px solid var(--smoke)',
      }}
    >
      {/* Image area */}
      <div
        style={{
          height: 220,
          position: 'relative',
          overflow: 'hidden',
          background: `linear-gradient(135deg, var(--bg-deep) 0%, ${recipe.accent}22 100%)`,
        }}
      >
        {/* Decorative spirit name watermark */}
        <span
          style={{
            position: 'absolute',
            bottom: 12,
            left: 16,
            fontFamily: 'var(--font-vibes)',
            fontSize: 56,
            color: recipe.accent,
            opacity: 0.12,
            pointerEvents: 'none',
            userSelect: 'none',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {recipe.spirit}
        </span>

        {/* Product bottle */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Image
            src={recipe.bottle}
            alt={recipe.spirit}
            width={80}
            height={170}
            style={{
              height: 170,
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 28 }}>
        <h3
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontWeight: 500,
            fontSize: '1.4rem',
            color: 'var(--cream)',
            marginBottom: 12,
          }}
        >
          {recipe.name}
        </h3>

        {/* Spirit pill */}
        <span
          style={{
            display: 'inline-block',
            background: recipe.accent,
            color: 'var(--bg-void)',
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            fontSize: 10,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '4px 12px',
            borderRadius: 2,
            marginBottom: 16,
          }}
        >
          {recipe.spirit}
        </span>

        {/* Toggle button */}
        <button
          onClick={toggleOpen}
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 400,
            fontSize: 13,
            color: 'var(--silver)',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
            marginTop: 4,
            display: 'block',
          }}
        >
          {open ? 'Close ↑' : 'View Recipe ↓'}
        </button>

        {/* Expandable content — initial height 0 */}
        <div
          ref={contentRef}
          style={{
            height: 0,
            overflow: 'hidden',
          }}
        >
          <div style={{ paddingTop: 20 }}>
            <p
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 500,
                fontSize: 11,
                color: 'var(--silver)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: 10,
              }}
            >
              Ingredients
            </p>

            <ul
              style={{
                listStyle: 'disc',
                paddingLeft: 16,
                marginBottom: 20,
              }}
            >
              {recipe.ingredients.map((item, i) => (
                <li
                  key={i}
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontWeight: 300,
                    fontSize: 14,
                    color: 'rgba(240,228,204,0.7)',
                    lineHeight: 2,
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>

            <p
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 500,
                fontSize: 11,
                color: 'var(--silver)',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                marginBottom: 10,
              }}
            >
              Method
            </p>

            <p
              style={{
                fontFamily: 'var(--font-dm-sans)',
                fontWeight: 300,
                fontSize: 14,
                color: 'rgba(240,228,204,0.6)',
                lineHeight: 1.8,
              }}
            >
              {recipe.instructions}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
