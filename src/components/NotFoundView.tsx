import { Link } from '@tanstack/react-router'
import { useOpenCommandPalette } from './CommandPaletteController'

const monoLabel = 'font-mono text-xs uppercase tracking-wider text-muted'

export function NotFoundView() {
  const openPalette = useOpenCommandPalette()
  return (
    <main className="min-h-screen px-6">
      <section className="mx-auto max-w-6xl pt-24 pb-32 sm:pt-32 lg:pt-40">
        <h1
          className="font-serif text-fg leading-[0.92] tracking-tight"
          style={{ fontSize: 'clamp(4rem, 14vw, 12.5rem)' }}
        >
          404
        </h1>
        <p className={`mt-8 ${monoLabel}`}>Page not found — try ⌘K</p>
        <p
          data-not-found-subtitle
          className="mt-10 font-serif text-fg text-3xl sm:text-4xl lg:text-5xl tracking-tight"
        >
          Off the map.
        </p>
        <p className="mt-6 font-sans font-buch text-base sm:text-lg text-muted max-w-prose leading-relaxed">
          This page isn't here. It may have moved during the rebuild, or it may
          have never existed. Head back to the start, or search for what you're
          after.
        </p>
        <div className="mt-12 flex flex-wrap items-baseline gap-6">
          <Link
            to="/"
            className="font-serif text-fg text-2xl sm:text-3xl tracking-tight transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
          >
            Take me home →
          </Link>
          <button
            type="button"
            onClick={() => openPalette?.()}
            data-not-found-palette-trigger
            data-palette-trigger
            aria-label="Open command palette"
            aria-keyshortcuts="Meta+K"
            className={`${monoLabel} transition-colors hover:text-fg focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent`}
          >
            <span aria-hidden="true">Search with ⌘K</span>
          </button>
        </div>
      </section>
    </main>
  )
}
