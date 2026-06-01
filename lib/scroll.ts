import { gsap } from '@/lib/gsap'
import { ScrollSmoother } from 'gsap/ScrollSmoother'

// Smoothly scroll to a section, slower + eased than ScrollSmoother's default snap.
export function smoothScrollTo(href: string) {
  if (!href.startsWith('#')) return
  const target = document.querySelector(href)
  if (!target) return
  const smoother = ScrollSmoother.get()
  if (smoother) {
    const targetY = smoother.offset(target as Element, 'top top+=80')
    const proxy = { y: smoother.scrollTop() }
    gsap.to(proxy, {
      y: targetY,
      duration: 1.4,
      ease: 'power3.inOut',
      onUpdate: () => smoother.scrollTop(proxy.y),
    })
  } else {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
