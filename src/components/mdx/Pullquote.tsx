import type { ReactNode } from 'react'

interface PullquoteProps {
  children: ReactNode
  attribution?: string
}

export function Pullquote({ children, attribution }: PullquoteProps) {
  return (
    <blockquote
      data-pullquote
      className="my-12 border-l border-border pl-6 font-serif text-3xl sm:text-4xl leading-tight text-fg"
    >
      {children}
      {attribution && (
        <footer className="mt-4 font-mono text-xs uppercase tracking-wider text-muted">
          — {attribution}
        </footer>
      )}
    </blockquote>
  )
}
