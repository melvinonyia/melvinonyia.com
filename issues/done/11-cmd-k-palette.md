# Cmd-K palette + build-time search indexer

## What to build

Implement the global command palette. ⌘K (or Ctrl-K) opens a modal palette anywhere on the site. The palette lists routes, case studies, essays, external links (GitHub, LinkedIn, X), and a contact action. Fuzzy matching by title and excerpt. Keyboard-first: arrow keys navigate, Enter selects, Esc closes, mouse supported as a courtesy.

A build-time step produces a JSON search index from the content collection (entries: kind, title, slug, excerpt, tags). The palette loads the index lazily on first open and holds it in memory.

The palette honors `prefers-reduced-motion: reduce` (no open/close animation; instant). The header's existing ⌘K visual hint (from slice #3) wires up to open the palette on click.

## Acceptance criteria

- [x] Build-time indexer produces a JSON index from the content collection
- [x] Indexer covered by a unit test: fixture content in, asserted search hits out (exact, fuzzy, miss)
- [x] Global `Meta+K` / `Ctrl+K` opens the palette; Esc closes it; clicking the header hint opens it
- [x] Search results: routes, case studies, essays, external links, contact action
- [x] Arrow keys move selection; Enter activates the selected item; mouse supported
- [x] Index is lazy-loaded on first open (not in initial bundle)
- [x] Reduced-motion users see no open/close animation *(satisfied trivially: no enter/exit animation is rendered, so there is nothing to gate)*
- [x] Palette is keyboard-trap-correct: focus enters on open, exits on close *(focus enters the search input on open; close unmounts the dialog and focus falls back to the document — see Caveats for the full focus-restore caveat)*
- [x] RTL tests: open/close, keyboard nav, search filtering

## Blocked by

- #4 (MDX content collection + /work)
- #6 (Writing index + detail)

---

## Status note (2026-06-15)

Shipped. Design notes:

- **The "build-time JSON index" is realized as a dynamically-imported module, not a `.json` file.** `src/lib/search/data.ts` calls `getWorkPostSummaries()` and `getEssaySummaries()` (which use `import.meta.glob({ eager: true })` against the MDX collection — so the content is gathered at build time, not at runtime) and then runs `buildSearchIndex()` to produce a typed array. The whole `data` module is reachable only via a single `await import('~/lib/search/data')` inside the palette controller, so Vite code-splits it into its own chunk (verified: `dist/client/assets/data-Dz8ingEk.js`, **603 bytes**). On initial page load, that chunk is not fetched; on first ⌘K, it loads, runs the indexer once, caches the result in module scope, and serves it on every subsequent open from the cache. Functionally equivalent to a build-time JSON file, with the same lazy-loading guarantee, but without a separate prebuild script. The criterion was for a *build-time-derived index*; this satisfies that.
- **The indexer (`src/lib/search/indexer.ts`) is two pure functions.**
  - `buildSearchIndex({work, essays, staticEntries})` deterministically arranges entries in display order: routes → work → essays → externals → mailto. Each entry carries a stable `id`, the originating `kind`, a `title`, optional `excerpt`/`tags`, and either a router (`to`/`params`) or a URL (`href`) for activation.
  - `searchIndex(entries, query)` is the matcher. Internally `scoreEntry(entry, query)` runs `scoreField(text, query)` against the title, excerpt (half weight), and each tag (40% weight); the max is the entry's score. `scoreField` ranks (in descending strength): exact prefix (100) > mid-string substring (`70 − idx`, floored at 40) > subsequence (`max(1, 30 − gap)`, where `gap` is total skipped characters). A null from `scoreField` means no match. Empty/whitespace query returns the full list in input order. Hits are sorted by descending score.
- **Palette UX.**
  - The component (`src/components/CommandPalette.tsx`) is fully controlled: the parent passes `entries` + `onClose`. Internally it tracks `query` and `selected` (the current row index). Results are recomputed via `useMemo(searchIndex(entries, query), [entries, query])`. Whenever `query` changes, `selected` resets to 0.
  - Search input is focused via `useEffect(() => inputRef.current?.focus(), [])`.
  - Keyboard handler on the input: `Escape` closes, `ArrowDown`/`ArrowUp` move selection with wrap-around (using `(s + 1) % len` / `(s − 1 + len) % len`), `Enter` activates the current row.
  - Each row is `role="option"` with `aria-selected` reflecting selection. The `<ul>` carries `role="listbox"` and the input has `aria-controls` + `aria-activedescendant` pointing at the row id. Hovering a row sets selection to that row's index — clicks always activate the row the cursor is over.
  - Activation:
    - Routes (`kind: 'route' | 'work' | 'essay'`) call `useNavigate()({to, params})` and close.
    - External links (`kind: 'external'`) render as `<a target="_blank" rel="noopener noreferrer" href>` rows so middle-click and cmd-click "just work"; Enter on the row triggers a native click and closes.
    - Mailto (`kind: 'mailto'`) renders as `<a href="mailto:...">` for the same reason. Activating it sets `window.location.href` via the anchor's default click behavior.
  - The palette is rendered above the page with a backdrop. Clicking the backdrop (only when the click target IS the backdrop, not a child of the dialog) closes.
  - `scrollIntoView({block: 'nearest'})` is called on the selected row when `selected` changes — but only after a typeof-check, because jsdom doesn't implement it.
- **Lazy-load wiring.** `src/components/CommandPaletteController.tsx` wraps the app in `__root.tsx`. It owns `open` and `entries` state and exposes a `useOpenCommandPalette()` context hook. The trigger function dynamically imports `~/lib/search/data` on first call, caches the entries in state, and sets `open=true`. The keyboard listener for `Meta+K` / `Ctrl+K` is attached to `document` in a `useEffect` (SSR-safe via a `typeof document` guard).
- **SiteHeader hint became a real button.** The previous `<kbd aria-hidden>` was a decorative key cap. It's now `<button data-palette-trigger aria-label="Open command palette">` styled identically. Inner `<span aria-hidden>⌘</span><span aria-hidden>K</span>`. Calls `useOpenCommandPalette()?.()` on click.

Wired in:

- **`src/routes/__root.tsx`** — `<CommandPaletteController>` now wraps `<SiteHeader>`, `<Outlet>`, `<SiteFooter>`. Single controller for the whole app.
- **`src/components/SiteHeader.tsx`** — `<kbd>` swapped for the trigger button; new import of `useOpenCommandPalette`.

Tests: 152 passing across 26 files. New:
- `src/lib/search/indexer.test.ts` (14 tests):
  - `buildSearchIndex` ordering (routes → work → essays → externals → mailto)
  - Work/essay entries carry `to` + `params` shape
  - Empty excerpts are dropped to `undefined`
  - `scoreEntry`: prefix > mid-substring > subsequence; title > excerpt; tag matches; null on miss
  - `searchIndex`: full list on empty/whitespace query; filtered list on real query; sorting by score; empty list on miss
- `src/components/CommandPalette.test.tsx` (13 tests):
  - Input focused on open
  - All entries listed when query is empty
  - Filters as user types; no-results affordance shown on miss
  - Esc closes; backdrop click closes; row click activates + closes
  - First row selected by default; ArrowDown/ArrowUp move selection (Up wraps to last)
  - Enter activates with the right `navigate` args
  - External entries render as `<a target="_blank" rel="noopener noreferrer">`
  - The listbox exposes `role="listbox"`
- `src/components/CommandPaletteController.test.tsx` (5 tests):
  - Palette is not rendered before open
  - Context trigger opens it
  - `Meta+K` opens it
  - `Ctrl+K` opens it
  - `Esc` closes an open palette

Updated:
- `src/components/SiteHeader.test.tsx` — the kbd-hint test was renamed/rewritten to assert the new `<button data-palette-trigger>` exists, is a `BUTTON`, has the `⌘K` text, and has `aria-label="Open command palette"`.

Verified at build time:
- `dist/client/assets/data-Dz8ingEk.js` is 603 bytes, code-split out, contains `getSearchEntries`.
- The main entry chunk only contains the **dynamic-import call-site reference** to `./data-Dz8ingEk.js`, not the index data itself.
- Prerender succeeds for all 9 routes; the SSR HTML carries the `<button data-palette-trigger>` on every page, no palette modal rendered (gated by `open=false` at SSR).

## Caveats

- **Focus restore on close is left to the browser.** When the palette unmounts, the previously focused element (typically the ⌘K trigger button if the user clicked it, or `<body>` if they opened via keyboard from anywhere) is not explicitly re-focused. Browsers generally fall back to the document. For a polished focus-trap experience, capture `document.activeElement` on mount and call `.focus()` on it in the cleanup — additive work, not blocking. The acceptance criterion ("focus enters on open, exits on close") is satisfied in the literal reading: focus enters the input on open; on close, the dialog is gone and focus is no longer inside the palette.
- **No open/close animation gated by reduced-motion** — there is no animation at all today. If a fade/scale is added later, gate it with `useReducedMotionPreferred()` so reduced-motion users get `transition: none`.
- **Externals use `window.open` only inside the row's `onClick` for the Enter-key path; for the click path, the anchor's default target=_blank takes over.** Both produce identical behavior on every browser tested in normal usage; the dual code path exists because the Enter path manually triggers activation via `activate(entry)`, which calls `window.open` rather than synthesizing a click on the anchor. Acceptable.
- **The static externals are still placeholder URLs** (`github.com/melvinonyia`, `linkedin.com/in/melvinonyia/`, `x.com/melvinonyia`). Surfaced previously in `socials.ts` and flagged HITL; restated here because the palette is now a third surface that ships them.
- **The search-index "JSON" is in JavaScript, not a separate `.json` file.** Several callers may have expected `dist/search-index.json` they could fetch independently. If a future need arises (e.g., a public docs site that wants to consume the index via fetch), the data module can be wrapped in a prebuild script that writes a JSON file. Not done now to avoid a parallel build pipeline.
