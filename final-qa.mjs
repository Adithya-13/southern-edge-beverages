import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const issues = []
const viewports = [[1440,900,'desktop'],[768,1024,'tablet'],[375,812,'mobile']]
for (const [w,h,name] of viewports) {
  const page = await browser.newPage()
  await page.setViewportSize({ width: w, height: h })
  const errs = []
  page.on('pageerror', e => errs.push(e.message))
  await page.goto('http://localhost:3000', { waitUntil:'networkidle', timeout:30000 })
  // Wait for preloader to finish (3.5s) and age gate to appear
  await page.waitForTimeout(4500)
  // Click through age gate if present
  const yesBtn = page.locator('button').filter({ hasText: /21/i }).first()
  if (await yesBtn.isVisible()) {
    await yesBtn.click()
    await page.waitForTimeout(1000)
  }
  // Wait for main content to be visible
  await page.waitForTimeout(1500)
  await page.screenshot({ path: '/tmp/se-final-' + name + '.png', fullPage: true })
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  if (overflow) issues.push('Overflow at ' + w + 'px')
  if (errs.length) issues.push('JS errors at ' + w + 'px: ' + errs[0])
  // Check key copy strings exist
  const bodyText = await page.evaluate(() => document.body.innerText)
  // Manifesto words are in inline-block spans so innerText concatenates without spaces
  // Check with spaces stripped for that section
  const bodyTextNoSpaces = bodyText.replace(/\s+/g, '')
  const checks = [
    // Use textContent check on the story section for manifesto
    { str: 'TheLegacyofSouthernEdgeSpirits', label: 'Manifesto quote missing', noSpaces: true },
    { str: 'TASTE THE EDGE', label: 'Products heading missing', noSpaces: false },
    { str: 'Please drink responsibly', label: 'Legal copy missing', noSpaces: false },
  ]
  for (const { str, label, noSpaces } of checks) {
    const haystack = noSpaces ? bodyTextNoSpaces : bodyText
    if (!haystack.includes(noSpaces ? str.replace(/\s+/g, '') : str)) {
      issues.push(label + ' at ' + name)
    }
  }
  await page.close()
}
await browser.close()
console.log(JSON.stringify({ passes: issues.length === 0, issues }))
