import { useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

const LITE_QUERY = '(max-width: 1024px), (hover: none), (pointer: coarse)'

/** Safari on iOS 17 and below gets the stagnant (no-animation) site. 18+ keeps motion. */
export const STAGNANT_IOS_MAX = 17

function matchesLite() {
  if (typeof window === 'undefined') return true
  return window.matchMedia(LITE_QUERY).matches
}

/** Safari on iPhone/iPad (not Chrome/Firefox/Edge wrappers). */
export function isIOSSafari() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent
  const iOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  if (!iOS) return false
  const isWebKit = /WebKit/.test(ua)
  const isOtherBrowser = /CriOS|FxiOS|OPiOS|EdgiOS|DuckDuckGo/.test(ua)
  return isWebKit && !isOtherBrowser
}

/** Parse iOS major.minor from the UA (`OS 17_6_1 like Mac OS X`). */
export function getIOSVersion(): { major: number; minor: number } | null {
  if (typeof navigator === 'undefined') return null
  const match = navigator.userAgent.match(/OS (\d+)[._](\d+)/)
  if (!match?.[1] || !match[2]) return null
  return { major: Number(match[1]), minor: Number(match[2]) }
}

function needsStagnantSafari(safari: boolean, major: number | null) {
  if (!safari) return false
  // Unknown version on Safari → stay stagnant (safer for old devices)
  if (major === null) return true
  return major <= STAGNANT_IOS_MAX
}

/**
 * Soft / stagnant path:
 * - Older iOS Safari (≤17): no Framer motion, CSS transitions off, embeds as links
 * - Newer iOS Safari (18+), Chrome, desktop: full animations
 * - Hero video still plays on stagnant
 * `lite` still marks touch/narrow viewports for lighter media preload.
 */
export function applyMotionDocumentClasses() {
  if (typeof document === 'undefined') return
  const safari = isIOSSafari()
  const major = getIOSVersion()?.major ?? null
  const stagnant = needsStagnantSafari(safari, major)
  document.documentElement.classList.toggle('is-ios-safari', safari)
  document.documentElement.classList.toggle('is-stagnant', stagnant)
}

export function useMotionProfile() {
  const reduceMotion = useReducedMotion() === true
  const [lite, setLite] = useState(matchesLite)
  const [safariIOS, setSafariIOS] = useState(isIOSSafari)
  const [iosMajor, setIosMajor] = useState<number | null>(
    () => getIOSVersion()?.major ?? null,
  )

  useEffect(() => {
    const media = window.matchMedia(LITE_QUERY)
    const sync = () => setLite(media.matches)
    sync()
    media.addEventListener('change', sync)

    applyMotionDocumentClasses()
    setSafariIOS(isIOSSafari())
    setIosMajor(getIOSVersion()?.major ?? null)

    return () => {
      media.removeEventListener('change', sync)
      document.documentElement.classList.remove('is-ios-safari')
      document.documentElement.classList.remove('is-stagnant')
    }
  }, [])

  const stagnantSafari = needsStagnantSafari(safariIOS, iosMajor)
  const soft = reduceMotion || stagnantSafari

  return {
    reduceMotion,
    lite,
    soft,
    safariIOS,
    iosMajor,
    stagnantSafari,
    viewport: soft
      ? ({ once: true, amount: 0.15 } as const)
      : ({ once: false, amount: 0.35 } as const),
  }
}
