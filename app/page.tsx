'use client'

import { useState } from 'react'
import Preloader from '@/components/Preloader'
import AgeGate from '@/components/AgeGate'
import Hero from '@/components/Hero'
import BottleReveal from '@/components/BottleReveal'
import Products from '@/components/Products'
import ScrollRibbon from '@/components/ScrollRibbon'
import OurStory from '@/components/OurStory'
import ThePour from '@/components/ThePour'
import Cocktails from '@/components/Cocktails'
import FindUs from '@/components/FindUs'
import Press from '@/components/Press'
import Community from '@/components/Community'
import Connect from '@/components/Connect'
import Events from '@/components/Events'
import Footer from '@/components/Footer'

const SHOW_COMMUNITY = false
const SHOW_PRESS = false

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [ageVerified, setAgeVerified] = useState(false)

  return (
    <>
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
      {preloaderDone && !ageVerified && <AgeGate onVerified={() => setAgeVerified(true)} />}
      {ageVerified && (
        <main>
          <Hero isVisible={ageVerified} />
          <BottleReveal />
          <Products />
          <ScrollRibbon />
          <OurStory />
          <ThePour />
          <Cocktails />
          <FindUs />
          {SHOW_PRESS && <Press />}
          {SHOW_COMMUNITY && <Community />}
          <Connect />
          <Events />
          <Footer />
        </main>
      )}
    </>
  )
}
