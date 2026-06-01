import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })

// ── Desktop 1440px verification ──────────────────────────────────────────────
const page = await browser.newPage()
await page.setViewportSize({ width: 1440, height: 900 })

// Set age-gate cookie then load
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 })
await page.context().addCookies([{ name: 'age_verified', value: 'true', domain: 'localhost', path: '/' }])
await page.evaluate(() => { sessionStorage.setItem('preloaderShown', 'true') })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(2000)

// PHASE 1 — scroll=0: should be pure black + frame_001, no text, no video, scroll prompt visible
await page.screenshot({ path: '/tmp/hero_desktop_0pct.png', fullPage: false })
console.log('[desktop] Phase 1 (scroll=0) screenshot saved')

const phase1State = await page.evaluate(() => {
  const frame = document.querySelector('#hero img')
  const video = document.querySelector('#hero video')
  const bottleWrap = document.querySelector('#hero img[alt*="Southern"]')?.parentElement
  return {
    frameSrc: frame?.src?.split('/').pop(),
    videoOpacity: video ? getComputedStyle(video).opacity : null,
    bottleOpacity: bottleWrap ? bottleWrap.style.opacity || getComputedStyle(bottleWrap).opacity : null,
  }
})
console.log('[desktop] Phase 1 state:', JSON.stringify(phase1State))

// PHASE 2 — scroll to 1500px (50% of pin): mid-reveal frames, no text
await page.evaluate(() => window.scrollTo(0, 1500))
await page.waitForTimeout(2500) // wait for scrub + ScrollSmoother settle
await page.screenshot({ path: '/tmp/hero_desktop_50pct.png', fullPage: false })
console.log('[desktop] Phase 2 (scroll=1500) screenshot saved')

const phase2State = await page.evaluate(() => {
  const frame = document.querySelector('#hero img')
  const bottleWrap = document.querySelector('#hero img[alt*="Southern"]')?.parentElement
  const textOverlay = document.querySelector('#hero div[style*="zIndex: 4"]')
  return {
    frameSrc: frame?.src?.split('/').pop(),
    bottleOpacity: bottleWrap?.style.opacity,
    textOpacity: textOverlay?.style.opacity,
    scrollY: window.scrollY,
  }
})
console.log('[desktop] Phase 2 state:', JSON.stringify(phase2State))

// PHASE 3 — scroll to 2850px (95% of pin): video, bottle, text should appear
await page.evaluate(() => window.scrollTo(0, 2850))
await page.waitForTimeout(2500)
await page.screenshot({ path: '/tmp/hero_desktop_95pct.png', fullPage: false })
console.log('[desktop] Phase 3 (scroll=2850) screenshot saved')

const phase3State = await page.evaluate(() => {
  const video = document.querySelector('#hero video')
  const bottleWrap = document.querySelector('#hero img[alt*="Southern"]')?.parentElement
  const frame = document.querySelector('#hero img')
  return {
    frameSrc: frame?.src?.split('/').pop(),
    videoOpacity: video?.style.opacity,
    bottleOpacity: bottleWrap?.style.opacity,
    scrollY: window.scrollY,
  }
})
console.log('[desktop] Phase 3 state:', JSON.stringify(phase3State))

await page.close()

// ── Mobile 375px verification ─────────────────────────────────────────────────
const mobile = await browser.newPage()
await mobile.setViewportSize({ width: 375, height: 812 })

await mobile.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 })
await mobile.context().addCookies([{ name: 'age_verified', value: 'true', domain: 'localhost', path: '/' }])
await mobile.evaluate(() => { sessionStorage.setItem('preloaderShown', 'true') })
await mobile.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 })
await mobile.waitForTimeout(2000)

await mobile.screenshot({ path: '/tmp/hero_mobile_375.png', fullPage: false })
console.log('[mobile] 375px screenshot saved')

const mobileState = await mobile.evaluate(() => {
  const hero = document.getElementById('hero')
  const frame = document.querySelector('#hero img')
  const bottleWrap = document.querySelector('#hero img[alt*="Southern"]')?.parentElement
  return {
    heroHeight: hero?.offsetHeight,
    heroOverflow: hero ? getComputedStyle(hero).overflow : null,
    frameSrc: frame?.src?.split('/').pop(),
    bottleOpacity: bottleWrap?.style.opacity,
    hasHorizontalOverflow: document.body.scrollWidth > window.innerWidth,
  }
})
console.log('[mobile] state:', JSON.stringify(mobileState))

await mobile.close()
await browser.close()
console.log('\nAll screenshots saved to /tmp/hero_desktop_*.png and /tmp/hero_mobile_375.png')
