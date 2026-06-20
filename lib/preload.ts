'use client'

// Only the SE mark is needed immediately (nav + footer). Bottle images are served
// optimized + lazy by next/image when their sections scroll into view, so they are
// NOT prewarmed here (raw PNGs are far larger than the next/image WebP variants).
const PREWARM_IMAGES = ['/images/logo_se_circle_white.png']

// Bound the load so a stalled connection (load/error never firing) can't hang
// Promise.allSettled and freeze the loader forever.
const ASSET_TIMEOUT_MS = 8000

let started = false
let cached: Promise<void> | null = null

function loadImage(url: string, bump: () => void): Promise<void> {
  return new Promise<void>((resolve) => {
    const img = new Image()
    let settled = false
    let timer: ReturnType<typeof setTimeout> | null = null
    const done = () => {
      if (settled) return
      settled = true
      if (timer) clearTimeout(timer)
      bump()
      resolve()
    }
    img.onload = done
    img.onerror = done
    timer = setTimeout(done, ASSET_TIMEOUT_MS)
    img.src = url
  })
}

export function preloadAllAssets(
  onProgress: (fraction: number) => void,
): Promise<void> {
  if (started && cached) return cached
  started = true

  const totalWeight = PREWARM_IMAGES.length
  let loadedWeight = 0

  const report = (delta: number) => {
    loadedWeight += delta
    const fraction = Math.min(1, Math.max(0, loadedWeight / totalWeight))
    onProgress(fraction)
  }

  const tasks: Promise<void>[] = PREWARM_IMAGES.map((url) => loadImage(url, () => report(1)))

  cached = Promise.allSettled(tasks).then(() => {})
  return cached
}
