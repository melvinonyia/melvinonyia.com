import { useEffect, useState } from 'react'

type MQList = MediaQueryList

function useMediaQuery(query: string, ssrDefault: boolean): boolean {
  const [matches, setMatches] = useState(ssrDefault)
  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return
    const mq: MQList = window.matchMedia(query)
    setMatches(mq.matches)
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches)
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [query])
  return matches
}

/**
 * True when the user has expressed a preference for reduced motion.
 * SSR-safe default: false (no preference) so the server renders the motion path.
 */
export function useReducedMotionPreferred(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)', false)
}

/**
 * True when the primary input mechanism cannot hover (most touch devices).
 * SSR-safe default: false (assume hover-capable) so the server renders the hover path.
 */
export function useTouchOnly(): boolean {
  return useMediaQuery('(hover: none)', false)
}
