'use client'

import { useEffect } from 'react'

interface AgeGateProps {
  onVerified?: () => void
}

// Shell — Phase 2 will implement full age gate UI + cookie flow
export default function AgeGate({ onVerified }: AgeGateProps) {
  useEffect(() => {
    onVerified?.()
  }, [onVerified])

  return null
}
