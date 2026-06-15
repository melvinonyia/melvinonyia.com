import type { ReactNode } from 'react'

interface AsideProps {
  children: ReactNode
  label?: string
}

export function Aside({ children, label }: AsideProps) {
  return (
    <aside
      data-aside
      className="my-8 border-l border-border pl-6 font-mono text-sm leading-relaxed text-muted"
    >
      {label && (
        <p className="mb-2 text-xs uppercase tracking-wider text-fg">{label}</p>
      )}
      {children}
    </aside>
  )
}
