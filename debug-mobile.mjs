import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })

// Test mobile
const page = await browser.newPage()
await page.setViewportSize({ width: 375, height: 812 })

await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 })
await page.context().addCookies([{ name: 'age_verified', value: 'true', domain: 'localhost', path: '/' }])
await page.evaluate(() => { sessionStorage.setItem('preloaderShown', 'true') })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(1500)

// Force GSAP animations to complete
await page.evaluate(() => {
  document.querySelectorAll('.community-grid > div').forEach(col => {
    col.style.opacity = '1'
    col.style.transform = 'none'
    col.style.visibility = 'visible'
  })
})

// Force GSAP animations to show
await page.evaluate(() => {
  document.querySelectorAll('.community-grid > div').forEach(col => {
    col.style.opacity = '1'
    col.style.transform = 'none'
  })
})

// Scroll to community section via wheel
const communityOffset = await page.evaluate(() => document.getElementById('community')?.offsetTop || 0)
await page.mouse.move(188, 406)
for (let i = 0; i < 30; i++) {
  await page.mouse.wheel(0, communityOffset / 30)
  await page.waitForTimeout(30)
}
await page.waitForTimeout(500)
await page.screenshot({ path: '/tmp/se-community-mobile-correct.png' })

// Scroll to events
const eventsOffset = await page.evaluate(() => document.getElementById('events')?.offsetTop || 0)
const currentPos = await page.evaluate(() => window.scrollY)
const delta = eventsOffset - currentPos
for (let i = 0; i < 30; i++) {
  await page.mouse.wheel(0, delta / 30)
  await page.waitForTimeout(30)
}
await page.waitForTimeout(500)
await page.screenshot({ path: '/tmp/se-events-mobile-correct.png' })

await browser.close()
console.log('Done')
