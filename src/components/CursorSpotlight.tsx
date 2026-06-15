import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import {
  useReducedMotionPreferred,
  useTouchOnly,
} from '~/lib/motion/usePointerCapabilities'

interface CursorSpotlightProps {
  children: ReactNode
  className?: string
  radius?: number
}

const DEFAULT_RADIUS = 600

export function CursorSpotlight({
  children,
  className,
  radius = DEFAULT_RADIUS,
}: CursorSpotlightProps) {
  const reducedMotion = useReducedMotionPreferred()
  const touchOnly = useTouchOnly()
  const disabled = reducedMotion || touchOnly

  const wrapperRef = useRef<HTMLDivElement>(null)
  const pendingRef = useRef<{ x: number; y: number } | null>(null)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (disabled) return
    const el = wrapperRef.current
    if (!el) return

    const flush = () => {
      if (pendingRef.current) {
        el.style.setProperty('--mx', `${pendingRef.current.x}px`)
        el.style.setProperty('--my', `${pendingRef.current.y}px`)
      }
      rafIdRef.current = null
      pendingRef.current = null
    }

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      pendingRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(flush)
      }
    }

    el.addEventListener('mousemove', onMove)
    return () => {
      el.removeEventListener('mousemove', onMove)
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
      pendingRef.current = null
    }
  }, [disabled])

  return (
    <div
      ref={wrapperRef}
      className={className}
      data-cursor-spotlight
      data-cursor-spotlight-disabled={disabled ? 'true' : 'false'}
      style={{ position: 'relative' }}
    >
      {!disabled && (
        <div
          role="presentation"
          aria-hidden="true"
          data-cursor-spotlight-layer
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: `radial-gradient(${radius}px circle at var(--mx, -9999px) var(--my, -9999px), color-mix(in oklch, var(--color-accent) 18%, transparent), transparent 60%)`,
            zIndex: 0,
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}
