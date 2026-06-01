'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

export default function ScrollSmootherProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      // Only init ScrollSmoother on desktop
      const mm = gsap.matchMedia()
      mm.add('(min-width: 769px)', () => {
        ScrollSmoother.create({
          wrapper: wrapperRef.current!,
          content: contentRef.current!,
          smooth: 1.2,
          effects: true,
        })
        return () => {
          ScrollSmoother.get()?.kill()
        }
      })
      return () => {
        mm.revert()
      }
    },
    { scope: wrapperRef },
  )

  return (
    <div id="smooth-wrapper" ref={wrapperRef} style={{ overflow: 'hidden' }}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  )
}
