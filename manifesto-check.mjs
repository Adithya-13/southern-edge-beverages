import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
await page.setViewportSize({ width: 390, height: 844 })
await page.goto('http://localhost:3000', { waitUntil:'networkidle', timeout:30000 })
await page.waitForTimeout(4500)
const yesBtn = page.locator('button').filter({ hasText: /21/i }).first()
if (await yesBtn.isVisible()) {
  await yesBtn.click()
  await page.waitForTimeout(1000)
}
await page.waitForTimeout(1500)

// Scroll to manifesto slowly
const storyEl = await page.$('#story')
const box = await storyEl.boundingBox()
// Scroll to top of manifesto section
await page.evaluate((y) => window.scrollTo(0, y - 200), box.y)
await page.waitForTimeout(400)
await page.screenshot({ path: '/tmp/manifesto-top.png' })

// Scroll into it more
await page.evaluate((y) => window.scrollTo(0, y + 100), box.y)
await page.waitForTimeout(600)
await page.screenshot({ path: '/tmp/manifesto-in.png' })

await page.close()
await browser.close()
console.log('done')
