'use client'

import { useState } from 'react'
import Preloader from '@/components/Preloader'
import AgeGate from '@/components/AgeGate'

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false)
  const [ageVerified, setAgeVerified] = useState(false)

  return (
    <>
      {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
      {preloaderDone && !ageVerified && <AgeGate onVerified={() => setAgeVerified(true)} />}
      {ageVerified && (
        <main>
          <div
            style={{
              background: '#080604',
              minHeight: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <p style={{ color: '#F0E4CC', fontFamily: 'sans-serif', fontSize: '14px' }}>
              Sections loading...
            </p>
          </div>
        </main>
      )}
    </>
  )
}
