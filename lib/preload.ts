'use client'

export const FRAME_COUNT = 192

export const FRAME_URLS: string[] = Array.from(
  { length: FRAME_COUNT },
  (_, i) => `/images/frames/frame_${String(i + 1).padStart(3, '0')}.webp`,
)

// Shared, persistent store of preloaded frame Images. Keeping these references
// alive prevents GC, so the Hero's scrubbing stays warm (no re-fetch/re-decode).
export const frameCache: HTMLImageElement[] = []

// Only the SE mark is needed immediately (nav + footer). Bottle images are served
// optimized + lazy by next/image when their sections scroll into view, so they are
// NOT prewarmed here (raw PNGs are far larger than the next/image WebP variants).
const PREWARM_IMAGES = ['/images/logo_se_circle_white.png']

// The loader blocks only on the first CRITICAL_FRAMES (enough to begin the reveal);
// the remaining frames stream in the background so the site appears far sooner.
const CRITICAL_FRAMES = 60
// Force-decode only the first N frames so the reveal starts instantly. Decoding
// all 192 (≈530MB of RGBA on mobile) would crash; the rest just warm the HTTP cache.
const DECODE_AHEAD = 24
// Bound every frame/image load so a stalled connection (load/error never firing)
// can't hang Promise.allSettled and freeze the loader forever.
const ASSET_TIMEOUT_MS = 8000

let started = false
let cached: Promise<void> | null = null

function loadFrame(url: string, index: number, bump: () => void): Promise<void> {
  return new Promise<void>((resolve) => {
    const img = new Image()
    frameCache[index] = img
    let settled = false
    let timer: ReturnType<typeof setTimeout> | null = null
    const done = () => {
      if (settled) return
      settled = true
      if (timer) clearTimeout(timer)
      bump()
      resolve()
    }
    img.onload = () => {
      if (index < DECODE_AHEAD) {
        img
          .decode()
          .catch(() => {})
          .finally(done)
      } else {
        done()
      }
    }
    img.onerror = done
    timer = setTimeout(done, ASSET_TIMEOUT_MS)
    img.src = url
  })
}

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

  const criticalCount = Math.min(CRITICAL_FRAMES, FRAME_COUNT)
  // The loader only waits on (and reports progress for) the critical frames + the
  // SE mark. The video is no longer preloaded (loads lazily in the Hero), and the
  // frame tail streams in the background below.
  const totalWeight = criticalCount + PREWARM_IMAGES.length
  let loadedWeight = 0

  const report = (delta: number) => {
    loadedWeight += delta
    const fraction = Math.min(1, Math.max(0, loadedWeight / totalWeight))
    onProgress(fraction)
  }

  const tasks: Promise<void>[] = [
    ...FRAME_URLS.slice(0, criticalCount).map((url, i) =>
      loadFrame(url, i, () => report(1)),
    ),
    ...PREWARM_IMAGES.map((url) => loadImage(url, () => report(1))),
  ]

  // Frame tail — fetch in the background (no await, no progress weight). These still
  // populate frameCache; the Hero's drawFrame guards on img.complete, so any frame
  // not yet arrived simply holds the last painted frame until it streams in.
  FRAME_URLS.slice(criticalCount).forEach((url, i) =>
    loadFrame(url, criticalCount + i, () => {}),
  )

  cached = Promise.allSettled(tasks).then(() => {})
  return cached
}
