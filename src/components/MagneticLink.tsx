import { Link } from '@tanstack/react-router'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useRef, type ComponentProps, type MouseEvent, type ReactNode } from 'react'
import {
  useReducedMotionPreferred,
  useTouchOnly,
} from '~/lib/motion/usePointerCapabilities'

type LinkPropsAny = Omit<ComponentProps<typeof Link>, 'children'>

interface MagneticLinkProps extends LinkPropsAny {
  children: ReactNode
  radius?: number
  maxOffset?: number
}

const SPRING = { stiffness: 220, damping: 18 }

export function MagneticLink({
  children,
  radius = 40,
  maxOffset = 8,
  ...linkProps
}: MagneticLinkProps) {
  const reducedMotion = useReducedMotionPreferred()
  const isTouchOnly = useTouchOnly()
  const disabled = reducedMotion || isTouchOnly

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, SPRING)
  const springY = useSpring(y, SPRING)

  const ref = useRef<HTMLAnchorElement>(null)

  function handleMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    if (disabled) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.hypot(dx, dy)
    const reach = Math.max(rect.width, rect.height) / 2 + radius
    if (dist === 0 || dist > reach) {
      x.set(0)
      y.set(0)
      return
    }
    const scale = Math.min(dist / reach, 1)
    x.set((dx / dist) * maxOffset * scale)
    y.set((dy / dist) * maxOffset * scale)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <Link
      {...linkProps}
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-magnetic
      data-magnetic-disabled={disabled ? 'true' : 'false'}
    >
      {disabled ? (
        children
      ) : (
        <motion.span
          style={{ x: springX, y: springY, display: 'inline-block' }}
        >
          {children}
        </motion.span>
      )}
    </Link>
  )
}
