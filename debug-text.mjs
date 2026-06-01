import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
await page.setViewportSize({ width: 1440, height: 900 })
await page.goto('http://localhost:3000', { waitUntil:'networkidle', timeout:30000 })
// Wait for preloader and age gate
await page.waitForTimeout(4500)
const yesBtn = page.locator('button').filter({ hasText: /21/i }).first()
if (await yesBtn.isVisible()) {
  await yesBtn.click()
  await page.waitForTimeout(1000)
}
await page.waitForTimeout(1500)
// Scroll to manifesto section
await page.evaluate(() => {
  const el = document.getElementById('story')
  if (el) el.scrollIntoView()
})
await page.waitForTimeout(500)
const bodyText = await page.evaluate(() => document.body.innerText)
// Print relevant excerpt around "Legacy"
const idx = bodyText.indexOf('Legacy')
console.log('Found Legacy at index:', idx)
if (idx >= 0) {
  console.log('Context:', JSON.stringify(bodyText.slice(Math.max(0, idx-20), idx+60)))
}
const idx2 = bodyText.indexOf('The Legacy')
console.log('Found "The Legacy" at index:', idx2)
// Also check innerHTML
const manifestoText = await page.evaluate(() => {
  const el = document.getElementById('story')
  return el ? el.innerText.slice(0, 200) : 'NOT FOUND'
})
console.log('Manifesto innerText:', JSON.stringify(manifestoText))
await browser.close()
