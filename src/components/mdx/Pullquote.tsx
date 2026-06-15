import type { ReactNode } from 'react'

interface PullquoteProps {
  children: ReactNode
  attribution?: string
}

export function Pullquote({ children, attribution }: PullquoteProps) {
  return (
    <blockquote data-pullquote className="mdx-pullquote">
      {children}
      {attribution && (
        <footer className="mdx-pullquote-attribution">— {attribution}</footer>
      )}
    </blockquote>
  )
}
