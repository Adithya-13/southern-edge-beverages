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
      <div
        style={{
          height: 240,
          position: 'relative',
          background: `linear-gradient(160deg, var(--bg-void) 0%, ${recipe.accent}33 60%, ${recipe.accent}55 100%)`,
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 12,
            right: 16,
            fontFamily: 'var(--font-vibes)',
            fontSize: 80,
            color: recipe.accent,
            opacity: 0.2,
            pointerEvents: 'none',
            userSelect: 'none',
            lineHeight: 1,
            whiteSpace: 'nowrap',
          }}
        >
          {recipe.spirit}
        </span>

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            overflow: 'visible',
            marginTop: -20,
          }}
        >
          <Image
            src={recipe.bottle}
            alt={recipe.spirit}
            width={80}
            height={195}
            style={{
              height: 195,
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>
      </div>

      <div style={{ padding: 28 }}>
        <h3
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontWeight: 500,
            fontSize: '1.6rem',
            letterSpacing: '-0.01em',
            color: 'var(--cream)',
            marginBottom: 12,
          }}
        >
          {recipe.name}
        </h3>

        <span
          style={{
            display: 'inline-block',
            background: `${recipe.accent}18`,
            border: `1px solid ${recipe.accent}66`,
            color: recipe.accent,
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

        <button
          onClick={toggleOpen}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 12,
            background: 'none',
            border: 'none',
            padding: '8px 0',
            cursor: 'pointer',
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: open ? 'var(--amber)' : 'var(--silver)',
            transition: 'color 0.2s',
          }}
        >
          <span style={{
            display: 'inline-block',
            width: 16,
            height: 1,
            background: open ? 'var(--amber)' : 'var(--silver)',
            transition: 'background 0.2s',
            flexShrink: 0,
          }} />
          {open ? 'Close' : 'View Recipe'}
          <span style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s', display: 'inline-block', fontSize: 10 }}>▾</span>
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
