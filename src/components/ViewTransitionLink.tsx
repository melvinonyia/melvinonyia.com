import { Link, useNavigate } from '@tanstack/react-router'
import type { ComponentProps, CSSProperties, MouseEvent, ReactNode } from 'react'
import { useCallback } from 'react'
import { useReducedMotionPreferred } from '~/lib/motion/usePointerCapabilities'

type LinkProps = ComponentProps<typeof Link>
type NavigateFn = ReturnType<typeof useNavigate>
type NavigateOptions = Parameters<NavigateFn>[0]

interface ViewTransitionLinkProps {
  to: string
  params?: Record<string, string>
  search?: Record<string, unknown>
  hash?: string
  replace?: boolean
  className?: string
  style?: CSSProperties
  children?: ReactNode
  name?: string
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
  'aria-label'?: string
  'aria-current'?: React.AriaAttributes['aria-current']
  activeOptions?: unknown
  activeProps?: unknown
}

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

export function ViewTransitionLink({
  children,
  name,
  style,
  onClick,
  ...rest
}: ViewTransitionLinkProps) {
  const navigate = useNavigate()
  const reducedMotion = useReducedMotionPreferred()

  const handleClick = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event)
      if (event.defaultPrevented) return
      if (event.button !== undefined && event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
      if (reducedMotion) return
      const start = getStartViewTransition()
      if (!start) return
      event.preventDefault()
      const navOptions = {
        to: rest.to,
        params: rest.params,
        search: rest.search,
        hash: rest.hash,
        replace: rest.replace,
      } as NavigateOptions
      start(() => {
        void navigate(navOptions)
      })
    },
    [navigate, onClick, reducedMotion, rest],
  )

  const mergedStyle: CSSProperties | undefined = name
    ? { ...style, viewTransitionName: name }
    : style

  const dataAttrs = name ? { 'data-view-transition-name': name } : {}

  return (
    <Link
      {...(rest as unknown as LinkProps)}
      onClick={handleClick as unknown as LinkProps['onClick']}
      style={mergedStyle}
      {...dataAttrs}
    >
      {children}
    </Link>
  )
}
