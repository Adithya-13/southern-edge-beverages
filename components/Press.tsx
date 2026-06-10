'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { PRESS_ARTICLES } from '@/lib/constants'

const SHOW_FEATURED_ARTICLES = false

export default function Press() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced || !SHOW_FEATURED_ARTICLES) return

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
        padding: 'clamp(84px,8vw,116px) clamp(20px,5vw,60px)',
      }}
    >
      {/* Ghosted oversized wordmark behind the header (type-as-texture) */}
      <span className="ghost-word" aria-hidden style={{ top: '-2%', left: '-2%' }}>
        PRESS
      </span>

      <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div
          style={{
            textAlign: 'left',
            maxWidth: 720,
            marginBottom: SHOW_FEATURED_ARTICLES ? 'clamp(48px,6vw,72px)' : 0,
          }}
        >
          <p className="eyebrow" style={{ margin: 0 }}>
            Press
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 400,
              fontSize: 'var(--fs-h1)',
              lineHeight: 'var(--lh-h1)',
              letterSpacing: '-0.01em',
              color: 'var(--cream)',
              margin: '22px 0 0',
            }}
          >
            Press Center
          </h2>
          <p
            className="measure"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: 400,
              fontSize: 'var(--fs-lead)',
              lineHeight: 1.6,
              color: 'rgba(240,228,204,0.72)',
              margin: '18px 0 0',
            }}
          >
            Latest news, press releases, and media resources for SE Beverages.
          </p>
        </div>

        {SHOW_FEATURED_ARTICLES && (
          <>
        {/* Featured Articles subheading */}
        <h3
          style={{
            fontFamily: 'var(--font-accent)',
            fontWeight: 400,
            fontStyle: 'italic',
            fontSize: 'var(--fs-h3)',
            color: 'var(--cream)',
            textAlign: 'left',
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
                    fontFamily: 'var(--font-accent)',
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
                    fontFamily: 'var(--font-body)',
                    fontWeight: 500,
                    fontSize: 13,
                    letterSpacing: 'var(--track-data)',
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
          </>
        )}
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
