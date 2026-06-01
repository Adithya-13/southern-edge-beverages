'use client'

import { useState } from 'react'
import Preloader from '@/components/Preloader'
import AgeGate from '@/components/AgeGate'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Manifesto from '@/components/Manifesto'
import Products from '@/components/Products'
import Recipes from '@/components/Recipes'
import Community from '@/components/Community'
import Events from '@/components/Events'
import Footer from '@/components/Footer'

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [ageVerified, setAgeVerified] = useState(false)

  return (
    <>
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
      {preloaderDone && !ageVerified && <AgeGate onVerified={() => setAgeVerified(true)} />}
      {ageVerified && (
        <main>
          <Navbar />
          <Hero isVisible={ageVerified} />
          <Manifesto />
          <Products />
          <Recipes />
          <Community />
          <Events />
          <Footer />
        </main>
      )}
    </>
  )
}
