'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { PRESS_ARTICLES } from '@/lib/constants'

export default function Press() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      const cards = gsap.utils.toArray<HTMLElement>('.press-card')
      gsap.fromTo(
        cards,
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="press"
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
        <div style={{ textAlign: 'center', marginBottom: 'clamp(48px,6vw,72px)' }}>
          <span className="amber-rule" />
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: 'var(--amber)',
              margin: 0,
            }}
          >
            Press
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-bebas)',
              fontWeight: 400,
              fontSize: 'clamp(3rem,6vw,5.5rem)',
              lineHeight: 0.95,
              letterSpacing: '0.01em',
              color: 'var(--cream)',
              margin: '14px 0 0',
            }}
          >
            Press Center
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-dm-sans)',
              fontWeight: 300,
              fontSize: 'clamp(15px,1.4vw,17px)',
              lineHeight: 1.6,
              color: 'rgba(240,228,204,0.62)',
              maxWidth: 560,
              margin: '18px auto 0',
            }}
          >
            Latest news, press releases, and media resources for SE Beverages.
          </p>
        </div>

        {/* Featured Articles subheading */}
        <h3
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: 'clamp(1.5rem,2.6vw,2rem)',
            color: 'var(--cream)',
            textAlign: 'center',
            margin: '0 0 clamp(32px,4vw,48px)',
          }}
        >
          Featured Articles
        </h3>

        {/* Cards grid */}
        <div className="press-grid">
          {PRESS_ARTICLES.map((article) => (
            <a
              key={article.url}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="press-card"
              aria-label={`Read "${article.title}" on ${article.pub}`}
            >
              {/* Logo chip */}
              <div
                style={{
                  background: 'var(--cream)',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 76,
                }}
              >
                <Image
                  src={article.logo}
                  alt={`${article.pub} logo`}
                  width={160}
                  height={36}
                  style={{
                    height: 36,
                    width: 'auto',
                    maxWidth: '100%',
                    objectFit: 'contain',
                  }}
                />
              </div>

              {/* Article photo */}
              <div style={{ position: 'relative', width: '100%', height: 170, overflow: 'hidden' }}>
                <Image
                  src={article.photo}
                  alt={article.title}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 380px"
                  className="press-photo"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Body */}
              <div
                style={{
                  padding: '24px 24px 26px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  flex: 1,
                }}
              >
                <p
                  className="press-title"
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontWeight: 500,
                    fontSize: '1.05rem',
                    lineHeight: 1.4,
                    color: 'var(--cream)',
                    margin: 0,
                  }}
                >
                  {article.title}
                </p>
                <span
                  style={{
                    fontFamily: 'var(--font-dm-sans)',
                    fontWeight: 500,
                    fontSize: 13,
                    letterSpacing: '0.04em',
                    color: 'var(--amber)',
                    marginTop: 'auto',
                  }}
                >
                  Read More →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      <style>{`
        .press-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(20px, 2.2vw, 32px);
          align-items: stretch;
        }
        @media (max-width: 1023px) and (min-width: 768px) {
          .press-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 767px) {
          .press-grid {
            grid-template-columns: 1fr;
            max-width: 420px;
            margin: 0 auto;
          }
        }
        .press-card {
          display: flex;
          flex-direction: column;
          background: var(--bg-surface);
          border: 1px solid var(--smoke);
          border-radius: 12px;
          overflow: hidden;
          text-decoration: none;
          transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
          will-change: transform;
        }
        .press-card:hover {
          transform: translateY(-6px);
          border-color: rgba(212,120,26,0.55);
          box-shadow: 0 18px 40px rgba(8,6,4,0.55), 0 0 0 1px rgba(212,120,26,0.25);
        }
        .press-photo {
          transition: transform 0.6s ease;
        }
        .press-card:hover .press-photo {
          transform: scale(1.05);
        }
        .press-title {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .press-card:hover .press-title {
          color: #fff;
        }
      `}</style>
    </section>
  )
}
