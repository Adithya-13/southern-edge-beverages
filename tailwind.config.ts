import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-void': '#080604',
        'bg-deep': '#100D09',
        'bg-surface': '#1A1510',
        amber: '#D4781A',
        coral: '#C23B22',
        'lime-brand': '#7CB342',
        gold: '#F0C040',
        cream: '#F0E4CC',
        silver: '#C8C8C8',
      },
      fontFamily: {
        bebas: ['var(--font-bebas)', 'sans-serif'],
        cormorant: ['var(--font-cormorant)', 'serif'],
        vibes: ['var(--font-vibes)', 'cursive'],
        sans: ['var(--font-dm-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
