# MDX content collection + /work index + /work/$slug

## What to build

Stand up the content pipeline. MDX files placed under a content root (e.g. `content/work/*.mdx`) are compiled at build time into a typed collection exposing title, slug, date, excerpt, tags, hero image, and the rendered body. The collection is the single source of truth that every content-driven route consumes.

Implement two routes against it: `/work` lists all case studies in reverse-chronological order with title, date, and excerpt; `/work/$slug` renders an individual case study, looking up by slug via a TanStack Start route loader that throws a typed not-found for missing slugs.

Ship with one or two real fixture case studies (placeholder content is fine) so the routes have something to render and tests have something to assert against.

## Acceptance criteria

- [x] MDX loader integrated with Vite; `.mdx` files in `content/work/` compile at build time
- [x] Content collection module exports a typed list of case studies with frontmatter and body
- [x] `/work` SSRs the list, sorted reverse-chronologically
- [x] `/work/$slug` SSRs the matching case study; unknown slug renders a not-found state (404 styling lands in a later slice)
- [x] Content collection seam tested with fixture `.mdx` files: parsed shape, slug derivation, sorting, excerpt fallback
- [x] Route loader seam tested: returns the expected post or a typed not-found
- [x] At least one fixture case study is committed and visible at `/work` and `/work/its-slug`

## Blocked by

- #1 (Bootstrap)

---

## Status note (2026-06-14)

Shipped. Stack:

- **MDX pipeline**: `@mdx-js/rollup` + `remark-frontmatter` + `remark-mdx-frontmatter` wired into `vite.config.ts` as a `pre`-enforced plugin so `.mdx` transforms run before the router and React plugins. YAML frontmatter is parsed and exposed as a `frontmatter` named export from each module.
- **Collection module** at `src/lib/content/work.ts`:
  - `getWorkPosts()` — eager-globs `/content/work/*.mdx`, returns sorted (reverse-chrono) array of `WorkPost { slug, title, date, excerpt, tags, heroImage, Body }`
  - `getWorkPostSummaries()` — same minus `Body`, used by loaders so loader data stays serializable (avoids a seroval crash; `Body` is re-resolved at render via `getWorkPost(slug)`)
  - `resolveWorkPost(slug)` — throws `WorkNotFoundError` for unknown slugs; the route loader catches it and rethrows as TanStack's typed `notFound()`
- **Routes**:
  - `src/routes/work.index.tsx` (`/work/`) — list page using `WorkIndexView`
  - `src/routes/work.$slug.tsx` (`/work/$slug`) — detail page using `WorkPostView` (renders MDX body)
  - Naming: had to use `work.index.tsx` (not `work.tsx`) so `/work` and `/work/$slug` are siblings under the root rather than parent/child — the parent variant suppresses the child render unless the parent renders an `<Outlet />`.
- **SEO**: `workHead.ts` and `workPostHead.ts` per-route head factories. Detail page uses `og:type=article` + `article:published_time` from frontmatter; canonicals point to the right URL.
- **Prerender**: `vite.config.ts` discovers content slugs from `./content/work` at config-load time and enumerates `/work/$slug` paths into the `tanstackStart({ pages })` config. Build emits 4 static HTMLs: `/`, `/work`, `/work/movement-fingerprint`, `/work/gait-lab-toolkit`.

Fixtures shipped under `content/work/`:
- `movement-fingerprint.mdx` (Nov 2025, full frontmatter — excerpt + tags + heroImage)
- `gait-lab-toolkit.mdx` (Aug 2025, minimal frontmatter — no excerpt, exercises the fallback path)

Tests: 33 passing across 7 files. New since #02:
- `src/lib/content/work.test.ts` (8) — parse shape, slug derivation, reverse-chrono sort, excerpt fallback, lookup, `resolveWorkPost` throws on miss
- `src/lib/seo/workHead.test.ts` (4) — title/desc, canonical, og cluster, twitter cluster
- `src/lib/seo/workPostHead.test.ts` (6) — derived title, excerpt-present / excerpt-empty branches, article og:type + published_time, hero-image absolutization + fallback, canonical
- `src/components/WorkIndexView.test.tsx` (4) — list shape, order preservation, excerpt-present / excerpt-empty branches, link href
- `src/components/WorkPostView.test.tsx` (5) — title, datetime attribute, MDX body render, tag chips present / absent

Verified in prerendered HTML:
- `/work/index.html` contains both post titles + both `/work/$slug` hrefs.
- `/work/movement-fingerprint/index.html` contains the title `Movement fingerprint engine — Melvin Onyia`, og:type=article, article:published_time=2025-11-12, canonical=`https://melvinonyia.com/work/movement-fingerprint`, and the MDX body text (`streaming pipeline that ingests…`).
- `/work/gait-lab-toolkit/index.html` contains its title, canonical (no leakage from the index route), and body text (`gait-lab marker-set conversion…`).

Deferred to later slices:
- Visual styling polish for case-study cards lives in slice #07 (HoverLift).
- Real 404 styling for missing slugs lives in slice #14.
