import { useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

const LITE_QUERY = '(max-width: 1024px), (hover: none), (pointer: coarse)'

function matchesLite() {
  if (typeof window === 'undefined') return true
  return window.matchMedia(LITE_QUERY).matches
}

/**
 * Soft motion for phones/tablets:
 * - no scroll-linked blur/parallax
 * - MotionConfig reducedMotion=always (no transform bounce while scrolling)
 * - static rem spacing (see CSS) so Safari toolbar resize does not jump layout
 */
export function useMotionProfile() {
  const reduceMotion = useReducedMotion() === true
  const [lite, setLite] = useState(matchesLite)

  useEffect(() => {
    const media = window.matchMedia(LITE_QUERY)
    const sync = () => setLite(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  const soft = reduceMotion || lite

  return {
    reduceMotion,
    lite,
    soft,
    /** Prefer once on soft; desktop may replay */
    viewport: soft
      ? ({ once: true, amount: 0.15 } as const)
      : ({ once: false, amount: 0.35 } as const),
  }
}
