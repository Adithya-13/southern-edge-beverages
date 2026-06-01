'use client'

export const FRAME_COUNT = 192

export const FRAME_URLS: string[] = Array.from(
  { length: FRAME_COUNT },
  (_, i) => `/images/frames/frame_${String(i + 1).padStart(3, '0')}.webp`,
)

// Shared, persistent store of preloaded frame Images. Keeping these references
// alive prevents GC, so the Hero's scrubbing stays warm (no re-fetch/re-decode).
export const frameCache: HTMLImageElement[] = []

const PREWARM_IMAGES = [
  '/images/bottle_caramel.png',
  '/images/bottle_sweettea.png',
  '/images/bottle_limon.png',
  '/images/logo_se_circle_white.png',
]
const PREWARM_VIDEO = '/videos/bourbon_bar.mp4'

// Force-decode only the first N frames so the reveal starts instantly. Decoding
// all 192 (≈530MB of RGBA on mobile) would crash; the rest just warm the HTTP cache.
const DECODE_AHEAD = 24
// Video is large — weight it heavier than a single frame/image.
const VIDEO_WEIGHT = 24
// Don't let a slow video block the whole loader.
const VIDEO_TIMEOUT_MS = 6000
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

function loadVideo(url: string, bump: () => void): Promise<void> {
  return new Promise<void>((resolve) => {
    const video = document.createElement('video')
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'

    let settled = false
    let timer: ReturnType<typeof setTimeout> | null = null
    const done = () => {
      if (settled) return
      settled = true
      if (timer) clearTimeout(timer)
      bump()
      resolve()
    }

    // Gate on 'loadeddata' (first frame ready) not 'canplaythrough' (whole clip
    // buffered): the video isn't revealed until 70% into the hero pin, so blocking
    // the loader on full playability needlessly parks the counter at ~89%. preload
    // ='auto' keeps buffering in the background after the curtain lifts.
    video.addEventListener('loadeddata', done, { once: true })
    video.addEventListener('error', done, { once: true })
    timer = setTimeout(done, VIDEO_TIMEOUT_MS)

    video.src = url
    video.load()
  })
}

export function preloadAllAssets(
  onProgress: (fraction: number) => void,
): Promise<void> {
  if (started && cached) return cached
  started = true

  const totalWeight = FRAME_COUNT + PREWARM_IMAGES.length + VIDEO_WEIGHT
  let loadedWeight = 0

  const report = (delta: number) => {
    loadedWeight += delta
    const fraction = Math.min(1, Math.max(0, loadedWeight / totalWeight))
    onProgress(fraction)
  }

  const tasks: Promise<void>[] = [
    ...FRAME_URLS.map((url, i) => loadFrame(url, i, () => report(1))),
    ...PREWARM_IMAGES.map((url) => loadImage(url, () => report(1))),
    loadVideo(PREWARM_VIDEO, () => report(VIDEO_WEIGHT)),
  ]

  cached = Promise.allSettled(tasks).then(() => {})
  return cached
}
