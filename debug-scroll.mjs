import { chromium } from 'playwright'

const browser = await chromium.launch({ headless: true })

// Test tablet
const page = await browser.newPage()
await page.setViewportSize({ width: 768, height: 1024 })

await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 })
await page.context().addCookies([{ name: 'age_verified', value: 'true', domain: 'localhost', path: '/' }])
await page.evaluate(() => { sessionStorage.setItem('preloaderShown', 'true') })
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 })
await page.waitForTimeout(1500)

// Force GSAP animations to complete
await page.evaluate(() => {
  document.querySelectorAll('.community-grid > div').forEach(col => {
    col.style.opacity = '1'
    col.style.transform = 'none'
  })
})

// Debug scroll state
const scrollState = await page.evaluate(() => {
  const smoothWrapper = document.getElementById('smooth-wrapper')
  const body = document.body
  const html = document.documentElement
  const communityEl = document.getElementById('community')
  return {
    bodyOverflow: getComputedStyle(body).overflow,
    htmlOverflow: getComputedStyle(html).overflow,
    smoothWrapperOverflow: smoothWrapper ? getComputedStyle(smoothWrapper).overflow : null,
    smoothWrapperHeight: smoothWrapper ? smoothWrapper.scrollHeight : null,
    communityOffsetTop: communityEl ? communityEl.offsetTop : null,
    windowScrollY: window.scrollY,
    bodyScrollTop: body.scrollTop,
    htmlScrollTop: html.scrollTop,
  }
})
console.log('Scroll state:', JSON.stringify(scrollState, null, 2))

// Try scrolling body directly
await page.evaluate(() => {
  const communityEl = document.getElementById('community')
  if (!communityEl) return
  const offset = communityEl.offsetTop

  // Try all scroll methods
  document.body.scrollTop = offset
  document.documentElement.scrollTop = offset
  window.scrollTo({ top: offset, behavior: 'instant' })

  // If smooth-wrapper exists scroll it
  const wrapper = document.getElementById('smooth-wrapper')
  if (wrapper) wrapper.scrollTop = offset
})
await page.waitForTimeout(400)

const afterScroll = await page.evaluate(() => ({
  windowScrollY: window.scrollY,
  bodyScrollTop: document.body.scrollTop,
  htmlScrollTop: document.documentElement.scrollTop,
  smoothWrapperScrollTop: document.getElementById('smooth-wrapper')?.scrollTop,
  communityBoundingTop: document.getElementById('community')?.getBoundingClientRect().top,
}))
console.log('After scroll:', JSON.stringify(afterScroll, null, 2))

await page.screenshot({ path: '/tmp/debug-tablet-community.png' })
await browser.close()
