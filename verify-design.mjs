import { chromium } from 'playwright'
const browser = await chromium.launch({ headless: true })
const issues = []

async function setupPage(browser, width, height) {
  const page = await browser.newPage()
  await page.setViewportSize({ width, height })
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.evaluate(() => {
    sessionStorage.setItem('preloaderShown', 'true')
    document.cookie = 'age_verified=true; max-age=2592000; path=/'
  })
  await page.reload({ waitUntil: 'networkidle', timeout: 30000 })
  // Wait for React hydration and useEffect to run (preloader skip + age gate cookie check)
  await page.waitForTimeout(1500)

  // Force scroll-revealed elements in <main> to be visible.
  // Skip elements with pointer-events:none — those are intentionally hidden UI state
  // (e.g. closed mobile nav overlay, hidden scroll prompts).
  await page.evaluate(() => {
    const forceVisible = (root) => {
      root.querySelectorAll('*').forEach(el => {
        if (!el.style) return
        const computed = window.getComputedStyle(el)
        // Skip: pointer-events none = UI element that's intentionally off (menu, prompts)
        if (computed.pointerEvents === 'none') return
        if (el.style.opacity === '0') el.style.opacity = '1'
        if (el.style.visibility === 'hidden') el.style.visibility = 'visible'
        if (el.style.transform && el.style.transform.includes('translateY')) {
          el.style.transform = el.style.transform.replace(/translateY\([^)]*\)/g, 'translateY(0px)')
        }
      })
    }
    const main = document.querySelector('main')
    if (main) forceVisible(main)
    // Also force hero section (inside smooth-content, sibling to main)
    const hero = document.querySelector('#hero')
    if (hero) forceVisible(hero)
  })

  await page.waitForTimeout(300)
  return page
}

async function shotSections(page, prefix) {
  const sections = await page.evaluate(() => {
    const secs = Array.from(document.querySelectorAll('section, footer'))
    return secs.map(s => ({
      id: s.id || s.tagName.toLowerCase(),
      top: s.offsetTop,
    }))
  })

  for (const sec of sections) {
    await page.evaluate(y => window.scrollTo(0, y), sec.top)
    await page.waitForTimeout(400)
    await page.screenshot({ path: `/tmp/${prefix}-${sec.id}.png`, fullPage: false })
  }
  return sections
}

// --- Desktop ---
const desktop = await setupPage(browser, 1440, 900)
const consoleErrors = []
desktop.on('console', m => { if (m.type() === 'error') consoleErrors.push(m.text()) })
await shotSections(desktop, 'se-desktop')
const deskOverflow = await desktop.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
if (deskOverflow) issues.push('Overflow at 1440px')
if (consoleErrors.filter(e => !e.includes('404')).length) issues.push('Console errors desktop: ' + consoleErrors[0])
await desktop.close()

// --- Tablet ---
const tablet = await setupPage(browser, 768, 1024)
await shotSections(tablet, 'se-tablet')
const tabletOverflow = await tablet.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
if (tabletOverflow) issues.push('Overflow at 768px')
await tablet.close()

// --- Mobile ---
const mobile = await setupPage(browser, 375, 812)
await shotSections(mobile, 'se-mobile')
const mobileOverflow = await mobile.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
if (mobileOverflow) issues.push('Overflow at 375px')
await mobile.close()

await browser.close()
console.log(JSON.stringify({ passes: issues.length === 0, issues }))
