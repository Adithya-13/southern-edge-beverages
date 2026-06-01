'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { COPY, BRAND_FACTS } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

const QUOTE = COPY.manifesto

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const subRef = useRef<HTMLParagraphElement>(null)
  const factsRef = useRef<HTMLDivElement>(null)
  const watermarkRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)

  const FACTS = BRAND_FACTS
  const words = QUOTE.split(' ')

  useGSAP(
    () => {
      const validWords = wordRefs.current.filter(Boolean)

      gsap.fromTo(
        validWords,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )

      gsap.fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          delay: 0.4,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )

      gsap.fromTo(
        factsRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          delay: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
          },
        }
      )

      gsap.to(watermarkRef.current, {
        rotation: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 2,
        },
      })

      gsap.to(quoteRef.current, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="story"
      ref={sectionRef}
      style={{
        minHeight: '100vh',
        background: 'var(--bg-deep)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(60px,8vw,120px) clamp(20px,5vw,60px)',
      }}
    >
      <div
        ref={watermarkRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.04,
          pointerEvents: 'none',
          width: 600,
          height: 'auto',
          zIndex: 0,
        }}
      >
        <Image
          src="/images/logo_lockup.png"
          alt=""
          width={600}
          height={600}
          style={{ width: 600, height: 'auto' }}
          priority={false}
        />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: 960,
        }}
      >
        <span className="amber-rule" />
        <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 500, fontSize: 10, letterSpacing: '0.3em', color: 'var(--amber)', textTransform: 'uppercase', display: 'block', marginBottom: 32, textAlign: 'center' }}>
          OUR STORY
        </span>

        <div ref={quoteRef} style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-vibes)',
            fontSize: 'clamp(120px, 15vw, 200px)',
            color: 'var(--amber)',
            opacity: 0.08,
            lineHeight: 1,
            pointerEvents: 'none',
            userSelect: 'none',
            display: 'block',
          }}>
            &ldquo;
          </span>
          <p
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontWeight: 300,
              fontSize: 'clamp(1.8rem,3.5vw,3.5rem)',
              color: 'var(--cream)',
              lineHeight: 1.4,
              fontStyle: 'italic',
            }}
          >
            {words.map((word, i) => (
              <span
                key={i}
                ref={(el) => { wordRefs.current[i] = el }}
                style={{ display: 'inline-block', marginRight: '0.3em' }}
              >
                {word}
              </span>
            ))}
          </p>
        </div>

        <p
          ref={subRef}
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: 16,
            color: 'rgba(240,228,204,0.7)',
            maxWidth: 560,
            textAlign: 'center',
            marginTop: 32,
            lineHeight: 1.7,
            margin: '32px auto 0',
          }}
        >
          {COPY.manifestoSub}
        </p>

        <span style={{ fontFamily: 'var(--font-vibes)', fontSize: 28, color: 'var(--amber)', opacity: 0.7, display: 'block', marginTop: 24, textAlign: 'center' }}>
          — Southern Edge Fine Spirits
        </span>

        <span style={{ display: 'block', width: 40, height: 1, background: 'var(--amber)', margin: '40px auto 32px', opacity: 0.5 }} />
        <div
          ref={factsRef}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 0,
          }}
        >
          {FACTS.map((fact, i) => (
            <span key={fact} style={{ display: 'contents' }}>
              <span style={{ fontFamily: 'var(--font-dm-sans)', fontWeight: 500, fontSize: 12, letterSpacing: '0.2em', color: 'var(--silver)', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{fact}</span>
              {i < FACTS.length - 1 && (
                <span style={{ color: 'var(--amber)', margin: '0 16px', opacity: 0.6 }}>·</span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
