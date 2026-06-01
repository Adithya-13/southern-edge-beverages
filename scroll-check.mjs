import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })

// Mobile scroll - no ScrollSmoother, so GSAP ScrollTrigger works normally
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

// Slowly scroll through the page to trigger ScrollTrigger animations
const totalHeight = await page.evaluate(() => document.body.scrollHeight)
for (let y = 0; y <= totalHeight; y += 300) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y)
  await page.waitForTimeout(100)
}
// Scroll back to key sections for screenshots
await page.evaluate(() => { document.getElementById('story')?.scrollIntoView() })
await page.waitForTimeout(800)
await page.screenshot({ path: '/tmp/mobile-manifesto.png' })

await page.evaluate(() => { document.getElementById('products')?.scrollIntoView() })
await page.waitForTimeout(800)
await page.screenshot({ path: '/tmp/mobile-products.png' })

await page.evaluate(() => { document.getElementById('community')?.scrollIntoView() })
await page.waitForTimeout(800)
await page.screenshot({ path: '/tmp/mobile-community.png' })

await page.close()
await browser.close()
console.log('done')
