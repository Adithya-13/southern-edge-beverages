import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
await page.setViewportSize({ width: 1440, height: 900 })

await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 })

await page.context().addCookies([{
  name: 'age_verified',
  value: 'true',
  domain: 'localhost',
  path: '/',
}])
await page.evaluate(() => {
  sessionStorage.setItem('preloaderShown', 'true')
})

await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(2000)

// Check community section DOM state before scroll
const beforeInfo = await page.evaluate(() => {
  const section = document.getElementById('community')
  if (!section) return { error: 'no community section' }
  const grid = section.querySelector('.community-grid')
  const cols = grid ? Array.from(grid.children) : []
  return {
    sectionTop: section.getBoundingClientRect().top,
    colCount: cols.length,
    colStyles: cols.slice(0,3).map(c => ({
      opacity: c.style.opacity,
      transform: c.style.transform,
    })),
  }
})
console.log('BEFORE SCROLL:', JSON.stringify(beforeInfo, null, 2))

// Now scroll to community section
await page.evaluate(() => {
  const el = document.getElementById('community')
  if (el) el.scrollIntoView({ behavior: 'instant' })
})
await page.waitForTimeout(1500)

const afterInfo = await page.evaluate(() => {
  const section = document.getElementById('community')
  if (!section) return { error: 'no section' }
  const grid = section.querySelector('.community-grid')
  const cols = grid ? Array.from(grid.children) : []
  return {
    colCount: cols.length,
    colStyles: cols.slice(0,3).map(c => ({
      opacity: c.style.opacity,
      transform: c.style.transform,
    })),
    scrollY: window.scrollY,
    sectionTop: section.getBoundingClientRect().top,
  }
})
console.log('AFTER SCROLL:', JSON.stringify(afterInfo, null, 2))

await page.screenshot({ path: '/tmp/debug-community.png' })
await browser.close()
