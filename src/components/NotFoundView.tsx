import { Link } from '@tanstack/react-router'
import { useOpenCommandPalette } from './CommandPaletteController'

export function NotFoundView() {
  const openPalette = useOpenCommandPalette()
  return (
    <main className="min-h-screen bg-bg text-fg px-6">
      <section className="mx-auto max-w-3xl pt-32 pb-32 sm:pt-40">
        <p className="font-mono text-xs uppercase tracking-wide text-muted">404</p>
        <h1 className="mt-3 font-sans font-halbfett tracking-tight text-fg text-4xl sm:text-5xl lg:text-6xl">
          Off the map.
        </h1>
        <p className="mt-6 font-sans font-buch text-base sm:text-lg text-muted max-w-prose leading-relaxed">
          This page isn't here. It may have moved during the rebuild, or it may have
          never existed. Head back to the start, or search for what you're after.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-sm border border-accent/60 px-4 py-2 font-sans font-buch text-sm text-accent transition-colors hover:bg-accent/10 focus-visible:bg-accent/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Take me home →
          </Link>
          <button
            type="button"
            onClick={() => openPalette?.()}
            data-not-found-palette-trigger
            className="inline-flex items-center gap-2 rounded-sm border border-border/60 px-4 py-2 font-sans font-buch text-sm text-muted transition-colors hover:text-fg hover:border-border focus-visible:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <span>Search with</span>
            <span className="font-mono text-xs">⌘K</span>
          </button>
        </div>
      </section>
    </main>
  )
}
