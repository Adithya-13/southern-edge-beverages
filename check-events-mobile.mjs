import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
await page.setViewportSize({ width: 375, height: 812 })

await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 })
await page.context().addCookies([{ name: 'age_verified', value: 'true', domain: 'localhost', path: '/' }])
await page.evaluate(() => { sessionStorage.setItem('preloaderShown', 'true') })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(1500)

await page.evaluate(() => {
  document.querySelectorAll('.community-grid > div').forEach(col => {
    col.style.opacity = '1'
    col.style.transform = 'none'
  })
})

// Scroll to events and take screenshot
const eventsOffset = await page.evaluate(() => document.getElementById('events')?.offsetTop || 0)
await page.mouse.move(188, 406)
for (let i = 0; i < 50; i++) {
  await page.mouse.wheel(0, eventsOffset / 50)
  await page.waitForTimeout(20)
}
await page.waitForTimeout(600)

// Check detailed overflow
const info = await page.evaluate(() => {
  const events = document.getElementById('events')
  if (!events) return { error: 'no events' }
  const allChildren = Array.from(events.querySelectorAll('*'))
  const overflowing = allChildren.filter(el => el.scrollWidth > el.clientWidth && el.scrollWidth > 375)
  return {
    totalChildren: allChildren.length,
    overflowingCount: overflowing.length,
    overflowingElements: overflowing.slice(0, 5).map(el => ({
      tag: el.tagName,
      className: el.className,
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      id: el.id
    })),
    eventsScrollW: events.scrollWidth,
    eventsClientW: events.clientWidth,
    scrollY: window.scrollY,
    eventsTop: events.getBoundingClientRect().top,
  }
})
console.log(JSON.stringify(info, null, 2))

await page.screenshot({ path: '/tmp/se-events-mobile-check.png', fullPage: false })
await browser.close()
