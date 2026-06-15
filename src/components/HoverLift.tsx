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

const LIFT_AMOUNT = -2

const SPRING: Transition = { type: 'spring', stiffness: 320, damping: 26 }

const variants = {
  rest: { y: 0 },
  hover: { y: LIFT_AMOUNT },
}

const ruleVariants = {
  rest: { opacity: 0 },
  hover: { opacity: 1 },
}

export function HoverLift({ children, className }: HoverLiftProps) {
  const reducedMotion = useReducedMotionPreferred()
  const isTouchOnly = useTouchOnly()

  const wrapperClass = `relative ${className ?? ''}`.trim()

  if (reducedMotion || isTouchOnly) {
    return (
      <div
        className={wrapperClass}
        data-hover-lift
        data-reduced-motion={reducedMotion ? 'true' : 'false'}
        data-touch-only={isTouchOnly ? 'true' : 'false'}
      >
        {children}
        <span data-hover-rule aria-hidden="true" />
      </div>
    )
  }

  return (
    <motion.div
      className={wrapperClass}
      data-hover-lift
      data-reduced-motion="false"
      data-touch-only="false"
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      variants={variants}
      transition={SPRING}
    >
      {children}
      <motion.span
        data-hover-rule
        aria-hidden="true"
        variants={ruleVariants}
        transition={SPRING}
      />
    </motion.div>
  )
}
