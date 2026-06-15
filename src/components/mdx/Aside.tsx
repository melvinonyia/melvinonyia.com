import type { ReactNode } from 'react'

interface AsideProps {
  children: ReactNode
  label?: string
}

export function Aside({ children, label }: AsideProps) {
  return (
    <aside data-aside className="mdx-aside">
      {label && <p className="mdx-aside-label">{label}</p>}
      {children}
    </aside>
  )
}
