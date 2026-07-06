import type { Metadata } from 'next'
import {
  Libre_Caslon_Display,
  Libre_Caslon_Text,
  Hanken_Grotesk,
} from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import ScrollSmootherProvider from '@/components/ScrollSmootherProvider'
import Navbar from '@/components/Navbar'

// Display — classical wide Caslon revival. Roman-only on Google Fonts (no italic),
// so italic accents come from Libre Caslon Text below.
const caslonDisplay = Libre_Caslon_Display({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

// Accent — Caslon text cut, carries the italic register (replaces the old script slot).
const caslonText = Libre_Caslon_Text({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-accent',
  display: 'swap',
})

// Body / UI — warm humanist grotesque. Also used (wide-tracked) for the brand
// wordmark, which is a thin geometric sans in the real identity.
const hankenGrotesk = Hanken_Grotesk({
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Southern Edge Fine Spirits',
  description:
    'Crafted with southern charm and a dedication to extraordinary taste, experience the finest flavored spirits from South Carolina.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${caslonDisplay.variable} ${caslonText.variable} ${hankenGrotesk.variable}`}
    >
      <body>
        {/*
          Navbar renders OUTSIDE #smooth-content so position:fixed works correctly.
          ScrollSmoother applies transform:translateY to #smooth-content — any fixed
          element inside a transformed ancestor loses fixed behaviour and scrolls with content.
        */}
        <Navbar />
        <ScrollSmootherProvider>{children}</ScrollSmootherProvider>
        <Analytics />
      </body>
    </html>
  )
}
