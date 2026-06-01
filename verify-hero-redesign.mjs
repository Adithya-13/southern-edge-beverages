import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })

// ── Desktop 1440px verification ──────────────────────────────────────────────
const page = await browser.newPage()
await page.setViewportSize({ width: 1440, height: 900 })

// Load page first to establish origin context
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 })

// Set both bypass mechanisms
await page.evaluate(() => {
  sessionStorage.setItem('preloaderShown', 'true')
  document.cookie = 'age_verified=true; path=/'
})

// Reload with bypasses active
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(2500)

// Confirm hero is visible
const heroVisible = await page.evaluate(() => {
  const hero = document.getElementById('hero')
  return {
    exists: !!hero,
    height: hero?.offsetHeight,
    bg: hero ? getComputedStyle(hero).background : null,
  }
})
console.log('[desktop] Hero state at load:', JSON.stringify(heroVisible))

// PHASE 1 — scroll=0: pure black, frame_001 visible, scroll prompt visible, no bottle/text
await page.screenshot({ path: '/tmp/hero_desktop_0pct.png', fullPage: false })
console.log('[desktop] Phase 1 screenshot saved')

const p1 = await page.evaluate(() => {
  const hero = document.getElementById('hero')
  if (!hero) return { error: 'no hero' }
  const imgs = [...hero.querySelectorAll('img')]
  const video = hero.querySelector('video')
  return {
    frameImg: imgs[0]?.src?.split('/').pop(),
    frameOpacity: imgs[0] ? getComputedStyle(imgs[0]).opacity : null,
    videoOpacity: video?.style.opacity,
    bottleImg: imgs[1]?.src?.split('/').pop(),
    bottleOpacity: imgs[1]?.parentElement?.style.opacity,
  }
})
console.log('[desktop] Phase 1 DOM state:', JSON.stringify(p1))

// PHASE 2 — scroll to 1500px (50% pin): mid-reveal frame, no text visible
await page.evaluate(() => window.scrollTo(0, 1500))
await page.waitForTimeout(2500)
await page.screenshot({ path: '/tmp/hero_desktop_50pct.png', fullPage: false })
console.log('[desktop] Phase 2 screenshot saved (scroll=1500)')

const p2 = await page.evaluate(() => {
  const hero = document.getElementById('hero')
  if (!hero) return { error: 'no hero' }
  const imgs = [...hero.querySelectorAll('img')]
  return {
    frameImg: imgs[0]?.src?.split('/').pop(),
    bottleOpacity: imgs[1]?.parentElement?.style.opacity,
    scrollY: window.scrollY,
  }
})
console.log('[desktop] Phase 2 DOM state:', JSON.stringify(p2))

// PHASE 3 — scroll to 2850px (95% pin): video, bottle, text faded in
await page.evaluate(() => window.scrollTo(0, 2850))
await page.waitForTimeout(2500)
await page.screenshot({ path: '/tmp/hero_desktop_95pct.png', fullPage: false })
console.log('[desktop] Phase 3 screenshot saved (scroll=2850)')

const p3 = await page.evaluate(() => {
  const hero = document.getElementById('hero')
  if (!hero) return { error: 'no hero' }
  const imgs = [...hero.querySelectorAll('img')]
  const video = hero.querySelector('video')
  return {
    frameImg: imgs[0]?.src?.split('/').pop(),
    videoOpacity: video?.style.opacity,
    bottleOpacity: imgs[1]?.parentElement?.style.opacity,
    scrollY: window.scrollY,
  }
})
console.log('[desktop] Phase 3 DOM state:', JSON.stringify(p3))
await page.close()

// ── Mobile 375px verification ─────────────────────────────────────────────────
const mobile = await browser.newPage()
await mobile.setViewportSize({ width: 375, height: 812 })

await mobile.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 })
await mobile.evaluate(() => {
  sessionStorage.setItem('preloaderShown', 'true')
  document.cookie = 'age_verified=true; path=/'
})
await mobile.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 })
await mobile.waitForTimeout(2000)

await mobile.screenshot({ path: '/tmp/hero_mobile_375.png', fullPage: false })
console.log('[mobile] 375px screenshot saved')

const mobileState = await mobile.evaluate(() => {
  const hero = document.getElementById('hero')
  const imgs = hero ? [...hero.querySelectorAll('img')] : []
  return {
    heroHeight: hero?.offsetHeight,
    frameImg: imgs[0]?.src?.split('/').pop(),
    frameOpacity: imgs[0] ? getComputedStyle(imgs[0]).opacity : null,
    bottleOpacity: imgs[1]?.parentElement?.style.opacity,
    hasHorizontalOverflow: document.body.scrollWidth > window.innerWidth,
    bodyWidth: document.body.scrollWidth,
    windowWidth: window.innerWidth,
  }
})
console.log('[mobile] state:', JSON.stringify(mobileState))

await mobile.close()
await browser.close()
console.log('\nAll screenshots saved to /tmp/')
