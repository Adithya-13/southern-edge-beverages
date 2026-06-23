'use client'

import Gated from '@/components/Gated'
import Cocktails from '@/components/Cocktails'
import Footer from '@/components/Footer'

export default function CocktailsPage() {
  return (
    <Gated>
      <main style={{ paddingTop: 'clamp(64px, 9vh, 88px)' }}>
        <Cocktails />
        <Footer />
      </main>
    </Gated>
  )
}
