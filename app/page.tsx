'use client'

import { useState } from 'react'
import Preloader from '@/components/Preloader'
import AgeGate from '@/components/AgeGate'
import Hero from '@/components/Hero'
import Manifesto from '@/components/Manifesto'
import Products from '@/components/Products'

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
          <Manifesto />
          <Products />
        </main>
      )}
    </>
  )
}
