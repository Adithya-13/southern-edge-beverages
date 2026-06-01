import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })

// Desktop section-by-section screenshots
const page = await browser.newPage()
await page.setViewportSize({ width: 1440, height: 900 })
await page.goto('http://localhost:3000', { waitUntil:'networkidle', timeout:30000 })
await page.waitForTimeout(4500)
const yesBtn = page.locator('button').filter({ hasText: /21/i }).first()
if (await yesBtn.isVisible()) {
  await yesBtn.click()
  await page.waitForTimeout(1000)
}
await page.waitForTimeout(1500)

// Scroll to manifesto
await page.evaluate(() => { document.getElementById('story')?.scrollIntoView() })
await page.waitForTimeout(800)
await page.screenshot({ path: '/tmp/se-manifesto.png' })

// Scroll to products
await page.evaluate(() => { document.getElementById('products')?.scrollIntoView() })
await page.waitForTimeout(800)
await page.screenshot({ path: '/tmp/se-products.png' })

// Scroll to cocktails
await page.evaluate(() => { document.getElementById('cocktails')?.scrollIntoView() })
await page.waitForTimeout(800)
await page.screenshot({ path: '/tmp/se-recipes.png' })

// Scroll to community
await page.evaluate(() => { document.getElementById('community')?.scrollIntoView() })
await page.waitForTimeout(800)
await page.screenshot({ path: '/tmp/se-community.png' })

// Scroll to events
await page.evaluate(() => { document.getElementById('events')?.scrollIntoView() })
await page.waitForTimeout(800)
await page.screenshot({ path: '/tmp/se-events.png' })

// Scroll to footer
await page.evaluate(() => { window.scrollTo(0, document.body.scrollHeight) })
await page.waitForTimeout(800)
await page.screenshot({ path: '/tmp/se-footer.png' })

await page.close()
await browser.close()
console.log('screenshots done')
