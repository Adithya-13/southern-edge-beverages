'use client'

import { useState, useEffect } from 'react'
import Preloader from '@/components/Preloader'
import AgeGate from '@/components/AgeGate'
import Hero from '@/components/Hero'
import ScrollRibbon from '@/components/ScrollRibbon'
import StoryCocktailCTA from '@/components/StoryCocktailCTA'
import FindUs from '@/components/FindUs'
import Press from '@/components/Press'
import Community from '@/components/Community'
import Connect from '@/components/Connect'
import Footer from '@/components/Footer'
import { smoothScrollTo } from '@/lib/scroll'

const SHOW_COMMUNITY = false
const SHOW_PRESS = false

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [ageVerified, setAgeVerified] = useState(false)

  // The preloader plays once per browser session; returning to the landing from
  // another route (Find Us / Connect) skips it. Read after mount to avoid a
  // hydration mismatch.
  useEffect(() => {
    if (sessionStorage.getItem('se_preloaded') === '1') setPreloaderDone(true)
    setMounted(true)
  }, [])

  const completePreloader = () => {
    sessionStorage.setItem('se_preloaded', '1')
    setPreloaderDone(true)
  }

  // Arriving from another route as '/#findus' etc — ScrollSmoother swallows native
  // hash scroll, so scroll to the target once the page is live.
  useEffect(() => {
    if (!ageVerified) return
    const hash = window.location.hash
    if (!hash) return
    const t = setTimeout(() => smoothScrollTo(hash), 600)
    return () => clearTimeout(t)
  }, [ageVerified])

  if (!mounted) return null

  return (
    <>
      {!preloaderDone && <Preloader onComplete={completePreloader} />}
      {preloaderDone && !ageVerified && <AgeGate onVerified={() => setAgeVerified(true)} />}
      {ageVerified && (
        <main>
          <Hero isVisible={ageVerified} />
          <ScrollRibbon />
          <StoryCocktailCTA />
          <FindUs />
          {SHOW_PRESS && <Press />}
          {SHOW_COMMUNITY && <Community />}
          <Connect />
          <Footer />
        </main>
      )}
    </>
  )
}
