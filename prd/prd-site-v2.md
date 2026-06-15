# PRD — melvinonyia.com v2

> **v2.1 amendments** (applied by the editorial-typographic redesign — see `prd/prd-site-redesign.md`):
>
> - **Theme**: dark-only is replaced by a per-route palette — dark for `/`, `/work`, `/work/$slug`, `/contact`, error pages; warm cream paper for `/writing`, `/writing/$slug`, `/about`. Both palettes declared as parallel CSS custom property blocks keyed by `data-palette` on `<html>`. Switched per route in `__root.tsx`; cross-palette navigation runs a top-to-bottom wipe via the View Transitions API.
> - **Type stack**: gains **Editorial New** as the display serif (hero name, page titles, essay titles, pull-quotes). Söhne stays for body; Berkeley Mono stays for labels/datelines.
> - **Interaction primitives**: `<MagneticLink>` and `<CursorSpotlight>` retired. `<HoverLift>` retuned as a typographic rule reveal. `<ViewTransitionLink>` and `<CmdK>` continue. The signature gesture is the serif-title morph from the home index to `/work/$slug` page header.

## Problem Statement

A recruiter or hiring manager evaluating Melvin for a senior/staff IC role lands on melvinonyia.com today and sees a competent-but-generic Next.js portfolio. There is no signal in the first 30 seconds that distinguishes him from any other engineer with a personal site: the homepage does not assert a current role or a pitch, the work is buried behind navigation, and nothing about the interaction model communicates craft. A peer engineer landing on the site to read his writing has to dig past nav and category pages before reading anything. Both audiences leave without a strong impression.

Melvin, as the author, also has no place to publish a long-form case study that includes the kind of inline, interactive demonstration that would best convey the depth of his work — the current site renders posts as static HTML only.

## Solution

A from-scratch rebuild of melvinonyia.com as a precision-craft site that reads as a meticulously assembled app rather than a document. The home asserts identity in one breath (name, current role, one-line pitch) and surfaces three case-study cards and the most recent essay above the fold. Every interactive element responds under the cursor with restrained motion — magnetic pull on links, a subtle hover lift on cards, a cursor-following spotlight on the hero — and navigating between routes morphs the relevant card into the next page's hero via the View Transitions API. A keyboard-first Cmd-K palette gives the visitor instant access to any case study, essay, or contact action.

Case studies and essays are authored in MDX, allowing Melvin to embed real interactive React demos inside long-form posts, which is the single largest payoff of the "alive" framing inside content itself.

The site ships dark-only, in Söhne (sans) and Berkeley Mono (mono), on Vite + TanStack Start (SSR with streaming), deployed to Vercel. Lighthouse 95+ desktop is the floor; every interaction degrades gracefully under `prefers-reduced-motion`.

## User Stories

1. As a recruiter scanning the home page on desktop, I want to see Melvin's name, current role, and one-line pitch above the fold, so that I can decide within five seconds whether to keep reading.
2. As a recruiter, I want to see three proof-of-work case-study cards on the home page, so that I can click into a representative project without learning a navigation system.
3. As a recruiter, I want to see the title and excerpt of Melvin's latest essay on the home page, so that I get a free read on how he thinks.
4. As a recruiter, I want hovering a case-study card to lift it subtly and brighten its border, so that I get tactile feedback that confirms it is clickable.
5. As a recruiter, I want clicking a case-study card to morph the card into the case-study page's hero via a view transition, so that the navigation feels continuous rather than a hard page swap.
6. As a recruiter who hits the back button after reading a case study, I want the morph to reverse, so that I land back on the home with no jarring cut.
7. As a recruiter, I want a Contact link in the nav and footer, so that I can reach Melvin without searching.
8. As a recruiter, I want the contact form to send Melvin a message and acknowledge receipt, so that I know my outreach landed without leaving the site.
9. As a recruiter on a flaky network, I want the contact form to tell me clearly when submission fails, so that I do not assume it succeeded.
10. As a peer engineer arriving from a shared link, I want the page to load with usable content under 2 seconds on broadband, so that I do not bounce.
11. As a peer engineer, I want to press Cmd-K (or Ctrl-K) and search across all case studies, essays, and external links, so that I can navigate the site like an app.
12. As a peer engineer in the Cmd-K palette, I want arrow-key navigation and Enter to open, so that I never need to touch the mouse.
13. As a peer engineer in the Cmd-K palette, I want fuzzy matching on titles and excerpts, so that imprecise queries still find the right item.
14. As a peer engineer reading a case study, I want inline interactive React demos (e.g. a small simulation, a tweakable visualization) to work without leaving the page, so that I understand the work at a deeper level than a screenshot would convey.
15. As a peer engineer, I want inline demos to lazy-load and not block first paint of the prose, so that the reading experience stays fast.
16. As a peer engineer who clicks an essay slug shared on social, I want the open-graph image, title, and description to render correctly in the unfurl, so that the link looks intentional.
17. As a peer engineer, I want the writing page to list essays in reverse chronological order with title, date, and short blurb, so that I can scan and pick.
18. As a visitor on a touch device (phone or tablet), I want all the interactions that depend on a cursor (magnetic links, hover lifts, cursor spotlight) to be replaced with appropriate touch-friendly equivalents or simply omitted, so that the site does not feel broken.
19. As a visitor with `prefers-reduced-motion: reduce` set, I want all motion (view transitions, hover lifts, spotlight, Cmd-K animation) to degrade to instant state changes, so that the site does not cause discomfort.
20. As a visitor using a screen reader, I want every interactive primitive (Cmd-K, magnetic links, custom focus states) to expose correct ARIA roles, labels, and keyboard handlers, so that the site is operable without sight.
21. As a visitor on slow hardware, I want the cursor spotlight to throttle or disable gracefully, so that I do not see jank on the hero.
22. As a visitor who lands on `/blog/some-old-post` (a URL from the previous site), I want a clean 404 page in the new site's design, so that the dead end is at least on-brand.
23. As a visitor on the 404 page, I want a Cmd-K hint and a link back to home, so that I can recover.
24. As a visitor on the writing index when there are zero essays published, I want a deliberate empty state ("writing soon — subscribe / follow") rather than a blank list, so that the page does not read as broken.
25. As a visitor on the work index when only one case study exists, I want the page to read intentionally sparse rather than under-built, so that the curation feels deliberate.
26. As a visitor on the about page, I want a short bio, current role, a small links cluster (GitHub, LinkedIn, X), and contact CTA, so that I have one canonical "who is this person" page.
27. As a visitor sharing the homepage on Slack/Twitter/LinkedIn, I want a hand-designed open-graph image to render in the unfurl, so that the share looks crafted.
28. As Melvin authoring a new essay, I want to add a new `.mdx` file to the repo and have it appear in the writing index and the Cmd-K palette on next build, so that publishing is just a commit.
29. As Melvin authoring a new case study, I want to embed a custom React component (a `<Demo />` wrapper) inside the MDX, so that I can ship interactive examples without bespoke per-post code.
30. As Melvin reading my own contact form submissions, I want them delivered to my email with rate-limiting and basic spam protection in front, so that the inbox stays usable.
31. As Melvin maintaining the site, I want a single dark theme rather than dual light/dark, so that I do not multiply design and review effort.
32. As Melvin measuring the site, I want anonymous Vercel Analytics on every page, so that I can see what content gets read without inflicting a cookie banner on visitors.
33. As Melvin maintaining the site, I want the codebase in a fresh single-purpose repo (no Nx), so that the build/deploy/test loop is uncluttered.
34. As Melvin shipping v1, I want to launch with all five routes live (home, work, writing, about, contact) even if writing content is sparse, so that the surface area is established and not added in piecemeal updates that disrupt navigation.

## Implementation Decisions

### Architecture

- **Fresh repo, single-purpose**: a new GitHub repo (`melvinonyia/site-v2` or equivalent), not added to the existing `melvinonyia/apps` Nx monorepo. Rationale: no libs to share with content-service/public-client, and Nx adds cost with no payoff on a one-app project.
- **Vite + React + TanStack Start (SSR with streaming)** as the app framework. Routes are file-based via TanStack Router; SSR gives first-paint content for the recruiter scan and crawlers, streaming gives an app-shell feel.
- **No database, no CMS**. Content is MDX in the repo; the build pipeline produces the typed post collection at build time.
- **Deploy target: Vercel** for both the app and Vercel Analytics. No Neon, no Postgres, no Payload.

### Page surface (v1)

Five routes, all live at launch:
- `/` — Home: sparse hero (name, role, pitch), three case-study cards, latest essay preview.
- `/work` — case-study index.
- `/work/$slug` — case-study detail.
- `/writing` — essay index. Deliberate empty state if zero essays.
- `/writing/$slug` — essay detail.
- `/about` — bio, links cluster, contact CTA.
- `/contact` — contact form.

(Plus `/404` and `/500` styled to match the rest of the site.)

### Content pipeline

- **MDX in repo**, processed at build time by a Vite plugin (e.g. `@mdx-js/rollup` + a frontmatter loader).
- **Content collection module** exposes a typed list of posts and case studies, sorted by date, with parsed frontmatter (title, slug, date, excerpt, tags, hero image, related links). Route loaders consume this module.
- **Inline interactive demos**: a single `<Demo />` MDX component wraps any per-post React island. The wrapper lazy-loads via `React.lazy` and renders a placeholder until in-view to keep first paint fast. One pattern, used by every case study; no per-post bespoke loading.

### Design system

- **Theme**: ~~dark only.~~ ([amended in v2.1](#) — per-route palette: dark for work surfaces, paper for `/writing` + `/about`.) CSS custom properties for tokens (color, spacing, type, motion easings/durations), declared at `:root`; paper palette declared under `[data-palette="paper"]`. No user-toggled theme switcher.
- **Type**: Söhne (sans), Berkeley Mono (mono), and ~~_no display serif in v1_~~ **Editorial New** (display serif, [added in v2.1](#)), all self-hosted and preloaded. Font weights restricted to what's actually used (Buch + Halbfett for sans, Regular for mono, Regular for serif) to keep payload small.
- **Tailwind v4** with the CSS-first `@theme` directive, tokens mirrored from the CSS custom properties. Used in markup; raw CSS still allowed for component-level micro-state work.

### Interaction primitives

Implemented as a small set of reusable wrappers (treated as the "alive" component library):

- ~~**`<MagneticLink>`** — wraps `<a>` or `<button>`. Listens for `mousemove` within an opt-in radius (default 40px), translates the child with a spring-damped offset, releases on `mouseleave`. Disables on touch and `prefers-reduced-motion`.~~ ([retired in v2.1](#) — every callsite migrated away; component + tests deleted.)
- **`<HoverLift>`** — ~~applies a small Y translation + shadow change on `:hover` and `:focus-visible`.~~ ([retuned in v2.1](#) — now a typographic rule reveal: a 1px rule fades in on hover/focus + a 2px Y shift via spring.) CSS-only when reduced-motion is set, otherwise spring-damped via Motion.
- ~~**`<CursorSpotlight>`** — used on the home hero. A radial gradient driven by two CSS custom properties (`--mx`, `--my`) updated by a throttled (rAF) `mousemove` handler scoped to the hero element. No global pointer tracking. Disabled on touch and reduced-motion.~~ ([retired in v2.1](#) — replaced by the serif-title morph as the signature gesture; component + tests deleted.)
- **`<ViewTransitionLink>`** — a Link wrapper that uses the View Transitions API to morph the source element into the destination route's hero. Falls back to a normal navigation when the API is absent or reduced-motion is set.
- **`<CmdK>`** — a global command palette. Bound to ⌘K / Ctrl-K. Loads the search index lazily on first open. Items: routes, case studies, essays, external links, contact actions. Keyboard-first; mouse supported.

**Motion stack**: Motion (the Framer Motion successor) for layout and spring physics; raw CSS transitions for the ~90% of micro-state changes that do not need a physics engine.

~~**Custom cursor is explicitly out** of v1. Cursor spotlight stays.~~ ([amended in v2.1](#) — both retired; the serif morph is the signature.)

### Search / Cmd-K indexer

A build-time step produces a JSON search index from the content collection (title, slug, excerpt, tags, kind). The index is loaded on first Cmd-K open and held in memory. Fuzzy matching via a small library (e.g. fuse.js or a hand-rolled trigram match — the wrapper interface should make this swappable).

### Contact form

A POST route handler at `/api/contact` (Vercel function):

- Validates body (name, email, message, honeypot).
- Rate-limits by IP using an in-memory or KV store (Vercel KV optional; if simpler, an Upstash Redis or a header-based cap is fine).
- Sends mail via a transactional provider (Resend recommended).
- Returns a typed JSON result; the form component renders success/failure inline without a full page reload.

### SEO and OG

- Every route renders correct `<title>`, `<meta name="description">`, canonical link, and OG tags via TanStack Start's head management.
- **OG images are static, hand-designed in Figma**, one per major page, committed to `/public/og/`. Not generated dynamically.
- `robots.txt` + `sitemap.xml` generated at build time from the route list and content collection.

### Analytics

- **Vercel Analytics** only. Cookieless / no banner needed. Web Vitals tracked via Vercel Speed Insights.

### URL handling and migration

- **No migration** from public-client. Old `/blog/*`, `/work/*`, `/links`, `/press`, `/stack` URLs return 404 in the new site.
- The 404 page is on-brand and surfaces Cmd-K and a Home link.
- Domain cutover: deploy to a staging Vercel URL, verify, then point `melvinonyia.com` DNS at the new deployment and decommission the public-client deploy.

### Quality bar

- **Lighthouse desktop**: Performance ≥ 95, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95.
- **Lighthouse mobile**: ≥ 90 on the same axes.
- **`prefers-reduced-motion: reduce`** disables view transitions, the cursor spotlight, magnetic pull, and HoverLift spring; replaces them with instant state changes. Cmd-K and navigation remain fully functional.
- **Touch devices**: cursor spotlight and magnetic pull are no-ops; HoverLift becomes an active-state press.

## Testing Decisions

A good test in this codebase exercises external behavior at the highest reasonable seam and is robust to internal refactors. We do not test motion easings, exact pixel offsets, color values, Tailwind class composition, or any animation timing. We do test that interactions are *operable*, that content arrives at the right route, that accessibility affordances are present, and that the contact path delivers a message end-to-end.

Seven seams:

1. **Content collection seam** — the MDX loader / collection module. Test by placing fixture `.mdx` files under a test content root and asserting the parsed shape (frontmatter fields, slug derivation, date sorting, excerpt fallback when frontmatter omits it). Pure function tests, no React.
2. **Route loader seam** — TanStack Start route loaders (e.g. the `/work/$slug` loader) called directly with a stub content layer. Asserts that the loader returns the expected post or throws a typed not-found that the route can render as a 404.
3. **Cmd-K indexer seam** — the build-time indexer function. Fixture content collection in, asserted search hits out for a set of representative queries (exact match, fuzzy near-match, miss). Indexer is a pure function.
4. **Interaction primitive seam** — ~~`<MagneticLink>`,~~ `<HoverLift>`, `<ViewTransitionLink>`, `<CmdK>` ([+ `<RoutePaletteSync>` in v2.1](#)) tested with React Testing Library. Assertions: renders children, correct ARIA roles/labels/keyboard handlers, honors a mocked `matchMedia('(prefers-reduced-motion: reduce)')` by becoming a no-op wrapper. We do NOT assert easings, pixel positions, or that a spring "feels right".
5. **Playwright smoke for the alive loop** — a thin end-to-end pass covering: home loads with content above the fold, Cmd-K opens on `Meta+K`, fuzzy search returns hits, Enter navigates to the selected route, navigating between home and a case study does not break (with or without view transitions)~~, magnetic link click targets the correct route under a synthetic offset~~. Runs against the production build.
6. **SSR head snapshot seam** — per-route, render the page to string and snapshot the `<head>`. Asserts title, canonical, OG tags, sitemap link. Catches regressions when route metadata drifts.
7. **Contact form route handler seam** — the `/api/contact` function tested with request fixtures: valid submission succeeds, honeypot-filled submission silently 200s, oversized body rejects, rate limit triggers after N attempts. Email provider is mocked at the boundary.

**Prior art**: this is a fresh repo so there is no in-codebase prior art yet. The closest in-tree reference is the existing `public-client` test suite under `apps/apps/public-client/__tests__/` (Jest + React Testing Library); the new repo will use the same library family (RTL) with Vitest as the test runner (Vite-native) and Playwright for the end-to-end seam.

## Out of Scope

- Migrating any content from public-client (blog posts, project pages, resume page).
- Redirecting any old URLs (everything outside the v1 surface returns 404).
- A `/stack`, `/press`, `/links`, `/now`, or `/search` page.
- Light theme, theme switcher, or multi-theme.
- A custom cursor (cursor spotlight stays; cursor replacement does not).
- Scroll-driven reveal animations, audio feedback, 3D / WebGL content.
- A headless CMS (Sanity, Payload, Contentful) and any database (Neon, Postgres).
- The existing Nx monorepo: this app is not added to it.
- Newsletter signup, comments on posts, RSS reader UI (RSS feed itself may be in v1 — see Further Notes).
- Calendly / booking embed on contact.
- PostHog or other event-tracking analytics; Vercel Analytics only.

## Further Notes

- **RSS feed**: trivial to generate from the content collection. Recommend including in v1 even though no user story asks for it — peers expect it from a writing-bearing site.
- **Söhne and Berkeley Mono licensing**: budget ~$400–500 in font licenses (Söhne web from Klim; Berkeley Mono personal/commercial from U.S. Graphics). Ship behind a `@font-face` declaration with appropriate `unicode-range` and `font-display: swap`.
- **Content is the real blocker**: the build is approximately a weekend; writing one or two real case studies that justify the precision-craft frame is the harder, slower work. Recommend writing the first case study in parallel with the scaffold so the design system has real content to test against.
- **Writing page empty state at launch**: explicitly designed (not a blank list). Acceptable for v1; revisit when the first essay is published.
- **Vercel Analytics opt-in**: Vercel's analytics is cookieless by default; confirm at deploy time that no banner is required for the EU.
- **Open-graph image refresh policy**: static OG images mean each major page has a hand-made card. Adding a new case study or essay does not require a new OG unless it warrants one — the per-section card is the default.
- **Spam protection on contact**: rate-limit + honeypot is the v1 floor. If volume warrants it, add Cloudflare Turnstile later; do not gate launch on this.
