import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
await page.setViewportSize({ width: 375, height: 812 })

await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 })
await page.context().addCookies([{ name: 'age_verified', value: 'true', domain: 'localhost', path: '/' }])
await page.evaluate(() => { sessionStorage.setItem('preloaderShown', 'true') })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(1500)

// Force GSAP animations
await page.evaluate(() => {
  document.querySelectorAll('.community-grid > div').forEach(col => {
    col.style.opacity = '1'
    col.style.transform = 'none'
  })
})

// Scroll to events
const eventsOffset = await page.evaluate(() => document.getElementById('events')?.offsetTop || 0)
await page.mouse.move(188, 406)
for (let i = 0; i < 30; i++) {
  await page.mouse.wheel(0, eventsOffset / 30)
  await page.waitForTimeout(30)
}
await page.waitForTimeout(500)

// Check overflow on awards container
const overflowInfo = await page.evaluate(() => {
  const events = document.getElementById('events')
  const awardContainer = events ? events.querySelector('[style*="flex"][style*="wrap"]') : null
  const awards = awardContainer ? Array.from(awardContainer.children) : []
  return {
    containerWidth: awardContainer ? awardContainer.getBoundingClientRect().width : null,
    containerScrollWidth: awardContainer ? awardContainer.scrollWidth : null,
    awardsCount: awards.length,
    awardWidths: awards.map(a => Math.round(a.getBoundingClientRect().width)),
    awardLefts: awards.map(a => Math.round(a.getBoundingClientRect().left)),
    viewportWidth: window.innerWidth,
    bodyScrollWidth: document.documentElement.scrollWidth,
    eventsScrollWidth: events ? events.scrollWidth : null,
    eventsClientWidth: events ? events.clientWidth : null,
  }
})
console.log(JSON.stringify(overflowInfo, null, 2))

await browser.close()
