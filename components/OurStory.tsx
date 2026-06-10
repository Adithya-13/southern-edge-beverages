'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import { useGSAP } from '@gsap/react'
import { STORY, VALUES, type StoryBlock, type StoryImageSlot } from '@/lib/constants'

gsap.registerPlugin(ScrollTrigger)

const ASPECT: Record<StoryImageSlot['aspect'], string> = {
  '21:9': '21 / 9',
  '16:9': '16 / 9',
  '4:5': '4 / 5',
}

const slotById = new Map(STORY.images.map((s, i) => [s.id, { slot: s, index: i }]))

function StoryMedia({ slotId, sizes }: { slotId: string; sizes: string }) {
  const entry = slotById.get(slotId)
  if (!entry) return null
  const { slot, index } = entry

  if (slot.placeholder) {
    return (
      <div
        className="story-media story-media--placeholder"
        style={{ aspectRatio: ASPECT[slot.aspect] }}
        role="img"
        aria-label={slot.alt}
      >
        <span className="story-media-label">
          STORY {String(index + 1).padStart(2, '0')} — {slot.id.toUpperCase()} · {slot.aspect}
        </span>
      </div>
    )
  }

  if (slot.videoSrc) {
    return (
      <div className="story-media" style={{ aspectRatio: ASPECT[slot.aspect] }}>
        <video
          src={slot.videoSrc}
          poster={slot.src}
          autoPlay
          muted
          loop
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>
    )
  }

  return (
    <div className="story-media" style={{ aspectRatio: ASPECT[slot.aspect] }}>
      <Image
        src={slot.src}
        alt={slot.alt}
        fill
        sizes={sizes}
        style={{ objectFit: 'cover', objectPosition: slot.objectPosition ?? '50% 50%' }}
      />
    </div>
  )
}

function Caption({ slotId }: { slotId: string }) {
  const caption = slotById.get(slotId)?.slot.caption
  if (!caption) return null
  return <span className="story-caption">{caption}</span>
}

function Paragraph({ text, dropCap }: { text: string; dropCap?: boolean }) {
  if (!dropCap) {
    return (
      <p className="story-paragraph measure" data-reveal>
        {text}
      </p>
    )
  }
  return (
    <p className="story-paragraph measure" data-reveal>
      <span className="story-dropcap" aria-hidden>
        {text.charAt(0)}
      </span>
      <span className="sr-only">{text.charAt(0)}</span>
      {text.slice(1)}
    </p>
  )
}

function PullQuote({ text }: { text: string }) {
  return (
    <blockquote className="story-pullquote" data-reveal-quote>
      <span className="amber-rule-left" />
      <p>
        {text.split(' ').map((word, i) => (
          <span key={i} data-quote-word style={{ display: 'inline-block', marginRight: '0.28em' }}>
            {word}
          </span>
        ))}
      </p>
    </blockquote>
  )
}

function renderBlock(block: StoryBlock, i: number) {
  switch (block.kind) {
    case 'paragraph':
      return (
        <div key={i} className="story-block story-block--text">
          <Paragraph text={block.text} dropCap={block.dropCap} />
        </div>
      )
    case 'pullquote':
      return (
        <div key={i} className="story-block story-block--quote">
          <PullQuote text={block.text} />
        </div>
      )
    case 'image':
      return (
        <figure key={i} className="story-block story-block--full" data-media-full>
          <StoryMedia slotId={block.slotId} sizes="100vw" />
          <Caption slotId={block.slotId} />
        </figure>
      )
    case 'imagePair':
      return (
        <div key={i} className="story-block story-pair" data-reveal>
          {block.slotIds.map((slotId) => (
            <figure key={slotId} className="story-pair-item">
              <StoryMedia slotId={slotId} sizes="(max-width: 768px) 100vw, 50vw" />
              <Caption slotId={slotId} />
            </figure>
          ))}
        </div>
      )
    case 'textWithImage':
      return (
        <div
          key={i}
          className={`story-block story-split story-split--img-${block.imageSide}`}
        >
          <Paragraph text={block.text} />
          <figure className="story-split-media" data-reveal>
            <StoryMedia slotId={block.slotId} sizes="(max-width: 768px) 100vw, 40vw" />
            <Caption slotId={block.slotId} />
          </figure>
        </div>
      )
  }
}

export default function OurStory() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced) return

      const root = sectionRef.current
      if (!root) return

      const fade = (target: Element | Element[] | null, stagger = 0.08) => {
        if (!target || (Array.isArray(target) && !target.length)) return
        gsap.fromTo(
          target,
          { opacity: 0, y: 28 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: Array.isArray(target) ? target[0] : target,
              start: 'top 80%',
            },
          }
        )
      }

      if (headerRef.current) {
        fade(Array.from(headerRef.current.children) as Element[], 0.1)
      }

      root.querySelectorAll('[data-reveal]').forEach((el) => fade(el))

      root.querySelectorAll('[data-media-full]').forEach((el) => {
        const media = el.querySelector('.story-media')
        gsap.fromTo(
          el,
          { opacity: 0, scale: 1.08 },
          {
            opacity: 1,
            scale: 1,
            duration: 1.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 82%' },
          }
        )
        if (media) {
          gsap.fromTo(
            media,
            { y: '-4%' },
            {
              y: '4%',
              ease: 'none',
              scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
            }
          )
        }
      })

      root.querySelectorAll('[data-reveal-quote]').forEach((quote) => {
        const words = Array.from(quote.querySelectorAll('[data-quote-word]'))
        gsap.fromTo(
          words,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.07,
            ease: 'power2.out',
            scrollTrigger: { trigger: quote, start: 'top 78%' },
          }
        )
      })

      if (valuesRef.current) {
        fade(Array.from(valuesRef.current.children) as Element[], 0.12)
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
      <span className="ghost-word" aria-hidden style={{ top: '-2%', left: '-2%' }}>
        STORY
      </span>

      <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
            style={{
              fontFamily: 'var(--font-accent)',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(1.25rem,2vw,1.6rem)',
              lineHeight: 1.4,
              color: 'rgba(240,228,204,0.72)',
              margin: 0,
            }}
          >
            {STORY.deck}
          </p>
        </div>

        <div className="story-flow">{STORY.blocks.map(renderBlock)}</div>

        <span className="story-signoff" data-reveal>
          {STORY.signOff}
        </span>

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
        .story-flow {
          display: flex;
          flex-direction: column;
          gap: clamp(72px, 9vw, 120px);
        }
        .story-paragraph {
          font-family: var(--font-body);
          font-weight: 400;
          font-size: var(--fs-lead);
          line-height: 1.75;
          color: rgba(240,228,204,0.86);
          margin: 0;
        }
        .story-block--text {
          padding-left: var(--accent-indent);
        }
        .story-dropcap {
          float: left;
          font-family: var(--font-display);
          font-size: 4.6em;
          line-height: 0.82;
          color: var(--amber);
          padding: 0.04em 0.12em 0 0;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0,0,0,0);
          white-space: nowrap;
          border: 0;
        }
        .story-block--full {
          margin: 0 calc(-1 * clamp(20px, 5vw, 60px));
          position: relative;
          overflow: hidden;
        }
        .story-media {
          position: relative;
          width: 100%;
          overflow: hidden;
        }
        .story-block--full .story-media {
          border-radius: 0;
        }
        .story-split-media .story-media,
        .story-pair-item .story-media {
          border-radius: 12px;
          border: 1px solid var(--smoke);
          box-shadow: 0 30px 80px rgba(0,0,0,0.55);
        }
        .story-media--placeholder {
          background:
            radial-gradient(120% 120% at 30% 20%, var(--bg-surface) 0%, var(--bg-deep) 70%);
          border: 1px solid var(--smoke);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .story-media-label {
          font-family: var(--font-body);
          font-weight: 500;
          font-size: 10px;
          letter-spacing: var(--track-eyebrow);
          text-transform: uppercase;
          color: rgba(240,228,204,0.4);
        }
        .story-caption {
          display: block;
          margin-top: 14px;
          font-family: var(--font-accent);
          font-style: italic;
          font-size: 15px;
          color: rgba(240,228,204,0.55);
        }
        .story-block--full .story-caption {
          padding-left: clamp(20px, 5vw, 60px);
        }
        .story-split {
          display: grid;
          grid-template-columns: 55fr 40fr;
          gap: clamp(36px, 5vw, 72px);
          align-items: start;
        }
        .story-split--img-left {
          grid-template-columns: 40fr 55fr;
        }
        .story-split--img-left .story-paragraph {
          order: 2;
        }
        .story-split--img-left .story-split-media {
          order: 1;
        }
        .story-split-media {
          margin: clamp(24px, 4vw, 64px) 0 0;
        }
        .story-pair {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(28px, 4vw, 56px);
        }
        .story-pair-item {
          margin: 0;
        }
        .story-pair-item:nth-child(2) {
          margin-top: clamp(24px, 4vw, 64px);
        }
        .story-pullquote {
          margin: 0;
          padding-left: var(--accent-indent);
          max-width: 880px;
        }
        .story-pullquote p {
          font-family: var(--font-accent);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(1.8rem, 3.2vw, 2.8rem);
          line-height: 1.25;
          color: var(--cream);
          margin: 18px 0 0;
        }
        .story-signoff {
          display: block;
          margin-top: clamp(40px, 5vw, 64px);
          padding-left: var(--accent-indent);
          font-family: var(--font-accent);
          font-style: italic;
          font-size: clamp(1.4rem, 2.4vw, 1.9rem);
          color: var(--amber);
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
          .story-block--text,
          .story-pullquote,
          .story-signoff {
            padding-left: 0;
          }
          .story-split,
          .story-split--img-left {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .story-split--img-left .story-paragraph {
            order: 1;
          }
          .story-split--img-left .story-split-media {
            order: 2;
          }
          .story-split-media {
            margin-top: 0;
          }
          .story-pair {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .story-pair-item:nth-child(2) {
            margin-top: 0;
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
