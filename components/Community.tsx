'use client'

import { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

// 9 posts curated from assets.md — one image per post, links to original
const POSTS = [
  { file: 'southernedgebeverages/C81tWTXAudB_1.jpg', url: 'https://www.instagram.com/p/C81tWTXAudB/', handle: '@southernedgebeverages' },
  { file: 'southernedgebeverages/C8TVtdfg2ng_1.jpg', url: 'https://www.instagram.com/p/C8TVtdfg2ng/', handle: '@southernedgebeverages' },
  { file: 'liquiddisga/DTAhwowAFU9_1.jpg', url: 'https://www.instagram.com/p/DTAhwowAFU9/', handle: '@liquiddisga' },
  { file: 'southernedgebeverages/C7soFQwglTb_1.jpg', url: 'https://www.instagram.com/p/C7soFQwglTb/', handle: '@southernedgebeverages' },
  { file: 'suepremetravels/DQ7ycQcD-yo_1.jpg', url: 'https://www.instagram.com/p/DQ7ycQcD-yo/', handle: '@suepremetravels' },
  { file: 'vueatlanta/DP4Bz4djc3a_1.jpg', url: 'https://www.instagram.com/p/DP4Bz4djc3a/', handle: '@vueatlanta' },
  { file: 'southernedgebeverages/C0nAU1ePf6a_1.jpg', url: 'https://www.instagram.com/p/C0nAU1ePf6a/', handle: '@southernedgebeverages' },
  { file: 'chubblive/DP2xyAZDcyi_1.jpg', url: 'https://www.instagram.com/p/DP2xyAZDcyi/', handle: '@chubblive' },
  { file: 'southernedgebeverages/Cyy2zlKCEq7_1.jpg', url: 'https://www.instagram.com/p/Cyy2zlKCEq7/', handle: '@southernedgebeverages' },
]

// Varied heights for Instagram masonry feel
const HEIGHTS = [300, 220, 280, 260, 300, 200, 240, 280, 260]

// col 0: 0,3,6 | col 1: 1,4,7 | col 2: 2,5,8
const COLUMNS = [
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
]

export default function Community() {
  const sectionRef = useRef<HTMLElement>(null)
  const col0Ref = useRef<HTMLDivElement>(null)
  const col1Ref = useRef<HTMLDivElement>(null)
  const col2Ref = useRef<HTMLDivElement>(null)
  const colRefs = [col0Ref, col1Ref, col2Ref]

  useGSAP(
    () => {
      colRefs.forEach((colRef, i) => {
        if (!colRef.current) return
        const isOdd = i === 1
        gsap.fromTo(
          colRef.current,
          { x: isOdd ? 60 : -60, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              once: true,
            },
          }
        )
      })
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="community"
      ref={sectionRef}
      style={{
        background: 'var(--bg-void)',
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
          THE COMMUNITY
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: 'clamp(2.5rem,5vw,5rem)',
            color: 'var(--cream)',
          }}
        >
          Taste The Edge.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 300,
            fontSize: 16,
            color: 'rgba(240,228,204,0.6)',
            maxWidth: 480,
            margin: '16px auto 0',
          }}
        >
          Join us at tastings, events, and everywhere Southern Edge pours.
        </p>
        <a
          href="https://www.instagram.com/southernedgebeverages/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-dm-sans)',
            fontWeight: 500,
            fontSize: 14,
            color: 'var(--amber)',
            marginTop: 16,
            display: 'inline-block',
            textDecoration: 'none',
          }}
        >
          @southernedgebeverages ↗
        </a>
      </div>

      {/* Masonry Grid */}
      <div className="community-grid" style={{ maxWidth: 1200, margin: '0 auto' }}>
        {COLUMNS.map((itemIndices, colIdx) => (
          <div key={colIdx} ref={colRefs[colIdx]} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {itemIndices.map((itemIdx) => {
              const post = POSTS[itemIdx]
              return (
                <a
                  key={itemIdx}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="community-card"
                  style={{
                    height: HEIGHTS[itemIdx],
                    borderRadius: 6,
                    overflow: 'hidden',
                    position: 'relative',
                    display: 'block',
                    flexShrink: 0,
                  }}
                >
                  <Image
                    src={`/images/instagram/${post.file}`}
                    alt={`${post.handle} on Instagram`}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  {/* Hover overlay */}
                  <div className="community-overlay">
                    <span style={{
                      fontFamily: 'var(--font-dm-sans)',
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--cream)',
                      letterSpacing: '0.05em',
                    }}>
                      {post.handle} ↗
                    </span>
                  </div>
                </a>
              )
            })}
          </div>
        ))}
      </div>

      <style>{`
        .community-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }
        @media (max-width: 1199px) and (min-width: 768px) {
          .community-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 767px) {
          .community-grid {
            grid-template-columns: 1fr;
          }
        }
        .community-card .community-overlay {
          position: absolute;
          inset: 0;
          background: rgba(8,6,4,0.55);
          display: flex;
          align-items: flex-end;
          padding: 14px;
          opacity: 0;
          transition: opacity 0.25s ease;
        }
        .community-card:hover .community-overlay {
          opacity: 1;
        }
      `}</style>
    </section>
  )
}
