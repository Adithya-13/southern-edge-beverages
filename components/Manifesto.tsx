'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

const QUOTE = '"The Legacy of Southern Edge Spirits is like a sip of the South, embodying its rich history, warm hospitality and vibrant culture."'

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const subRef = useRef<HTMLParagraphElement>(null)
  const factsRef = useRef<HTMLParagraphElement>(null)

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
      {/* Background watermark */}
      <div className="watermark-spin" style={{ zIndex: 0 }}>
        <Image
          src="/images/logo_lockup.png"
          alt=""
          width={600}
          height={600}
          style={{ width: 600, height: 'auto' }}
          priority={false}
        />
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: 960,
        }}
      >
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
          We invite you to experience the essence of the South in every drop of Southern Edge.
        </p>

        <p
          ref={factsRef}
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: '0.2em',
            color: 'var(--silver)',
            marginTop: 48,
            textTransform: 'uppercase',
          }}
        >
          6&times; DISTILLED &nbsp;&middot;&nbsp; 60 PROOF &nbsp;&middot;&nbsp; NATURAL INGREDIENTS &nbsp;&middot;&nbsp; GLUTEN FREE
        </p>
      </div>
    </section>
  )
}
