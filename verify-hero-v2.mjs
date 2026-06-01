import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
await page.setViewportSize({ width: 1440, height: 900 })

// Skip preloader and age gate
await page.goto('http://localhost:3000')
await page.evaluate(() => {
  document.cookie = 'age_verified=true; path=/'
  sessionStorage.setItem('preloaderShown', 'true')
})
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(1500)

// Screenshot at scroll 0
await page.screenshot({ path: '/tmp/hero-v2-start.png' })

// Nav info at start
const navInfo = await page.evaluate(() => {
  const nav = document.querySelector('nav')
  if (!nav) return { found: false }
  return {
    found: true,
    computedOpacity: window.getComputedStyle(nav).opacity,
    inlineOpacity: nav.style.opacity,
    pointerEvents: nav.style.pointerEvents,
  }
})

// All images present
const heroElements = await page.evaluate(() =>
  Array.from(document.querySelectorAll('img')).map(img => ({
    src: img.src.split('/').pop(),
    alt: img.alt,
    opacity: window.getComputedStyle(img).opacity,
  }))
)

// Use mouse wheel scroll to drive GSAP ScrollTrigger (window.scrollTo alone doesn't trigger it in headless)
// Scroll to 2850px in chunks
await page.mouse.move(720, 450)
for (let scrolled = 0; scrolled < 2850; scrolled += 200) {
  await page.mouse.wheel(0, 200)
  await page.waitForTimeout(30)
}
await page.waitForTimeout(800)
await page.screenshot({ path: '/tmp/hero-v2-near-end.png' })

const midState = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('img')).map(img => ({
    src: img.src.split('/').pop(),
    opacity: window.getComputedStyle(img).opacity,
  }))
  const nav = document.querySelector('nav')
  const heroSection = document.querySelector('#hero')
  const frameImg = heroSection?.querySelector('img')
  return {
    imgs,
    navOpacity: nav ? window.getComputedStyle(nav).opacity : 'not found',
    frameImgOpacity: frameImg ? window.getComputedStyle(frameImg).opacity : 'not found',
    scrollY: window.scrollY,
  }
})

// Scroll to 3200px
for (let scrolled = 2850; scrolled < 3200; scrolled += 200) {
  await page.mouse.wheel(0, 200)
  await page.waitForTimeout(30)
}
await page.waitForTimeout(800)
await page.screenshot({ path: '/tmp/hero-v2-revealed.png' })

const finalState = await page.evaluate(() => {
  const imgs = Array.from(document.querySelectorAll('img')).map(img => ({
    src: img.src.split('/').pop(),
    opacity: window.getComputedStyle(img).opacity,
  }))
  const nav = document.querySelector('nav')
  const heroSection = document.querySelector('#hero')
  const frameImg = heroSection?.querySelector('img')
  return {
    imgs,
    navOpacity: nav ? window.getComputedStyle(nav).opacity : 'not found',
    navPointerEvents: nav ? window.getComputedStyle(nav).pointerEvents : 'not found',
    frameImgOpacity: frameImg ? window.getComputedStyle(frameImg).opacity : 'not found',
    scrollY: window.scrollY,
  }
})

await browser.close()
console.log(JSON.stringify({ navInfo, heroElements, midState, finalState }, null, 2))
