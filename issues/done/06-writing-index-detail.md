# Writing index + detail + empty state

## What to build

Mirror the case-study content-collection pattern for essays at `content/writing/*.mdx`, and ship the routes `/writing` and `/writing/$slug`. The index lists essays reverse-chronologically with title, date, and a short blurb. When the essay collection is empty, `/writing` renders a deliberate, on-brand empty state ("writing soon — follow on [link]") rather than a blank list. The detail route uses the same loader pattern as `/work/$slug`.

## Acceptance criteria

- [x] `content/writing/*.mdx` compiles via the same content pipeline as `/work`
- [x] `/writing` SSRs the reverse-chronological list of essays
- [x] `/writing` renders a designed empty state when the essay collection is empty
- [x] `/writing/$slug` SSRs the matching essay; unknown slug renders a not-found state
- [x] Tests cover: collection parsing for the writing kind, route loader for detail, and the empty-state branch of the index
- [x] At least one fixture essay is committed and visible at `/writing` and `/writing/its-slug`

## Blocked by

- #4 (MDX content collection + /work)

---

## Status note (2026-06-14)

Shipped. The /writing pipeline parallels the /work pipeline rather than generalizing it — the shapes diverge slightly (essays have no `heroImage`), and a generic abstraction designed off two callers tends to over-fit. The DRY-it-now move was wrong here; the DRY-it-when-a-third-kind-shows-up move is better. Easy to refactor later.

What landed:

- **Collection** (`src/lib/content/writing.ts`) — `Essay { slug, title, date, excerpt, tags, Body }` plus `EssaySummary` (loader-safe, no `Body`). `getEssays()` reverse-chrono, `getEssay(slug)`, `getEssaySummaries()`, `resolveEssay(slug)` throws `EssayNotFoundError`. Same eager-glob pattern as `work.ts`.
- **Fixture essay** (`content/writing/the-leg-between-lab-and-field.mdx`) — short on-brand essay on what helps movement-science findings survive the trip from lab to field. Dated 2025-10-08 with full frontmatter (title, date, excerpt, tags).
- **Routes** — replaced the slice-#03 stub `writing.index.tsx` with the real `/writing/` route (loader returns essay summaries, view consumes them). Added `writing.$slug.tsx` with the same loader pattern as `work.$slug.tsx` (resolve → strip Body → return summary; component re-resolves the full essay at render for the MDX body; `EssayNotFoundError` → `notFound()`). Filename conventions: `writing.index.tsx` + `writing.$slug.tsx` so they're siblings under root rather than parent-child (same lesson learned in #04 — parent-without-Outlet swallows the child render).
- **SEO heads** — `writingHead.ts` for the index (og:type=website), `writingPostHead.ts` for each essay (og:type=article + article:published_time).
- **Empty state** — `<WritingEmptyState />` inside `WritingIndexView` renders when `essays.length === 0`. Copy: "Writing soon. Follow along on X until the first essay lands here." Dormant in production while the fixture is committed; exercised by an explicit `essays={[]}` test.
- **vite.config.ts** — extracted `discoverContentSlugs(dir)` (was `discoverWorkSlugs`); both `/work/$slug` and `/writing/$slug` paths are now enumerated into the `tanstackStart({ pages })` prerender list. Build emits 9 static pages (was 8).

Tests: 81 passing across 17 files. New since #05:
- `src/lib/content/writing.test.ts` (8) — parsed shape, slug derivation, reverse-chrono sort, excerpt fallback, `getEssay` null path, `getEssaySummaries` excludes `Body`, `resolveEssay` round-trip, `EssayNotFoundError` on miss
- `src/components/WritingIndexView.test.tsx` (5) — list rendering with link hrefs, order preservation, excerpts visible, **empty-state branch** (asserts the empty-state element + the X link inside it), no list role when empty
- `src/components/WritingPostView.test.tsx` (5) — title, datetime attribute, MDX body render, tag chips present, no list when tags empty
- `src/lib/seo/writingHead.test.ts` (4) — title/desc, canonical, og cluster, twitter cluster
- `src/lib/seo/writingPostHead.test.ts` (5) — derived title, excerpt-present / excerpt-empty branches, og:type=article + article:published_time, canonical to essay URL

Verified in prerendered HTML:
- `/writing/index.html` contains the essay title `The leg between lab and field`, its excerpt fragment (`movement-science findings`), the link `href="/writing/the-leg-between-lab-and-field"`, the `<title>Writing — Melvin Onyia</title>`, and the canonical to `/writing`.
- `/writing/the-leg-between-lab-and-field/index.html` contains the post title, the MDX body text (`chain of custody is brittle`), `<title>The leg between lab and field — Melvin Onyia</title>`, `og:type=article`, `article:published_time=2025-10-08`, and the canonical to the essay URL.

The empty-state branch lives in code but isn't visible on the live site as long as a fixture exists. Removing all `content/writing/*.mdx` would surface it.

## Deferred

- A future slice will likely want a real `/writing` listing layout (tag filtering, year grouping) — current implementation is the same minimal list `/work` uses.
- Generalizing `work.ts` + `writing.ts` into a single `createMdxCollection({ glob, kind })` helper is a candidate refactor once a third content kind appears.
