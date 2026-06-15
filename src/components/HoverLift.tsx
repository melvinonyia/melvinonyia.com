import { motion, type Transition } from 'motion/react'
import type { ReactNode } from 'react'
import {
  useReducedMotionPreferred,
  useTouchOnly,
} from '~/lib/motion/usePointerCapabilities'

interface HoverLiftProps {
  children: ReactNode
  className?: string
}

const LIFT_AMOUNT = -4
const LIFTED_SHADOW = '0 10px 30px -10px rgba(0, 0, 0, 0.55)'
const PRESSED_SCALE = 0.985

const SPRING: Transition = { type: 'spring', stiffness: 320, damping: 26 }
const INSTANT: Transition = { duration: 0 }

export function HoverLift({ children, className }: HoverLiftProps) {
  const reducedMotion = useReducedMotionPreferred()
  const isTouchOnly = useTouchOnly()

  const hoverState = isTouchOnly
    ? undefined
    : { y: LIFT_AMOUNT, boxShadow: LIFTED_SHADOW }
  const tapState = isTouchOnly ? { scale: PRESSED_SCALE } : undefined
  const transition = reducedMotion ? INSTANT : SPRING

  return (
    <motion.div
      whileHover={hoverState}
      whileFocus={hoverState}
      whileTap={tapState}
      transition={transition}
      className={className}
      data-hover-lift
      data-reduced-motion={reducedMotion ? 'true' : 'false'}
      data-touch-only={isTouchOnly ? 'true' : 'false'}
    >
      {children}
    </motion.div>
  )
}
