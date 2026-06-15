import { Link } from '@tanstack/react-router'
import type { ComponentProps } from 'react'
import { useOpenCommandPalette } from './CommandPaletteController'

interface NavItem {
  label: string
  to: ComponentProps<typeof Link>['to']
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Work', to: '/work' },
  { label: 'Writing', to: '/writing' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
] as const

const monoLabel =
  'font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-fg focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent aria-[current=page]:text-fg'

export function SiteHeader() {
  const openPalette = useOpenCommandPalette()
  return (
    <header className="sticky top-0 z-20 border-b border-border/40 bg-bg/80 backdrop-blur supports-[backdrop-filter]:bg-bg/60">
      <div className="mx-auto flex h-12 max-w-6xl items-center justify-between gap-6 px-6">
        <Link to="/" className={`${monoLabel} text-fg`}>
          Melvin Onyia
        </Link>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-4 sm:gap-6">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className={monoLabel} activeProps={{ 'aria-current': 'page' }}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => openPalette?.()}
          aria-label="Open command palette"
          aria-keyshortcuts="Meta+K"
          data-palette-trigger
          className="hidden sm:inline-flex font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-fg focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          <span aria-hidden="true">⌘K</span>
        </button>
      </div>
    </header>
  )
}
