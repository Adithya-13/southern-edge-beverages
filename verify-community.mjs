import { chromium } from 'playwright'

const issues = []
const section = 'community'
const browser = await chromium.launch({ headless: true })

const viewports = [
  [1440, 900, 'desktop'],
  [768, 1024, 'tablet'],
  [375, 812, 'mobile'],
]

for (const [width, height, name] of viewports) {
  const page = await browser.newPage()
  await page.setViewportSize({ width, height })

  const consoleErrors = []
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', err => consoleErrors.push(err.message))

  try {
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 })
    await page.evaluate(() => sessionStorage.setItem('preloaderShown', 'true'))
    await page.reload({ waitUntil: 'networkidle', timeout: 30000 })
    await page.waitForTimeout(2000)

    // Click age gate
    const ageBtn = await page.$('button:has-text("YES")')
    if (ageBtn) {
      await ageBtn.click()
      await page.waitForTimeout(2500)
    }

    // Disable ScrollSmoother by resetting smooth-wrapper overflow and smooth-content transform
    await page.evaluate(() => {
      var wrapper = document.getElementById('smooth-wrapper')
      var content = document.getElementById('smooth-content')
      if (wrapper) {
        wrapper.style.cssText = 'overflow: visible !important; height: auto !important; position: static !important;'
      }
      if (content) {
        content.style.cssText = 'transform: none !important; position: static !important; will-change: auto !important;'
      }
      // Also override html/body overflow 
      document.documentElement.style.overflow = 'visible'
      document.body.style.overflow = 'visible'
    })
    await page.waitForTimeout(500)

    // Force all GSAP-animated elements (opacity:0, translateX) to be visible
    await page.evaluate(() => {
      // Community grid columns
      document.querySelectorAll('.community-grid > div').forEach(function(el) {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      // Any other opacity:0 elements
      document.querySelectorAll('[style*="opacity: 0"]').forEach(function(el) {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
      // Hero chars
      document.querySelectorAll('[data-char]').forEach(function(el) {
        el.style.opacity = '1'
      })
    })
    await page.waitForTimeout(500)

    // Take element screenshot of community section
    const communityEl = await page.$('#community')
    const eventsEl = await page.$('#events')

    if (communityEl) {
      await communityEl.screenshot({ path: '/tmp/se-' + section + '-' + name + '.png' })
    } else {
      issues.push('#community element not found at ' + width + 'px')
    }

    if (eventsEl) {
      await eventsEl.screenshot({ path: '/tmp/se-' + section + '-' + name + '-events.png' })
    } else {
      issues.push('#events element not found at ' + width + 'px')
    }

    // Full page screenshot for context
    await page.screenshot({ path: '/tmp/se-' + section + '-' + name + '-full.png', fullPage: true })

    // Overflow check on body
    const overflow = await page.evaluate(() => ({
      bodyScrollWidth: document.body.scrollWidth,
      windowInnerWidth: window.innerWidth,
      htmlScrollWidth: document.documentElement.scrollWidth
    }))
    // After resetting overflow to visible, check if any child is wider than the viewport
    const maxChildWidth = await page.evaluate(() => {
      var maxW = 0
      document.querySelectorAll('section, div').forEach(function(el) {
        var rect = el.getBoundingClientRect()
        if (rect.right > maxW) maxW = rect.right
      })
      return maxW
    })
    if (maxChildWidth > width + 5) {
      issues.push('OVERFLOW at ' + width + 'px: max element right edge=' + Math.round(maxChildWidth))
    }

    // Console errors (filter out known non-critical ones)
    const criticalErrors = consoleErrors.filter(function(e) {
      return !e.includes('favicon') && !e.includes('404')
    })
    if (criticalErrors.length > 0) {
      issues.push('Console errors at ' + width + 'px: ' + criticalErrors.slice(0, 3).join(' | '))
    }

    // Community content checks
    if (communityEl) {
      const text = await communityEl.evaluate(function(el) { return el.innerText })
      if (!text.includes('THE COMMUNITY')) issues.push('Missing "THE COMMUNITY" label at ' + width + 'px')
      if (!text.includes('Taste The Edge')) issues.push('Missing "Taste The Edge." heading at ' + width + 'px')
    }

    if (eventsEl) {
      const text = await eventsEl.evaluate(function(el) { return el.innerText })
      if (!text.includes('Recognition')) issues.push('Missing "Recognition." heading at ' + width + 'px')
      if (!text.includes('Silver Medal')) issues.push('Missing "Silver Medal" award text at ' + width + 'px')
      if (!text.toLowerCase().includes('cuisine noir') && !text.toLowerCase().includes('rolling out')) issues.push('Missing press publication names at ' + width + 'px')
      if (!text.includes('Whiskey') && !text.includes('Tasting')) issues.push('Missing marquee events text at ' + width + 'px')
    }

    // Count community grid column divs (should be 3)
    const colCount = await page.evaluate(() => {
      var grid = document.querySelector('.community-grid')
      return grid ? grid.querySelectorAll(':scope > div').length : 0
    })
    if (colCount < 3) issues.push('Community grid has ' + colCount + ' columns (expected 3) at ' + width + 'px')

    // Count inner cards (should be 9)
    const cardCount = await page.evaluate(() => {
      var items = document.querySelectorAll('.community-grid > div > div')
      return items.length
    })
    if (cardCount < 9) issues.push('Community grid has ' + cardCount + ' cards (expected 9) at ' + width + 'px')

  } catch (e) {
    issues.push('Failed at ' + width + 'px: ' + e.message)
  }

  await page.close()
}

await browser.close()

console.log(JSON.stringify({
  passes: issues.length === 0,
  issues,
  screenshots: viewports.map(([,, n]) => '/tmp/se-' + section + '-' + n + '.png')
}))
