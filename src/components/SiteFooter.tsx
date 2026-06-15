import { Link } from '@tanstack/react-router'
import { SocialLinks } from './SocialLinks'
import { useOpenCommandPalette } from './CommandPaletteController'

interface SiteFooterProps {
  year: number
}

const monoLabel =
  'font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-fg focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'

export function SiteFooter({ year }: SiteFooterProps) {
  const openPalette = useOpenCommandPalette()
  return (
    <footer className="border-t border-border/40 mt-24">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-6 py-6 sm:flex-row sm:items-center sm:gap-6">
        <span className={`${monoLabel} text-fg`}>© {year} Melvin Onyia</span>

        <div className="flex items-center gap-6">
          <SocialLinks />
          <Link to="/legal" className={monoLabel}>
            Legal
          </Link>
          <button
            type="button"
            onClick={() => openPalette?.()}
            aria-label="Open command palette"
            aria-keyshortcuts="Meta+K"
            data-palette-trigger
            className={`hidden sm:inline-flex ${monoLabel}`}
          >
            <span aria-hidden="true">⌘K</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
