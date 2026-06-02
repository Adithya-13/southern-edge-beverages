'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { STORY, VALUES } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

export default function OurStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const photoRef = useRef<HTMLDivElement>(null)
  const interviewRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)

  const [openIndex, setOpenIndex] = useState<number>(0)

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? -1 : i))

  useGSAP(
    () => {
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      const fade = (target: Element | Element[] | null, stagger = 0.08) => {
        if (!target) return
        gsap.fromTo(
          target,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger,
            ease: 'power2.out',
            scrollTrigger: { trigger: target as Element, start: 'top 80%' },
          }
        )
      }

      if (headerRef.current) {
        fade(Array.from(headerRef.current.children) as Element[], 0.1)
      }
      if (introRef.current) {
        fade(Array.from(introRef.current.querySelectorAll('[data-reveal]')) as Element[], 0.12)
      }
      if (interviewRef.current) {
        fade(Array.from(interviewRef.current.children) as Element[], 0.1)
      }
      if (valuesRef.current) {
        fade(Array.from(valuesRef.current.children) as Element[], 0.12)
      }

      if (photoRef.current) {
        gsap.fromTo(
          photoRef.current,
          { opacity: 0, scale: 1.06 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: photoRef.current, start: 'top 82%' },
          }
        )
      }
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="story"
      ref={sectionRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-deep)',
        padding: 'clamp(96px,11vw,150px) clamp(20px,5vw,60px)',
      }}
    >
      {/* Ghosted oversized wordmark behind the header (type-as-texture) */}
      <span className="ghost-word" aria-hidden style={{ top: '-2%', left: '-2%' }}>
        STORY
      </span>

      <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* 1 — Header (left-aligned, art-directed) */}
        <div
          ref={headerRef}
          style={{ textAlign: 'left', maxWidth: 760, marginBottom: 'clamp(56px,7vw,88px)' }}
        >
          <span className="eyebrow" style={{ marginBottom: 22 }}>
            {STORY.eyebrow}
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'var(--fs-h1)',
              lineHeight: 'var(--lh-h1)',
              color: 'var(--cream)',
              margin: '0 0 24px',
              letterSpacing: '-0.01em',
            }}
          >
            {STORY.headline}
          </h2>
          <p
            className="measure"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 'var(--fs-lead)',
              lineHeight: 1.6,
              color: 'rgba(240,228,204,0.72)',
              margin: 0,
            }}
          >
            {STORY.intro}
          </p>
        </div>

        {/* 2 — Two-column intro block */}
        <div ref={introRef} className="story-intro">
          <div className="story-intro-text" data-reveal>
            <span className="amber-rule-left" />
            <p
              style={{
                fontFamily: 'var(--font-accent)',
                fontWeight: 400,
                fontSize: 'clamp(1.25rem,2vw,1.6rem)',
                lineHeight: 1.6,
                color: 'var(--cream)',
                margin: '0 0 32px',
              }}
            >
              {STORY.body}
            </p>
            <span
              style={{
                fontFamily: 'var(--font-body)',
                fontWeight: 500,
                fontSize: 10,
                letterSpacing: 'var(--track-eyebrow-sm)',
                textTransform: 'uppercase',
                color: 'rgba(240,228,204,0.5)',
                display: 'block',
                marginBottom: 6,
              }}
            >
              Founders
            </span>
            <span
              style={{
                fontFamily: 'var(--font-accent)',
                fontStyle: 'italic',
                fontSize: 'clamp(1.9rem,3.4vw,2.6rem)',
                color: 'var(--amber)',
                lineHeight: 1.15,
                display: 'block',
              }}
            >
              {STORY.founders}
            </span>
          </div>

          <div
            ref={photoRef}
            className="story-intro-photo"
            data-reveal
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              border: '1px solid var(--smoke)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
              position: 'relative',
            }}
          >
            <Image
              src={STORY.foundersPhoto}
              alt={`${STORY.founders}, founders of Southern Edge Fine Spirits`}
              width={960}
              height={720}
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ display: 'block', width: '100%', height: 'auto', objectFit: 'cover' }}
            />
            <span
              aria-hidden
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(8,6,4,0) 55%, rgba(8,6,4,0.45) 100%)',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* 3 — Founder interview */}
        <div style={{ margin: 'clamp(72px,9vw,120px) 0 0' }}>
          <span className="eyebrow" style={{ marginBottom: 28 }}>
            In Their Words
          </span>

          <div ref={interviewRef} style={{ borderTop: '1px solid var(--smoke)' }}>
            {STORY.interview.map((item, i) => {
              const open = openIndex === i
              return (
                <div key={i} style={{ borderBottom: '1px solid var(--smoke)' }}>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    aria-expanded={open}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 24,
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      padding: 'clamp(22px,2.6vw,30px) 0',
                      color: open ? 'var(--amber)' : 'var(--cream)',
                      transition: 'color 0.3s ease',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-dm-sans)',
                        fontWeight: 500,
                        fontSize: 'clamp(13px,1.4vw,15px)',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        lineHeight: 1.4,
                      }}
                    >
                      {item.q}
                    </span>
                    <Plus
                      size={20}
                      strokeWidth={1.5}
                      style={{
                        flexShrink: 0,
                        marginTop: 2,
                        color: 'var(--amber)',
                        transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
                        transition: 'transform 0.35s ease',
                      }}
                    />
                  </button>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateRows: open ? '1fr' : '0fr',
                      transition: 'grid-template-rows 0.45s ease',
                    }}
                  >
                    <div style={{ overflow: 'hidden' }}>
                      <p
                        style={{
                          fontFamily: 'var(--font-cormorant)',
                          fontWeight: 300,
                          fontStyle: 'italic',
                          fontSize: 'clamp(1.15rem,1.8vw,1.5rem)',
                          lineHeight: 1.75,
                          color: 'rgba(240,228,204,0.82)',
                          margin: 0,
                          padding: '0 clamp(0px,4vw,52px) clamp(26px,3vw,40px) 0',
                          maxWidth: 860,
                        }}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 4 — Our Values */}
        <div style={{ margin: 'clamp(72px,9vw,120px) 0 0' }}>
          <span className="eyebrow" style={{ marginBottom: 'clamp(28px,3.5vw,44px)' }}>
            Our Values
          </span>

          <div ref={valuesRef} className="story-values">
            {VALUES.map((v) => (
              <div key={v.title} className="story-value">
                <span className="amber-rule-left" />
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 400,
                    fontSize: 'var(--fs-h3)',
                    lineHeight: 1.1,
                    letterSpacing: '0',
                    color: 'var(--cream)',
                    margin: '0 0 14px',
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 400,
                    fontSize: 'var(--fs-small)',
                    lineHeight: 1.75,
                    color: 'rgba(240,228,204,0.68)',
                    margin: 0,
                  }}
                >
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .story-intro {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(36px, 5vw, 72px);
          align-items: center;
        }
        .story-intro-text {
          display: flex;
          flex-direction: column;
        }
        .story-values {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(28px, 4vw, 56px);
        }
        .story-value {
          display: flex;
          flex-direction: column;
        }
        @media (max-width: 768px) {
          .story-intro {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .story-intro-photo {
            order: -1;
          }
          .story-values {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>
    </section>
  )
}
