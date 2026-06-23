'use client'

import { useEffect, useState } from 'react'
import AgeGate from '@/components/AgeGate'

export default function Gated({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [verified, setVerified] = useState(false)

  useEffect(() => {
    setVerified(document.cookie.includes('age_verified=true'))
    setMounted(true)
  }, [])

  if (!mounted) return null
  if (!verified) return <AgeGate onVerified={() => setVerified(true)} />
  return <>{children}</>
}
