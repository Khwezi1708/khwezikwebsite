import { useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

const LITE_QUERY = '(max-width: 1024px), (hover: none), (pointer: coarse)'

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

/**
 * Soft motion only where Safari on iOS struggles:
 * - no useScroll / parallax
 * - no entrance transforms while scrolling
 * Chrome/Firefox on the same phone keep full motion.
 * `lite` still marks touch/narrow viewports for lighter media (preload, etc.).
 */
export function useMotionProfile() {
  const reduceMotion = useReducedMotion() === true
  const [lite, setLite] = useState(matchesLite)
  const [safariIOS, setSafariIOS] = useState(isIOSSafari)

  useEffect(() => {
    const media = window.matchMedia(LITE_QUERY)
    const sync = () => setLite(media.matches)
    sync()
    media.addEventListener('change', sync)

    const safari = isIOSSafari()
    setSafariIOS(safari)
    document.documentElement.classList.toggle('is-ios-safari', safari)

    return () => {
      media.removeEventListener('change', sync)
      document.documentElement.classList.remove('is-ios-safari')
    }
  }, [])

  const soft = reduceMotion || safariIOS

  return {
    reduceMotion,
    lite,
    soft,
    safariIOS,
    viewport: soft
      ? ({ once: true, amount: 0.15 } as const)
      : ({ once: false, amount: 0.35 } as const),
  }
}
