import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
await page.setViewportSize({ width: 1440, height: 900 })

// Bypass gates
await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 })
await page.evaluate(() => {
  sessionStorage.setItem('preloaderShown', 'true')
  document.cookie = 'age_verified=true; path=/'
})
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(2000)

// PHASE 1 — scroll=0 (frames start, dark, scroll prompt)
await page.screenshot({ path: '/tmp/hero2_0.png', fullPage: false })
console.log('[0px] screenshot saved')

// PHASE 2 — scroll to 1500px: mid-frame sequence (~33% of total 4500)
await page.evaluate(() => window.scrollTo(0, 1500))
await page.waitForTimeout(2500)
await page.screenshot({ path: '/tmp/hero2_1500.png', fullPage: false })
const s1500 = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll('#hero img')]
  return { frame: imgs[0]?.src?.split('/').pop(), bottleOpacity: imgs[1]?.parentElement?.parentElement?.style.opacity }
})
console.log('[1500px]', JSON.stringify(s1500))

// PHASE 3 — scroll to 2850px: reveal starts (~63% of 4500 = still in frame range, within last 12%)
await page.evaluate(() => window.scrollTo(0, 2850))
await page.waitForTimeout(2500)
await page.screenshot({ path: '/tmp/hero2_2850.png', fullPage: false })
const s2850 = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll('#hero img')]
  const video = document.querySelector('#hero video')
  return { frame: imgs[0]?.src?.split('/').pop(), videoOpacity: video?.style.opacity, bottleOpacity: imgs[1]?.parentElement?.parentElement?.style.opacity }
})
console.log('[2850px]', JSON.stringify(s2850))

// DWELL PHASE — scroll to 3500px: past FRAME_END (3000px), dwell; bottle+text fully visible
await page.evaluate(() => window.scrollTo(0, 3500))
await page.waitForTimeout(2500)
await page.screenshot({ path: '/tmp/hero2_3500.png', fullPage: false })
const s3500 = await page.evaluate(() => {
  const imgs = [...document.querySelectorAll('#hero img')]
  const video = document.querySelector('#hero video')
  const text = document.querySelector('#hero div[style*="zIndex: 4"]')
  return {
    frame: imgs[0]?.src?.split('/').pop(),
    videoOpacity: video?.style.opacity,
    bottleOpacity: imgs[1]?.parentElement?.parentElement?.style.opacity,
    textOpacity: text?.style.opacity,
    scrollY: window.scrollY,
  }
})
console.log('[3500px DWELL]', JSON.stringify(s3500))

await page.close()

// ── Mobile 375px ───────────────────────────────────────────────────────────────
const mobile = await browser.newPage()
await mobile.setViewportSize({ width: 375, height: 812 })
await mobile.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 })
await mobile.evaluate(() => {
  sessionStorage.setItem('preloaderShown', 'true')
  document.cookie = 'age_verified=true; path=/'
})
await mobile.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 })
await mobile.waitForTimeout(2000)
await mobile.screenshot({ path: '/tmp/hero2_mobile.png', fullPage: false })
const mstate = await mobile.evaluate(() => ({
  hasOverflow: document.body.scrollWidth > window.innerWidth,
  heroH: document.getElementById('hero')?.offsetHeight,
}))
console.log('[mobile]', JSON.stringify(mstate))
await mobile.close()

await browser.close()
console.log('Done. Screenshots in /tmp/hero2_*.png')
