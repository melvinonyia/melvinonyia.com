import { useNavigate } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { useReducedMotionPreferred } from '~/lib/motion/usePointerCapabilities'
import { getPaletteForPath, type RoutePalette } from '~/lib/site/palette'

type DocumentWithViewTransitions = Document & {
  startViewTransition?: (cb: () => void | Promise<void>) => {
    finished: Promise<void>
  }
}

function getStartViewTransition() {
  if (typeof document === 'undefined') return undefined
  const doc = document as DocumentWithViewTransitions
  return typeof doc.startViewTransition === 'function'
    ? doc.startViewTransition.bind(doc)
    : undefined
}

function currentPalette(): RoutePalette {
  if (typeof document === 'undefined') return 'dark'
  return (document.documentElement.getAttribute('data-palette') as RoutePalette) || 'dark'
}

function targetHref(anchor: HTMLAnchorElement): string | null {
  const href = anchor.getAttribute('href')
  if (!href) return null
  // Only internal absolute paths participate in the palette wipe — leave
  // mailto:, tel:, external http(s):, hash links, and download links alone.
  if (!href.startsWith('/') || href.startsWith('//')) return null
  if (anchor.target && anchor.target !== '' && anchor.target !== '_self') return null
  if (anchor.hasAttribute('download')) return null
  return href
}

export function RoutePaletteSync() {
  const navigate = useNavigate()
  const reducedMotion = useReducedMotionPreferred()
  const reducedMotionRef = useRef(reducedMotion)
  reducedMotionRef.current = reducedMotion

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented) return
      if (event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      const anchor = (event.target as Element | null)?.closest('a')
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return
      const href = targetHref(anchor)
      if (!href) return
      // Strip query + hash before mapping — palette is path-driven.
      const pathOnly = href.replace(/[?#].*$/, '')
      const next = getPaletteForPath(pathOnly)
      if (next === currentPalette()) return
      if (reducedMotionRef.current) return
      const start = getStartViewTransition()
      if (!start) return
      event.preventDefault()
      const html = document.documentElement
      html.setAttribute('data-palette-transition', 'true')
      const transition = start(() => {
        void navigate({ to: href })
      })
      const clear = () => html.removeAttribute('data-palette-transition')
      transition.finished.then(clear, clear)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [navigate])

  return null
}
