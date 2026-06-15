# SEO head + sitemap + robots + RSS + static OG images

## What to build

Cover the whole metadata + discoverability surface in one pass:

- Per-route `<head>` metadata via TanStack Start's head management: `<title>`, `<meta name="description">`, canonical link, OG title/description/image, Twitter card tags.
- `sitemap.xml` and `robots.txt` generated at build time from the route list and content collection.
- `rss.xml` generated at build time from the writing collection.
- Hand-designed static OG images committed to `/public/og/`: one per major page (home, work, writing, about, contact) and one default for case-study and essay detail routes when no per-post image is specified.

This slice is **HITL**: the OG images require a design pass in Figma before they can be committed.

## Acceptance criteria

- [x] Every route SSRs a correct `<title>`, `<meta name="description">`, canonical link
- [x] Every route SSRs OG title, OG description, OG image, OG type, and Twitter card tags
- [x] `sitemap.xml` generated at build time and served from `/sitemap.xml`
- [x] `robots.txt` generated and served from `/robots.txt`
- [x] `rss.xml` generated from the writing collection and served from `/rss.xml`
- [ ] Static OG PNGs designed in Figma and committed to `/public/og/` for: home, work, writing, about, contact, default-case-study, default-essay — **HITL, see Caveats**
- [x] Per-route head snapshot test asserts the full metadata block
- [x] Sitemap and RSS exercised by unit tests against fixture collections
- [ ] Manual verification: home URL pasted into a Twitter/Slack/LinkedIn unfurl previewer renders the intended OG card — **deferred, see Caveats**

## Blocked by

- #2 (Home hero)
- #4 (MDX content collection + /work)
- #6 (Writing index + detail)

---

## Status note (2026-06-15)

Shipped. Design notes:

- **Per-route head pattern.** Each route's head builder lives in `src/lib/seo/*Head.ts` and is wired into the route's `createFileRoute(...)({head: ...})`. The builders are pure: given no arguments (or, for detail routes, the resolved summary), they return `{ meta, links }`. Every route's head emits:
  - `{ title: '...' }` and `{ name: 'description', content: '...' }`
  - The full Open Graph cluster: `og:title`, `og:description`, `og:type`, `og:url`, `og:image`, `og:site_name`
  - The Twitter cluster: `twitter:card: summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`
  - A `<link rel="canonical" href>` pointing at the route's absolute URL
  - `og:type` is `'website'` for index pages, `'article'` for work/writing detail pages, and `'profile'` for `/about`. (`/legal` is `'website'` plus a `<meta name="robots" content="noindex">` since it's non-content.)
- **What this slice added vs. what already existed.** Before this slice, only `/contact` and `/legal` had minimal heads (title + description + canonical, no OG, no Twitter). Two new builders (`contactHead`, `legalHead`) plus their tests fill those gaps with the same shape as the existing ones. The other six routes (`/`, `/about`, `/work`, `/work/$slug`, `/writing`, `/writing/$slug`) already had full builders from earlier slices; their tests stand.
- **`headContract.test.ts`** is a single parametrized test file that imports all six index-route head builders, runs them once each, and asserts the shape contract: every head declares a non-empty title, a description >10 chars, a canonical link, all six `og:*` properties (with non-empty `content`), and all four `twitter:*` properties. This is the "per-route head snapshot" — the assertion-per-key form, rather than a hash-based snapshot, so failures point at the missing field instead of "snapshot diverged".
- **Sitemap.** `src/lib/seo/sitemap.ts` exports `buildSitemap(entries: {loc, lastmod?}[]) → string` — a pure XML builder. Tests cover: XML declaration well-formedness, one `<url>` per entry, conditional `<lastmod>`, and ampersand/special-char escaping. The `emitSeoArtifactsPlugin` (defined inline in `vite.config.ts`) calls it during `closeBundle` with:
  - Five static routes (`/`, `/about`, `/contact`, `/work`, `/writing`) — `/legal` is excluded because it's `noindex`
  - One entry per work post (`/work/${slug}`) with `lastmod` set to the post's frontmatter `date`
  - One entry per essay (`/writing/${slug}`) with `lastmod` from frontmatter `date`
  Output is written to `dist/client/sitemap.xml`. Verified on disk: 8 `<url>` blocks (5 static + 2 work + 1 essay), lastmod attached to the dynamic ones.
- **RSS.** `src/lib/seo/rss.ts` exports `buildRss(channel, entries)` producing RSS 2.0 with the Atom self-link extension. Each item has `title`, `link`, `guid isPermaLink="true"`, `pubDate` (RFC 822 via `Date.toUTCString()`), and an optional `<description>` (omitted when no excerpt). Channel-level `<lastBuildDate>` reflects the most-recent entry's date. Tests cover all of the above plus XML escaping of titles/links/descriptions.
- **`contentFrontmatter.ts`** is the bridge between the MDX collection (used at runtime by Vite via `import.meta.glob`) and Node-side build scripts. It reads MDX files from disk via `fs.readdirSync` + `fs.readFileSync`, parses the YAML frontmatter block (between `---` markers) with a tiny line-by-line `key: value` extractor (quoted strings unwrapped, comments and blank lines skipped), and returns the entries sorted reverse-chronologically by `date`. Deliberately no `gray-matter`/YAML dep — frontmatter here is flat key/value with strings, which a 20-line regex handles. If frontmatter ever needs nested structures or arrays beyond `tags`, switch to a real YAML parser.
- **Vite plugin.** `emitSeoArtifactsPlugin()` is a thin local plugin with `apply: 'build'` and a `closeBundle` handler. The handler runs after Rollup's bundle is sealed AND after `tanstackStart`'s prerender has emitted its HTML files, so writing sibling files into `dist/client/` is race-free. The plugin is pure I/O — all the XML generation logic lives in `src/lib/seo/sitemap.ts` and `rss.ts` (and is tested there).
- **`robots.txt`** is a static file in `public/`, which Vite copies verbatim to `dist/client/`. It grants `*`, disallows `/legal/` (mirrors the noindex) and `/api/` (prevents discovery of the contact endpoint), and emits a `Sitemap:` directive at the production URL. Confirmed on disk at `dist/client/robots.txt`.

Wired in:

- **`src/routes/contact.tsx`** — replaces the inline `head: () => (...)` with `head: contactHead`.
- **`src/routes/legal.tsx`** — same, using `legalHead` (which adds the `noindex` directive).
- **`vite.config.ts`** — imports the three new SEO modules, defines `SITE_URL` and `STATIC_SITEMAP_ROUTES` constants, adds `emitSeoArtifactsPlugin()` to the plugin chain. The plugin reads content from disk at build time, so the artifacts always reflect the current `content/` tree.

Tests: 276 passing across 34 files. New:
- `src/lib/seo/contactHead.test.ts` (4 tests)
- `src/lib/seo/legalHead.test.ts` (5 tests, including the noindex assertion)
- `src/lib/seo/sitemap.test.ts` (4 tests)
- `src/lib/seo/rss.test.ts` (6 tests)
- `src/lib/seo/headContract.test.ts` — parametrized, 13 assertions × 6 routes = 78 individual cases. Single source of truth for "what every route's head must contain".

Verified at build time:
- `dist/client/sitemap.xml` exists with 8 `<url>` blocks. Static routes appear in declared order; work + writing posts appear with `<lastmod>` matching their frontmatter dates (`2025-11-12`, `2025-08-04`, `2025-10-08`).
- `dist/client/rss.xml` exists with 1 `<item>` (the single essay shipped so far), valid RSS 2.0 + Atom self-link, RFC 822 `pubDate`, correct `lastBuildDate`.
- `dist/client/robots.txt` exists, points at the production sitemap.
- `/contact/index.html` SSRs `og:image=https://melvinonyia.com/og/contact.png`, `twitter:card=summary_large_image`, `canonical=https://melvinonyia.com/contact`, no `<meta robots>`.
- `/legal/index.html` SSRs `og:image=https://melvinonyia.com/og/default.png`, `twitter:card=summary_large_image`, `canonical=https://melvinonyia.com/legal`, `<meta name="robots" content="noindex">`.

## Caveats

- **OG images are HITL and not committed.** This is the central caveat the issue itself flags. The head builders all reference URLs like `https://melvinonyia.com/og/home.png`, `/og/work.png`, `/og/writing.png`, `/og/about.png`, `/og/contact.png`, and `/og/default.png` (used by legal, and as the fallback for work/writing detail routes when no per-post image is specified). The OG references will 404 until the PNGs land in `public/og/`. Until then, Twitter/Slack/LinkedIn unfurls will render with no image — which fails the visual-quality bar but does not break the SSR'd metadata. The user must:
  1. Design seven PNGs in Figma (recommended size: 1200×630, the OG/Twitter convention).
  2. Drop them into `public/og/` with the exact filenames: `home.png`, `work.png`, `writing.png`, `about.png`, `contact.png`, `default.png`, plus `default-essay.png` if you want a separate essay fallback (currently the builders all share `default.png` — change `writingPostHead` if you want it split).
  3. Run `npm run build` and verify the file paths in `dist/client/og/`.
- **Per-post OG images for case studies / essays.** The current pattern uses the OG image from the post's frontmatter `heroImage`, falling back to `/og/default.png` when missing. No per-post images exist in the content collection today, so every detail page currently uses the default OG image. The `WorkPost.heroImage` field is in place; per-post OG support is one-line to add to the detail-head builders once content has the field set.
- **Manual unfurl verification deferred.** The acceptance criterion is correct that real-world validation requires posting the URL into a Twitter/Slack/LinkedIn previewer. That can't happen until (a) the OG PNGs exist, and (b) the site is deployed at a public URL — both downstream of this slice. Flagged for the post-deploy verification pass.
- **Sitemap excludes `/legal` deliberately.** The page is `noindex`; including it in the sitemap would be inconsistent. Crawlers that read both will see the same intent. If you want it discoverable for direct linking, add it to `STATIC_SITEMAP_ROUTES` in `vite.config.ts` and remove the `robots` meta from `legalHead`.
- **RSS feed includes only the writing collection.** Per the issue's "rss.xml generated from the writing collection" clause. Case studies are deliberately excluded — they're treated as portfolio content, not a feed-followable stream. If that changes, add `work` entries to the `buildRss` call in `vite.config.ts`.
- **Frontmatter parser is intentionally minimal.** Supports flat `key: value` lines, optional quotes, comments, blank lines. Does not support nested mappings, multi-line strings, or array literals (e.g., `tags: [a, b, c]`). The site's MDX collection conforms to the flat shape today; the runtime loader uses `remark-mdx-frontmatter` which parses the full YAML grammar. If the two diverge in the future (e.g., a post adds a multi-line `excerpt`), the sitemap/RSS will fall back to the slug as the title. Document; revisit when content shape needs it.
