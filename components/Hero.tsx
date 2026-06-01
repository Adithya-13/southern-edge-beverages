'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

interface HeroProps {
  isVisible: boolean
}

export default function Hero({ isVisible }: HeroProps) {
  const containerRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const smokeRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLImageElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const bottleRef = useRef<HTMLDivElement>(null)
  const textCenterRef = useRef<HTMLDivElement>(null)
  const smoothTagRef = useRef<HTMLSpanElement>(null)
  const scrollArrowRef = useRef<HTMLDivElement>(null)

  const WORK_HARD = 'WORK HARD'

  // Progressive frame preload
  useEffect(() => {
    // Preload first 10 immediately
    for (let i = 1; i <= 10; i++) {
      const img = new window.Image()
      img.src = `/images/frames/frame_${String(i).padStart(3, '0')}.webp`
    }
    // Progressive load: chunks of 10 with increasing delay
    for (let chunk = 1; chunk <= 11; chunk++) {
      const start = chunk * 10 + 1
      const end = Math.min(start + 9, 120)
      setTimeout(
        () => {
          for (let i = start; i <= end; i++) {
            const img = new window.Image()
            img.src = `/images/frames/frame_${String(i).padStart(3, '0')}.webp`
          }
        },
        chunk * 200,
      )
    }
  }, [])

  // Entrance timeline — fires when isVisible becomes true
  useGSAP(
    () => {
      if (!isVisible) return

      const tl = gsap.timeline()

      // L1 video fade in
      tl.to(videoRef.current, { opacity: 0.8, duration: 1.5, ease: 'power2.out' })

      // L5 bottle scale up + fade in
      tl.to(
        bottleRef.current,
        { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' },
        0.4,
      )

      // L4 glow pulse
      tl.to(glowRef.current, { opacity: 0.25, duration: 1 }, 0.8)

      // "WORK HARD" char-by-char drop from top
      const charSpans = containerRef.current?.querySelectorAll<HTMLElement>('[data-char]')
      if (charSpans) {
        charSpans.forEach((el, i) => {
          tl.fromTo(
            el,
            { opacity: 0, y: -40 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' },
            1.0 + i * 0.04,
          )
        })
      }

      // "Drink Smooth." fade in
      tl.fromTo(
        smoothTagRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
        1.4,
      )

      // Scroll arrow infinite bob
      gsap.to(scrollArrowRef.current, {
        y: 8,
        duration: 1.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.8,
      })

      // Frame sequencer ScrollTrigger (desktop only)
      const mmFrames = gsap.matchMedia()
      mmFrames.add('(min-width: 769px)', () => {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          onUpdate: (self) => {
            if (!frameRef.current) return
            const idx = Math.round(self.progress * 119)
            frameRef.current.src = `/images/frames/frame_${String(idx + 1).padStart(3, '0')}.webp`
          },
        })
        return () => {}
      })

      // Scroll out: bottle drifts up, text fades
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '20% top',
        scrub: 1,
        animation: gsap.timeline()
          .to(bottleRef.current, { y: -60, ease: 'none' }, 0)
          .to(textCenterRef.current, { opacity: 0, ease: 'none' }, 0),
      })

      // Mouse parallax — desktop only
      const mmMouse = gsap.matchMedia()
      mmMouse.add('(min-width: 769px)', () => {
        function onMouseMove(e: MouseEvent) {
          const x = (e.clientX / window.innerWidth - 0.5) * 2
          const y = (e.clientY / window.innerHeight - 0.5) * 2
          gsap.to(bottleRef.current, { x: x * 15, y: y * 15, duration: 0.8 })
          gsap.to(smokeRef.current, { x: -x * 20, y: -y * 20, duration: 0.8 })
          gsap.to(videoRef.current, { x: x * 5, y: y * 5, duration: 0.8 })
        }
        window.addEventListener('mousemove', onMouseMove)
        return () => {
          window.removeEventListener('mousemove', onMouseMove)
        }
      })
    },
    { scope: containerRef, dependencies: [isVisible] },
  )

  return (
    <section
      id="hero"
      ref={containerRef}
      style={{
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-void)',
      }}
    >
      {/* L1 — Video background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0,
          zIndex: 0,
        }}
        className="hero-video-desktop"
      >
        <source src="/videos/hero_atmosphere.mp4" type="video/mp4" />
      </video>

      {/* L1 mobile fallback gradient — hidden on desktop */}
      <div
        className="hero-mobile-fallback"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, var(--bg-deep) 0%, var(--bg-void) 100%)',
          zIndex: 0,
        }}
      />

      {/* L2 — Smoke overlay */}
      <div
        ref={smokeRef}
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(212,120,26,0.08) 0%, transparent 60%)',
          mixBlendMode: 'screen',
          zIndex: 1,
          animation: 'smokeDrift 8s ease-in-out alternate infinite',
        }}
      />

      {/* L3 — Frame sequencer (desktop only) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={frameRef}
        src="/images/frames/frame_001.webp"
        alt=""
        className="hero-frame-desktop"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          mixBlendMode: 'screen',
          opacity: 0.7,
          zIndex: 2,
        }}
      />

      {/* L4 — Amber glow */}
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,120,26,0.4) 0%, transparent 70%)',
          left: '50%',
          top: '55%',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />

      {/* L5 — Bottle */}
      <div
        ref={bottleRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%) scale(0.85)',
          opacity: 0,
          zIndex: 4,
          pointerEvents: 'none',
        }}
      >
        <Image
          src="/images/bottle_caramel.png"
          alt="Southern Edge Salted Caramel Whiskey"
          priority
          width={400}
          height={600}
          style={{
            height: '70vh',
            width: 'auto',
            objectFit: 'contain',
            maxWidth: '400px',
          }}
        />
      </div>

      {/* L6 — Text layer */}

      {/* Top-left brand label */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 'clamp(16px, 2.8vw, 40px)',
          fontFamily: 'var(--font-dm-sans)',
          fontSize: 11,
          letterSpacing: '0.25em',
          color: 'var(--silver)',
          textTransform: 'uppercase',
          zIndex: 5,
        }}
      >
        Southern Edge Fine Spirits
      </div>

      {/* Center headline */}
      <div
        ref={textCenterRef}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 5,
          width: '100%',
        }}
      >
        {/* "WORK HARD" — split into individual char spans */}
        <span
          style={{
            fontFamily: 'var(--font-bebas)',
            fontSize: 'clamp(80px, 12vw, 180px)',
            color: 'var(--cream)',
            lineHeight: 0.9,
            display: 'block',
            letterSpacing: '0.05em',
          }}
        >
          {WORK_HARD.split('').map((char, i) => (
            <span
              key={i}
              data-char
              style={{
                display: 'inline-block',
                opacity: 0,
                // preserve space
                whiteSpace: char === ' ' ? 'pre' : 'normal',
              }}
            >
              {char}
            </span>
          ))}
        </span>

        {/* "Drink Smooth." */}
        <span
          ref={smoothTagRef}
          style={{
            fontFamily: 'var(--font-vibes)',
            fontSize: 'clamp(40px, 6vw, 90px)',
            color: 'var(--gold)',
            display: 'block',
            marginTop: -8,
            opacity: 0,
          }}
        >
          Drink Smooth.
        </span>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollArrowRef}
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'var(--font-dm-sans)',
          fontSize: 12,
          color: 'rgba(200,200,200,0.5)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          zIndex: 5,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <span style={{ display: 'block', marginBottom: 6 }}>Scroll to explore</span>
        <span style={{ display: 'block', fontSize: 16 }}>↓</span>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 767px) {
          .hero-video-desktop { display: none !important; }
          .hero-frame-desktop { display: none !important; }
          .hero-mobile-fallback { display: block !important; }
        }
        @media (min-width: 768px) {
          .hero-mobile-fallback { display: none !important; }
        }
      `}</style>
    </section>
  )
}
