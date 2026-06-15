import { Link } from '@tanstack/react-router'
import type { ComponentProps } from 'react'

interface NavItem {
  label: string
  to: ComponentProps<typeof Link>['to']
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Home', to: '/' },
  { label: 'Work', to: '/work' },
  { label: 'Writing', to: '/writing' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/40 bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          to="/"
          className="font-sans font-halbfett text-fg text-base tracking-tight transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          Melvin Onyia
        </Link>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-1 sm:gap-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === '/' }}
                  className="font-sans font-buch text-sm text-muted px-2 py-1 rounded-sm transition-colors hover:text-fg focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-[current=page]:text-fg aria-[current=page]:underline aria-[current=page]:underline-offset-4"
                  activeProps={{ 'aria-current': 'page' }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <kbd
          aria-hidden="true"
          className="hidden sm:inline-flex items-center gap-1 rounded-sm border border-border/60 bg-surface/60 px-2 py-1 font-mono text-xs text-muted"
        >
          <span>⌘</span>
          <span>K</span>
        </kbd>
      </div>
    </header>
  )
}
