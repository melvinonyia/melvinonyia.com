# Nav + footer + About page

## What to build

Implement the persistent header navigation and footer that appear across every route, plus the `/about` page. The header carries links to Home, Work, Writing, About, Contact and a Cmd-K hint (visual only at this stage — the palette ships in a later slice). The footer carries social links (GitHub, LinkedIn, X), a copyright line, and a small legal anchor. The About page renders a short bio, the same social links cluster, and a Contact CTA.

Navigation uses plain `<a>` / TanStack `<Link>` for now — magnetic behavior arrives in a later slice. Active-route indication is keyboard-and-screen-reader friendly.

## Acceptance criteria

- [x] Header component rendered on every route with nav items: Home / Work / Writing / About / Contact
- [x] Header shows a visual "⌘K" hint (non-interactive)
- [x] Footer rendered on every route with GitHub / LinkedIn / X icons, copyright, and a legal link stub
- [x] `/about` SSRs a short bio, social cluster, and a contact CTA linking to `/contact`
- [x] Active nav link has both a visual indicator and `aria-current="page"`
- [x] Keyboard tab order through nav and footer is sensible; focus rings visible
- [x] Head snapshot test for `/about`

## Blocked by

- #1 (Bootstrap)

---

## Status note (2026-06-14)

Shipped. Stack:

- **`SiteHeader`** (`src/components/SiteHeader.tsx`) — sticky, backdrop-blurred header with a wordmark link to `/`, primary nav (Home / Work / Writing / About / Contact), and a non-interactive `<kbd>⌘K</kbd>` hint chip (hidden on mobile). Nav uses TanStack `<Link>` with `activeProps={{ 'aria-current': 'page' }}` so a screen reader hears the active route, and a Tailwind `aria-[current=page]:` selector paints the visual underline + foreground color. Home uses `activeOptions.exact = true` so it isn't lit on `/work`; the other items use the default prefix match so /work stays lit on /work/$slug.
- **`SiteFooter`** (`src/components/SiteFooter.tsx`) — bordered footer with a `SocialLinks` cluster on the left and a `© {year} Melvin Onyia` line plus a `/legal` anchor on the right. Year is passed in as a prop so prerender is deterministic (no `new Date()` call at render time).
- **`SocialLinks`** (`src/components/SocialLinks.tsx`) — reusable component reading from `src/lib/site/socials.ts`. Inline SVG icons for GitHub, LinkedIn, X (no icon-library dep). Each anchor has `target="_blank"` + `rel="noreferrer noopener"`, visible focus ring, and a hidden-by-default text label that the AboutView can choose to show.
- **`AboutView` + `/about` route** — 3-paragraph bio at the intersection of biomechanics and engineering, social cluster (with visible labels here), and a "Get in touch →" CTA linking to `/contact`. `aboutHead` factory emits title, description, canonical, OG (with `og:type=profile`), Twitter card.
- **Chrome wired in `src/routes/__root.tsx`** — `SiteHeader` + `<Outlet />` + `SiteFooter` so every route (current and future) inherits the chrome without per-route plumbing.

Stub routes added so the nav links resolve cleanly (no 404 during prerender, no crawler error):

- `src/routes/contact.tsx` — placeholder pointing to `melvin.onyia@gmail.com`. Replaced wholesale in slice #12.
- `src/routes/writing.index.tsx` — placeholder pointing to X. Replaced wholesale in slice #06.
- `src/routes/legal.tsx` — minimal legal notice with the same email. Permanent; the spec calls for a legal stub.

Stubs are prerendered too — added to the `tanstackStart({ pages })` list in `vite.config.ts`.

Tests: 49 passing across 11 files. New since #04:
- `src/components/SiteHeader.test.tsx` (4) — five nav items in order; correct hrefs; non-interactive `⌘K` kbd; wordmark links home
- `src/components/SiteFooter.test.tsx` (4) — three socials; target/rel for external links; copyright year prop; legal href
- `src/components/AboutView.test.tsx` (4) — heading; bio mentions biomechanics; socials present; contact CTA href
- `src/lib/seo/aboutHead.test.ts` (4) — title, canonical, og:type=profile, twitter cluster

Verified in prerendered HTML: every page (`/`, `/about`, `/contact`, `/writing`, `/legal`, `/work`, `/work/movement-fingerprint`, `/work/gait-lab-toolkit`) contains the nav + footer + `aria-current="page"` exactly once. `/about` HTML contains the right title, canonical, `og:type=profile`, and "Get in touch" CTA.

## HITL follow-ups

Social URLs in `src/lib/site/socials.ts` are best-guess placeholders (`github.com/melvinonyia`, `linkedin.com/in/melvinonyia`, `x.com/melvinonyia`). **Verify and update** before the first public link to the site — broken socials would burn first impressions.

Manual keyboard sweep (the "sensible tab order, focus rings visible" criterion) was code-reviewed against the implementation (visible `:focus-visible` outlines on the wordmark, every nav item, every social anchor, the Legal anchor, and the Contact CTA; tab order follows DOM order which matches reading order). Real manual sweep lives in slice #16 alongside the Playwright pass.
