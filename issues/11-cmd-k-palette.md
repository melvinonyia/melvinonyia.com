# Cmd-K palette + build-time search indexer

## What to build

Implement the global command palette. ⌘K (or Ctrl-K) opens a modal palette anywhere on the site. The palette lists routes, case studies, essays, external links (GitHub, LinkedIn, X), and a contact action. Fuzzy matching by title and excerpt. Keyboard-first: arrow keys navigate, Enter selects, Esc closes, mouse supported as a courtesy.

A build-time step produces a JSON search index from the content collection (entries: kind, title, slug, excerpt, tags). The palette loads the index lazily on first open and holds it in memory.

The palette honors `prefers-reduced-motion: reduce` (no open/close animation; instant). The header's existing ⌘K visual hint (from slice #3) wires up to open the palette on click.

## Acceptance criteria

- [ ] Build-time indexer produces a JSON index from the content collection
- [ ] Indexer covered by a unit test: fixture content in, asserted search hits out (exact, fuzzy, miss)
- [ ] Global `Meta+K` / `Ctrl+K` opens the palette; Esc closes it; clicking the header hint opens it
- [ ] Search results: routes, case studies, essays, external links, contact action
- [ ] Arrow keys move selection; Enter activates the selected item; mouse supported
- [ ] Index is lazy-loaded on first open (not in initial bundle)
- [ ] Reduced-motion users see no open/close animation
- [ ] Palette is keyboard-trap-correct: focus enters on open, exits on close
- [ ] RTL tests: open/close, keyboard nav, search filtering

## Blocked by

- #4 (MDX content collection + /work)
- #6 (Writing index + detail)
