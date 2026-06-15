# MDX content collection + /work index + /work/$slug

## What to build

Stand up the content pipeline. MDX files placed under a content root (e.g. `content/work/*.mdx`) are compiled at build time into a typed collection exposing title, slug, date, excerpt, tags, hero image, and the rendered body. The collection is the single source of truth that every content-driven route consumes.

Implement two routes against it: `/work` lists all case studies in reverse-chronological order with title, date, and excerpt; `/work/$slug` renders an individual case study, looking up by slug via a TanStack Start route loader that throws a typed not-found for missing slugs.

Ship with one or two real fixture case studies (placeholder content is fine) so the routes have something to render and tests have something to assert against.

## Acceptance criteria

- [ ] MDX loader integrated with Vite; `.mdx` files in `content/work/` compile at build time
- [ ] Content collection module exports a typed list of case studies with frontmatter and body
- [ ] `/work` SSRs the list, sorted reverse-chronologically
- [ ] `/work/$slug` SSRs the matching case study; unknown slug renders a not-found state (404 styling lands in a later slice)
- [ ] Content collection seam tested with fixture `.mdx` files: parsed shape, slug derivation, sorting, excerpt fallback
- [ ] Route loader seam tested: returns the expected post or a typed not-found
- [ ] At least one fixture case study is committed and visible at `/work` and `/work/its-slug`

## Blocked by

- #1 (Bootstrap)
