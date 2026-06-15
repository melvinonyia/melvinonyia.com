# Redesign: editorial-typographic v2.1 (Pentagram × Rauno blend)

## Problem Statement

melvinonyia.com v2 is technically sound — five routes live, SSR + streaming, MDX pipeline with `<Demo />` islands, the "alive" component library, Playwright + Lighthouse gates green — but the visual design reads as bland and indistinguishable from any other competent personal site. A recruiter scanning the homepage gets a legible identity block but no signal of craft beyond the words on the page; an Awwwards judge would have nothing to screenshot. The site does not currently earn the typographic gravitas Melvin's writing and case studies deserve, and the work surface (case studies) and voice surface (writing) read in the same visual register, which flattens the distinction between making and thinking.

## Solution

A full visual + layout redesign that keeps the IA, routes, content pipeline, and engineering primitives untouched, and pivots the surface into an editorial-typographic register inspired by Pentagram (editorial gravitas — display serif, visible grid furniture, datelines) and rauno.me (engineer-precise micro-motion, monochrome discipline). A display serif is added for the home name, page titles, essay titles, and pull-quotes; Söhne keeps body; Berkeley Mono keeps labels and datelines. The palette splits per route: the work surface (`/`, `/work`, `/work/$slug`, `/contact`, error pages) lives on refined near-black with a warm brick accent; the voice surface (`/writing`, `/writing/$slug`, `/about`) lives on warm cream paper. The home becomes a single oversized serif name with a numbered editorial index below the fold; `/work` becomes a scroll of full-bleed editorial spreads; `/writing` becomes a serif masthead over a dated rule-divided essay list. The signature gesture is a serif-title morph view transition from the home index into the case-study page header, and a top-to-bottom palette wipe when crossing the dark↔paper boundary, both via the View Transitions API. The motion library trims to one idiom — `HoverLift` retuned as a typographic rule reveal — and retires `MagneticLink` and `CursorSpotlight` with their tests.

## User Stories

1. As an Awwwards judge scanning the home, I want a single typographic moment that makes the page memorable within three seconds, so that the site stands out against a field of generic portfolios.
2. As a recruiter, I want Melvin's name to dominate the home in display serif, so that I register identity immediately rather than scanning for a header.
3. As a recruiter, I want role and one-line pitch to read as a mono dateline beside or below the name, so that I get the credentials block without it competing with the name.
4. As a recruiter, I want the three case studies on the home to read as a numbered editorial index (01, 02, 03) below the fold, so that I understand the featured work without parsing a card grid.
5. As a recruiter hovering a case-study row, I want a thin brick rule and a subtle title shift, so that I get tactile confirmation the row is clickable without busy motion.
6. As a recruiter clicking a case-study row, I want the row's serif title to morph into the case-study page's title, so that navigation feels continuous and the type identity carries across.
7. As a recruiter hitting back, I want the morph to reverse, so that I return to the home without a jarring cut.
8. As a recruiter on any page, I want a thin masthead at the top with the name on the left and mono route labels on the right, so that primary navigation is visible without competing with the hero.
9. As a recruiter or peer engineer, I want a `⌘K` affordance in the masthead, so that I learn the keyboard navigation exists.
10. As a recruiter on `/work`, I want each case study as a full-bleed editorial spread with serif title, mono dateline, and hero image, so that proof-of-work is visually unambiguous.
11. As a recruiter on a case-study detail, I want the index number, serif title, mono dateline (client / role / year), and a full-bleed hero image at the top, so that I orient before reading.
12. As a peer engineer, I want inline interactive demos to keep working inside case studies and essays, so that the alive-content payoff is preserved through the redesign.
13. As a peer engineer navigating from a dark route into `/writing`, I want the body palette to wipe from dark to paper, so that I register that I've crossed into the publication surface.
14. As a peer engineer on `/writing`, I want a serif `WRITING` masthead with a mono subtitle, so that the page reads as a publication front-matter rather than a list page.
15. As a peer engineer on `/writing`, I want a dated, rule-divided essay list with date mono on the left, serif title, and a Söhne excerpt, so that scanning feels like a journal index.
16. As a peer engineer when zero essays exist, I want a deliberate empty state (`Issue — in preparation` or similar) on paper, so that the page reads as intentional rather than broken.
17. As a peer engineer reading an essay, I want the body set at a generous measure (~68ch) in Söhne with comfortable line-height, so that long-form is pleasant.
18. As a peer engineer reading an essay, I want pull-quotes in display serif and asides in mono, so that emphasis breaks the body rhythm cleanly.
19. As a peer engineer pressing `⌘K`, I want a centered palette with a mono input and serif item titles, so that the typographic identity carries into the search overlay.
20. As a peer engineer in CmdK, I want the active row to show a brick left-edge rule rather than a background fill, so that focus is precise and quiet.
21. As a peer engineer in CmdK, I want the backdrop to adopt the current route's palette with a blur, so that the overlay reads as continuous with the page beneath.
22. As a recruiter on `/about`, I want the page to feel like a magazine colophon on paper, so that the "who is this person" answer reads as an editorial bio.
23. As a recruiter on `/about`, I want a small mono links cluster (GitHub, LinkedIn, X, email) with a brick hover rule, so that I can reach Melvin in one click.
24. As a recruiter on `/contact`, I want a serif page title and a mono-labelled form with hairline-underline inputs, so that the form reads as deliberate not template.
25. As a recruiter who submits the form, I want acknowledgement and error states in the same typographic language, so that the experience stays coherent.
26. As a visitor on a touch device, I want the retired cursor-driven effects to be absent rather than half-broken, so that the site does not feel like a desktop site stuck on mobile.
27. As a visitor with `prefers-reduced-motion: reduce`, I want the serif morph and the dark↔paper wipe to degrade to instant navigation, so that nothing animates.
28. As a visitor with `prefers-reduced-motion: reduce`, I want the HoverLift rule-reveal to fall back to a static brighter rule, so that hover still gives visible feedback without motion.
29. As a visitor using a screen reader, I want the masthead, case-study index rows, CmdK results, and form fields to keep correct roles, labels, and keyboard handlers, so that the site is operable without sight.
30. As a visitor on a browser without the View Transitions API, I want navigation to fall back to a clean instant page change, so that nothing visibly breaks.
31. As a visitor on slow hardware, I want the redesign to keep Lighthouse Performance ≥ 95 on desktop, so that first paint stays fast despite the typographic richness.
32. As a visitor landing on a 404 or 500 page, I want the error styled in the new aesthetic (serif error code, mono dateline, return-home link), so that the dead end stays on-brand.
33. As Melvin authoring an essay, I want the existing MDX workflow (a new `.mdx` file in the repo) to surface the essay in the new `/writing` masthead + list and in CmdK on next build, so that publishing remains just a commit.
34. As Melvin authoring a case study, I want the existing `<Demo />` wrapper to keep working inside the new full-bleed spread layout, so that inline interactive demos survive the redesign.
35. As Melvin maintaining the site, I want `MagneticLink` and `CursorSpotlight` removed with their tests, so that the alive library reduces to one motion idiom plus the signature morph.
36. As Melvin maintaining the site, I want the display serif self-hosted and preloaded with the same discipline as Söhne and Berkeley Mono, so that the font payload stays bounded.
37. As Melvin maintaining the site, I want the warm brick accent declared once as a CSS custom property and a Tailwind theme token, so that one place defines the accent across both palettes.
38. As Melvin maintaining the site, I want the paper palette declared as a token block parallel to the dark palette, so that route-driven palette switching is a data decision rather than a forked stylesheet.
39. As Melvin maintaining the site, I want `prd-site-v2.md` amended after the redesign ships (retiring CursorSpotlight + MagneticLink, adding the display serif, documenting per-route palette), so that future contributors do not reinstate retired primitives from the old spec.
40. As Melvin shipping the redesign, I want all five routes to land in the new aesthetic at the same time, so that the surface area is established at once rather than added in piecemeal updates that disrupt the visitor's mental model of the site.

## Implementation Decisions

### Aesthetic direction

- Editorial-typographic lane. Pentagram × Rauno blend: editorial gravitas (display serif, visible grid-furniture rules at meaningful boundaries, datelines as decoration) layered onto engineer-precise restraint (monochrome discipline, tight micro-motion, mono labels). Restrained motion budget; no kinetic-type, no WebGL.

### Type system

- Add one display serif for hero, page titles, essay titles, pull-quotes, CmdK item titles, and large numerals. Candidates: GT Super Display, Tiempos Headline, Editorial New. Final pick deferred to a pre-implementation step gated on contrast on both palettes, licensing cost, and total payload at the weights used.
- Söhne stays for body and long-form prose. Berkeley Mono stays for masthead labels, datelines, mono kind tags, mono form labels, mono accents.
- All three faces self-hosted with `preload` hints; weights restricted to what is actually used.

### Palette

- Two named palettes declared as parallel CSS custom property blocks (one default, one keyed by an attribute such as `data-palette="paper"`):
  - **dark** — background ~`#0A0A0B` (warm-tinted near-black), foreground warm off-white, accent `#D87C4A` (warm brick).
  - **paper** — background warm cream, foreground near-black, accent `#D87C4A` (same brick, contrast-verified separately).
- Palette is selected per route, mapped in the root layout: `/`, `/work`, `/work/$slug`, `/contact`, error pages → dark; `/writing`, `/writing/$slug`, `/about` → paper.
- Accent contrast verified to WCAG AA on both palettes for every use case that presents text (active CmdK row, link hover rule, focus ring); if any use case fails, the use case is dropped, not the accent.

### Layout / grid

- Container is an invisible 12-col grid with consistent gutters across all routes.
- Hairline rules drawn only at meaningful boundaries: under the masthead, between case-study index rows on home, between essay list rows on `/writing`, under section headings, framing case-study spreads on `/work`. No full visible column rules.

### Per-route layout

- **`/` (home)** — oversized serif name as the page (`clamp(96px, 14vw, 200px)`), mono role/pitch dateline beneath, numbered editorial case-study index below the fold (`01`, `02`, `03`, serif titles, one-line mono descriptions, year). No images on the home; CursorSpotlight retired.
- **`/work`** — vertical scroll of full-bleed editorial spreads. Each spread: serif project title, mono dateline (CLIENT — ROLE — YEAR), full-bleed hero image, one-paragraph teaser in Söhne. Spread title is the View Transitions morph target back to the home index.
- **`/work/$slug`** — top region: index number (mono) + serif title (morph target, the same element that left the home/`/work` index) + mono dateline + full-bleed hero image. Body is the existing MDX pipeline with inline `<Demo />` islands.
- **`/writing`** — paper. Top: serif `WRITING` masthead with mono subtitle/issue marker. Body: dated rule-divided essay list — date in mono on the left, serif title, Söhne excerpt, year/issue marker. Empty state reads as intentional ("Issue — in preparation" or equivalent).
- **`/writing/$slug`** — paper. Top: essay index (`No. 03`) + serif title + mono dateline (DATE — READ TIME — TOPIC). Body in Söhne at ~18–20px, ~68ch measure, line-height ~1.6. Pull-quotes in display serif, asides in mono. No drop cap, no hero image, single column.
- **`/about`** — paper, magazine-bio register. Serif `ABOUT` title, 2–3 paragraph bio at essay measure, mono dateline (current role + location), mono links cluster (GitHub / LinkedIn / X / email) with brick hover rule, serif contact CTA linking to `/contact`.
- **`/contact`** — dark. Serif `CONTACT` title, Söhne intro, mono-labelled form with hairline-underline inputs (no boxed inputs), mono uppercase submit with brick hover rule. Acknowledgement and error states use the same typographic language.
- **`/404`, `/500`** — adopt the parent context's palette (default dark). Serif error code, mono dateline, return-home link in the typographic language.

### Masthead (`SiteHeader`)

- Thin compact bar (~48px). Name top-left in Berkeley Mono ~12px (`MELVIN ONYIA`). Route labels right-aligned in mono uppercase (`WORK` / `WRITING` / `ABOUT` / `CONTACT`). `⌘K` hint right-edge. Hairline rule beneath. Adopts current route's palette.

### Footer (`SiteFooter`)

- Derives from the masthead language: mono name, minimal links cluster, `⌘K` hint. Hairline top rule. Same palette behavior as the masthead.

### Motion library

- `HoverLift` retained but rewritten as a typographic rule reveal: hovering a row brightens a thin brick rule and shifts the title a few px in a spring; CSS-only fallback under `prefers-reduced-motion`.
- `MagneticLink` and `CursorSpotlight` retired — source and test files deleted, all callsites updated.
- Signature gesture: serif morph via the existing `ViewTransitionLink` seam — home index row title morphs to `/work/$slug` page title (and reverse on back). When the View Transitions API is absent, instant navigation.
- Dark↔paper palette wipe via the View Transitions API on navigation into and out of paper routes (`/writing`, `/writing/$slug`, `/about`). Top-to-bottom wipe, ~280ms, ease-out. Crossfade or instant fallback when the API is absent.

### CmdK (`CommandPalette`)

- Centered panel ~640px wide. Mono input with brick caret. Result rows: serif item title + mono kind tag (`WORK` / `ESSAY` / `EXTERNAL`) right-aligned + mono shortcut hint. Active row has a brick left-edge rule (no background fill). Backdrop is the current palette background at ~70% opacity with a blur. Keyboard-first behavior (`ArrowUp` / `ArrowDown` / `Enter` / `Esc`) unchanged.

### PRD coherence

- `prd-site-v2.md` is the historical v1 spec and stays in the repo. This issue is the v2.1 redesign spec. After the redesign ships, `prd-site-v2.md` is amended in a follow-up commit to strike through the retired primitives, add the display serif to the type stack, and document the per-route palette decision.

## Testing Decisions

### What makes a good test

- Tests assert external behavior — rendered DOM content, accessible roles and labels, copy, route-level navigation, keyboard handlers, fallback paths under `prefers-reduced-motion` and missing-API conditions.
- Tests do NOT assert exact colors, font families, pixel sizes, motion timings, or screenshot pixel equivalence. Those are implementation details that should be free to evolve through visual iteration.

### Component tests (Vitest + React Testing Library)

Highest seam = each component's public render API. Existing `*.test.tsx` files are kept and amended; new assertions cover the redesign:

- **`HoverLift`** — rule rendered, hover/focus-visible state applies the brightened class/attribute, `prefers-reduced-motion` path uses a CSS-only fallback (no Motion-driven animation hook is invoked).
- **`SiteHeader`** — name + route labels rendered, `⌘K` hint rendered with correct `aria-keyshortcuts`, an attribute on the root reflects current route's palette so downstream tokens resolve.
- **`SiteFooter`** — mirrors the header coverage shape.
- **`Hero`** — serif name rendered, mono dateline rendered, no CursorSpotlight subtree present.
- **`HomeFeatureSection`** (or replacement) — renders numbered index rows; each row has the `ViewTransitionLink` semantics + a stable element identity that can serve as the view-transition target.
- **`WorkIndexView`** — renders each case-study spread block with title, dateline, image `alt`; renders correctly with zero/one/many case studies; spread title element carries the view-transition target attribute.
- **`WorkPostView`** — top region renders index number, serif title (the morph landing element), mono dateline; MDX body region remains.
- **`WritingIndexView`** — masthead rendered, dated list rendered, empty-state copy renders when zero essays.
- **`WritingPostView`** — essay number + serif title + mono dateline; body region renders.
- **`AboutView`** — bio paragraphs, mono links cluster, palette attribute = paper.
- **`ContactForm`** — form semantics unchanged (it's still a `<form>`), labelled-by associations correct, acknowledgement and error states render with the right copy.
- **`CommandPalette`** — result rows render serif title + mono kind tag; `ArrowDown` / `ArrowUp` / `Enter` / `Esc` behaviors preserved; active row carries `aria-selected` or a data attribute for the brick-rule highlight.
- **`ViewTransitionLink`** — existing tests retained; one new assertion that under `prefers-reduced-motion` or when `document.startViewTransition` is undefined, navigation completes without invoking the transition API.

`CursorSpotlight.test.tsx` and `MagneticLink.test.tsx` are deleted alongside their source.

SSR `<head>` snapshot tests for OG, canonical, and title remain unchanged — the redesign does not touch routing or metadata.

### Playwright (route-level)

Two existing specs are extended:

- **`smoke.spec.ts`** — assert each route loads, the masthead is present on every route, and the route's palette is reflected by an attribute (e.g. `data-palette` on `<html>`) split correctly between dark and paper routes.
- **`reduced-motion.spec.ts`** — navigating from home to `/work/$slug` under `prefers-reduced-motion` does not invoke the serif morph (the view-transition mechanism is bypassed and navigation completes instantly). Navigating from `/` to `/writing` under reduced-motion completes the palette change instantly.

The live serif morph and dark↔paper wipe are verified manually plus via the existing `npm run smoke:prod` smoke pass against the deployed site.

### Lighthouse

`lighthouserc.json` gate stays in CI with the existing Performance ≥ 95 desktop floor (per slice #16). Adding the display serif must not breach the floor — `preload` hints, restricted weights, and `font-display: optional` or `swap` (decided at implementation) are the levers.

### Prior art

- Component test patterns mirror existing `Hero.test.tsx` and `CommandPalette.test.tsx` shape (render + role/label + behavior assertions).
- Playwright assertions mirror the existing per-route iteration pattern in `smoke.spec.ts`.

## Out of Scope

- IA / route additions, removals, or restructure. The five-route surface is preserved.
- A user-toggled light/dark theme switcher. Palette is per-route, not user-controlled.
- Custom cursor.
- Portrait image on `/about`.
- Any 3D, WebGL, or Three.js work.
- Content/copy rewrites. The redesign reformats existing content; copy edits are handled separately.
- Per-essay two-column body.
- Drop cap on essay openers.
- Visual regression / screenshot testing — deliberately not added. The typographic redesign is expected to iterate visually, and screenshot diffs would create churn without protecting against bugs the existing seams miss.
- Animation-event assertions for the serif morph or palette wipe. Live transitions are verified manually + via reduced-motion fallback only.
- Hand-designed open-graph images. The existing OG pipeline carries over unchanged.
- Changes to the MDX content pipeline, the content collection module, or the `<Demo />` wrapper API.

## Further Notes

- **Display serif final pick** is a pre-implementation gate. Candidates: GT Super Display, Tiempos Headline, Editorial New. Decision criteria: contrast on both palettes at display sizes, licensing cost compatible with self-hosting, total payload at the weights actually used.
- **Case-study hero imagery** is required for the full-bleed `/work` spread layout — the repo currently has none. Producing or sourcing imagery is in scope of this redesign but happens out-of-band of the code work; the layout is built with placeholder fills that can be swapped in.
- **WCAG AA contrast check** for `#D87C4A` against both palette backgrounds (and against warm off-white text where the accent is used as a text color) is the first concrete pre-implementation task. If a use case fails, that use case is dropped — the accent is not changed.
- **View Transitions API support** across Firefox and older Safari is incomplete as of the redesign's authoring date. Fallback paths (instant nav, crossfade) are part of the spec, not an afterthought, and are covered by the reduced-motion Playwright suite.
- **PRD amendment follow-up**: after the redesign ships, `prd-site-v2.md` is updated in a separate commit to strike CursorSpotlight + MagneticLink from the interaction primitives list, add the display serif to the type stack, and document the per-route palette decision. This avoids future contributors reinstating retired primitives from the old spec.
- **Slice plan**: this issue is the PRD. Implementation is expected to land as a sequence of tracer-bullet slices mirroring the existing `01–17` cadence (e.g. tokens + display serif → masthead + footer → home hero + index → `/work` spreads → `/work/$slug` morph → `/writing` paper palette + masthead → `/writing/$slug` body → `/about` + `/contact` → motion library trim → reduced-motion + smoke sweep). Slices live as their own files under `issues/`.
