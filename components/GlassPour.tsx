'use client'

import { useId, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { Physics2DPlugin } from 'gsap/Physics2DPlugin'

gsap.registerPlugin(MorphSVGPlugin, Physics2DPlugin)

export interface GlassPourProps {
  color: string
  pourId: string
  active: boolean
}

// Glass geometry (viewBox 0 0 200 320)
// Tumbler: slightly wider at top than bottom, tapered.
const GLASS_OUTLINE = 'M58 60 L142 60 L134 268 Q134 280 122 280 L78 280 Q66 280 66 268 Z'
// Interior clip, inset ~6px from the stroke.
const GLASS_INTERIOR = 'M64 66 L136 66 L128.5 266 Q128.5 274 121 274 L79 274 Q71.5 274 71 266 Z'

// Liquid body fills the whole interior region; the group is translated to
// reveal only the portion above the fill line.
const LIQUID_TOP = 66
const LIQUID_BOTTOM = 280
const FILL_LINE = 124 // ~28% down from glass top (60..280)

// Two wave shapes for the surface ripple. Drawn at the fill line, spanning the
// glass width, closing down into the liquid body so the fill reads as solid.
const WAVE_A =
  `M60 ${FILL_LINE} ` +
  `C76 ${FILL_LINE - 5}, 92 ${FILL_LINE + 5}, 100 ${FILL_LINE} ` +
  `C112 ${FILL_LINE - 6}, 128 ${FILL_LINE + 4}, 140 ${FILL_LINE} ` +
  `L140 ${LIQUID_BOTTOM} L60 ${LIQUID_BOTTOM} Z`
const WAVE_B =
  `M60 ${FILL_LINE} ` +
  `C72 ${FILL_LINE + 5}, 88 ${FILL_LINE - 5}, 100 ${FILL_LINE} ` +
  `C114 ${FILL_LINE + 6}, 130 ${FILL_LINE - 4}, 140 ${FILL_LINE} ` +
  `L140 ${LIQUID_BOTTOM} L60 ${LIQUID_BOTTOM} Z`

interface Bubble {
  cx: number
  r: number
}
const BUBBLES: Bubble[] = [
  { cx: 84, r: 3 },
  { cx: 100, r: 2 },
  { cx: 116, r: 4 },
  { cx: 92, r: 2.5 },
  { cx: 108, r: 3.5 },
  { cx: 100, r: 2 },
]

export default function GlassPour({ color, pourId, active }: GlassPourProps) {
  const rootRef = useRef<SVGSVGElement | null>(null)
  const liquidGroupRef = useRef<SVGGElement | null>(null)
  const surfaceRef = useRef<SVGPathElement | null>(null)
  const bubblesRef = useRef<SVGGElement | null>(null)

  const rawId = useId()
  const clipId = `glass-clip-${rawId.replace(/:/g, '')}`

  // Persists across dependency-driven re-runs of useGSAP.
  const hasFilledRef = useRef(false)
  const rippleTlRef = useRef<gsap.core.Tween | null>(null)
  const bubbleTweensRef = useRef<gsap.core.Tween[]>([])

  useGSAP(
    () => {
      const group = liquidGroupRef.current
      const surface = surfaceRef.current
      const bubblesG = bubblesRef.current
      if (!group || !surface || !bubblesG) return

      const drainY = LIQUID_BOTTOM - LIQUID_TOP + 20 // push fully below glass
      const bubbleNodes = Array.from(
        bubblesG.querySelectorAll<SVGCircleElement>('circle'),
      )

      const startRipple = () => {
        rippleTlRef.current?.kill()
        rippleTlRef.current = gsap.to(surface, {
          duration: 1.4,
          morphSVG: WAVE_B,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      const stopRipple = () => {
        rippleTlRef.current?.kill()
        rippleTlRef.current = null
      }

      const killBubbles = () => {
        bubbleTweensRef.current.forEach((t) => t.kill())
        bubbleTweensRef.current = []
      }

      const startBubbles = () => {
        killBubbles()
        bubbleTweensRef.current = bubbleNodes.map((node, i) => {
          const spawn = () => {
            gsap.set(node, { x: 0, y: 0, opacity: 0 })
            const tween = gsap.to(node, {
              duration: gsap.utils.random(1.6, 2.6),
              opacity: 0,
              keyframes: {
                opacity: [0, 0.5, 0.5, 0],
                easeEach: 'none',
              },
              physics2D: {
                velocity: gsap.utils.random(60, 90),
                angle: gsap.utils.random(-100, -80),
                gravity: 0,
              },
              delay: gsap.utils.random(0, 1.2),
              ease: 'none',
              onComplete: spawn,
            })
            // Track the latest tween for this lane so cleanup can kill it.
            bubbleTweensRef.current[i] = tween
          }
          spawn()
          return bubbleTweensRef.current[i]
        })
      }

      // Recolor is handled via JSX `fill={color}`; React swaps it on prop
      // change while the liquid is drained/out of view.

      if (!hasFilledRef.current) {
        // First fill: no drain. Snap drained, then fill up.
        hasFilledRef.current = true
        gsap.set(group, { y: drainY })
        gsap.to(group, {
          y: 0,
          duration: 0.95,
          ease: 'power2.out',
          onComplete: () => {
            if (active) startBubbles()
          },
        })
        if (active) {
          startRipple()
        } else {
          stopRipple()
          killBubbles()
        }
      } else {
        // Subsequent pourId/color change: drain, recolor (JSX), refill.
        const tl = gsap.timeline()
        tl.to(group, { y: drainY, duration: 0.35, ease: 'power2.in' })
          .add(() => {
            // color already updated by React on this render
          })
          .to(group, {
            y: 0,
            duration: 0.95,
            ease: 'power2.out',
            onComplete: () => {
              if (active) startBubbles()
            },
          })

        if (active) {
          startRipple()
        } else {
          stopRipple()
          killBubbles()
        }
      }

      if (!active) {
        // Keep liquid at filled state; just ensure loops are off.
        stopRipple()
        killBubbles()
        gsap.set(group, { y: 0 })
      }

      return () => {
        stopRipple()
        killBubbles()
      }
    },
    { scope: rootRef, dependencies: [pourId, active, color] },
  )

  return (
    <svg
      ref={rootRef}
      viewBox="0 0 200 320"
      width="100%"
      style={{
        maxWidth: 200,
        height: 'auto',
        display: 'block',
        margin: '0 auto',
        overflow: 'visible',
      }}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={GLASS_INTERIOR} />
        </clipPath>
      </defs>

      {/* Liquid, clipped to the glass interior */}
      <g clipPath={`url(#${clipId})`}>
        <g ref={liquidGroupRef}>
          {/* Solid liquid body */}
          <rect
            x={60}
            y={FILL_LINE}
            width={80}
            height={LIQUID_BOTTOM - FILL_LINE}
            fill={color}
            opacity={0.85}
          />
          {/* Wavy top surface (morphs) */}
          <path ref={surfaceRef} d={WAVE_A} fill={color} opacity={0.85} />
          {/* Rising bubbles */}
          <g ref={bubblesRef}>
            {BUBBLES.map((b, i) => (
              <circle
                key={i}
                cx={b.cx}
                cy={FILL_LINE + 6}
                r={b.r}
                fill="rgba(255,255,255,0.5)"
                opacity={0}
              />
            ))}
          </g>
        </g>
      </g>

      {/* Soft inner shadow for depth */}
      <path
        d={GLASS_INTERIOR}
        fill="none"
        stroke="rgba(0,0,0,0.18)"
        strokeWidth={3}
        style={{ filter: 'blur(2px)' }}
        clipPath={`url(#${clipId})`}
      />

      {/* Glass outline */}
      <path
        d={GLASS_OUTLINE}
        fill="none"
        stroke="rgba(240,228,204,0.45)"
        strokeWidth={2}
      />

      {/* Rim highlight */}
      <ellipse
        cx={100}
        cy={60}
        rx={42}
        ry={5}
        fill="none"
        stroke="rgba(240,228,204,0.55)"
        strokeWidth={1.5}
      />
    </svg>
  )
}
