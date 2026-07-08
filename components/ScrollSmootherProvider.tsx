'use client'

import { useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger, ScrollSmoother } from '@/lib/gsap'

export default function ScrollSmootherProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  // Client-side route changes swap the content under the same persistent smoother,
  // so re-init it per route to recalibrate pins/heights against the new page.
  const pathname = usePathname()

  useGSAP(
    () => {
      if (typeof window !== 'undefined') window.scrollTo(0, 0)
      // Only init ScrollSmoother on desktop; matchMedia cleanup kills the instance on resize
      const mm = gsap.matchMedia()
      mm.add('(min-width: 769px)', () => {
        const smoother = ScrollSmoother.create({
          wrapper: wrapperRef.current!,
          content: contentRef.current!,
          smooth: 0.8,
        })
        smoother.scrollTop(0)
        // Force all registered ScrollTrigger instances to recalibrate
        // against ScrollSmoother's scroll proxy
        ScrollTrigger.refresh()
        return () => {
          ScrollSmoother.get()?.kill()
        }
      })
      return () => {
        mm.revert()
      }
    },
    { scope: wrapperRef, dependencies: [pathname], revertOnUpdate: true },
  )

  return (
    <div id="smooth-wrapper" ref={wrapperRef} style={{ overflow: 'hidden' }}>
      <div id="smooth-content" ref={contentRef}>
        {children}
      </div>
    </div>
  )
}
