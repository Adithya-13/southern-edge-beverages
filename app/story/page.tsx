'use client'

import Gated from '@/components/Gated'
import OurStory from '@/components/OurStory'
import Footer from '@/components/Footer'

export default function StoryPage() {
  return (
    <Gated>
      <main style={{ paddingTop: 'clamp(64px, 9vh, 88px)' }}>
        <OurStory />
        <Footer />
      </main>
    </Gated>
  )
}
