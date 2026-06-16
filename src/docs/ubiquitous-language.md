# Ubiquitous Language — melvinonyia.com

One vocabulary across copy, content frontmatter, components, routes, and CSS tokens. If a term is here, it is the only word for that thing — no synonyms in code or conversation.

**This file is the source of truth.** A new term enters here before it enters code, copy, or a Figma layer. If you find a term in the repo that isn't here, the term is wrong, the doc is wrong, or both — reconcile before shipping.

Three bounded contexts: **Content** (the model), **Mode** (rendering), **Wayfinding** (movement). All three live in one repo and share one model — a **shared kernel**, not integrating systems. There is no translation layer between them, which is exactly why "one term, everywhere" can be absolute rather than aspirational. A handful of terms cross contexts on purpose (Statement is authored Content but rendered on the Masthead; Category fills the Eyebrow) — that's the kernel doing its job, not a leak.

Model roles are tagged inline: **[E]** entity (has identity) · **[VO]** value object (defined by its value, no identity) · **[S]** section (a collection of entities) · **[•]** singleton (exactly one, site-level).

**Out of scope** — empty states, 404, drafts, search, RSS, and analytics naming. They'll join this file when their surfaces are designed.

---

## Content

The published material and its taxonomy. Entities (Piece, Case study) are identified by their **Slug**; everything hanging off them is a value object.

- **Writing** [S] — the collection of Pieces. The umbrella section. Never "Blog."
- **Piece** [E] — one published unit of writing. Identity = Slug. Self-contained aggregate root (references Category by identity; owns its Tags as values). Not "post"/"article"/"entry."
- **Work** [S] — the collection of Case studies.
- **Case study** [E] — one published unit of work. Identity = Slug. Aggregate root. Two words, on purpose: "Case" alone collides with control-flow keywords and reads thin; "Case study" carries the depth signal recruiters parse fast.
- **About** [•] — the singleton About surface; holds the Bio and the Roles list.
- **Slug** [VO] — the URL-identity of a Piece or Case study (`/writing/the-code-was-never-the-hard-part`). Derived from the Title, overridable. Set once and never churned — changing it breaks links.
- **Title** [VO] — the name of a Piece or Case study.
- **Dek** [VO] — the one-to-two-sentence standfirst under a Title. Authored. Journalism jargon, kept on purpose because "subtitle/subhead/description" each smuggle a different assumption. (Not "subtitle"/"subhead"/"description.")
- **Body** [VO] — the long-form content of a Piece.
- **Category** [E] — the single primary classification of a Piece. **Controlled vocabulary**: a closed, curated set — examples include Notes, Essays, Movement science, Mental health, Cognition. Exactly one per Piece. Entity because it owns a filtered index (`/writing/category/[slug]`). Fills the Eyebrow on a Card and on the Piece page header.
- **Tag** [VO] — a fine-grained label. **Open vocabulary**: free, many per Piece, no page of its own. Renders as the foot pills. Never interchangeable with Category.
- **Lead image** [VO] — the principal image of a Piece or Case study. Shown full after the read time in Reading; cropped on a Card. Editorial-print term, used in place of "hero image" so the entity does not collide with the **Masthead** component.
- **Read time** [VO · derived] — estimated reading duration. **Computed from Body**, never authored.
- **Published** [VO] — publication date. Authored, required.
- **Updated** [VO] — last-revision date. Authored, optional (present only if revised).
- **Statement** [•] — the site-level positioning sentence. Exactly one; authored; belongs to the site, not to any Piece. Rendered by the **Masthead** on Home.
- **Bio** [VO] — the prose body that lives on About.
- **Roles** [S] — the ordered list of Roles on About.
- **Role** [VO] — one Roles row: title, organisation, dates.

**Piece aggregate** — authored: `title`, `dek`, `category`, `tags[]`, `leadImage`, `published`, `updated?`, `body` · derived: `slug` (from title, overridable), `readTime` (from body).

**Case study aggregate** (stub — expands when Work detail is designed): `title`, `slug`, `dek`, `role`, `year`, `stack[]`, `links[]`, `leadImage`, `body`.

---

## Mode

How content renders. **Mode** is the central concept: the Ground tells you whether you are navigating or reading.

- **Shell** — dark browse / wayfinding mode. Warm near-black Ground.
- **Reading** — light long-form mode. Neutral-paper Ground. Only the Piece page uses it.

**Surfaces** — every page, its route, its mode:

| Surface | Route | Mode |
|---|---|---|
| Home | `/` | Shell |
| Work index | `/work` | Shell |
| Case study page | `/work/[slug]` | Shell |
| Writing index | `/writing` | Shell |
| Category index | `/writing/category/[slug]` | Shell |
| Piece page | `/writing/[slug]` | **Reading** |
| About | `/about` | Shell |
| Contact | `/contact` | Shell |

Reading is the lone exception; everything else is Shell.

**Color — named by role, never by value** (same prop works in both modes; only the value swaps):

- **Ground** `--ground` — base background; encodes mode.
- **Surface** `--surface` — raised background (Cards, thumbs, fields).
- **Ink** `--ink` — primary text · **Soft** `--soft` — secondary · **Muted** `--muted` — tertiary / metadata · **Dek** `--dek` — standfirst tone.
- **Accent** `--accent` — bronze-olive; sparing (hover + one solid moment per surface).
- **Accent-lift** `--accent-lift` — brighter bronze for small / legible text (hover, links).
- **Hairline** `--hairline` — dividers.

**Components** (PascalCase = the React component name, `.tsx`):

- **Masthead** — Home opening: Eyebrow (a role kicker here), name at Wordmark scale, Statement, Metadata. Editorial-print term, in place of "Hero."
- **Metadata** — the Masthead's small structured facts: role, location, status.
- **Card** — listing unit: Lead image + inline bold Title + Dek + Category. **One component**, shared by the Writing index and the Home Writing Preview.
- **Index** — a full listing surface (Work, Writing, Category). Built of Cards.
- **Preview** — a truncated Index on Home that links to the full one. Built of Cards.
- **Eyebrow** — the label slot above a Title. Content source varies by surface: the Category on a Piece, a role kicker on the Masthead.
- **Share rail** — the sticky vertical share column on the Piece page; starts level with the Lead image.
- **Monogram** — the "M" mark (Piece header, compact surfaces).
- **Wordmark** — the "Melvin Onyia" text mark (Shell header, Footer).
- **Footer** — global footer: Wordmark + flat nav + socials; baseline © + Privacy/Terms. No rule above it; one Hairline above the baseline. On every page.
- **Contact CTA** — email + links block. Home and Contact only — never global.
- **Menu** — the hamburger control.

---

## Wayfinding

- **Routes** — as in the Surface table above.
- **Nav labels** — Work, Writing, About, Contact.
- **The invariant** — nav label = route segment = content folder = section term. One word, four places: `Writing → /writing → content/writing/ → the Writing section`.

---

## Forbidden synonyms (drift-killers)

| Don't say | Say |
|---|---|
| Blog | Writing |
| Post / Article / Entry | Piece |
| Project / Case | Case study |
| Subtitle / Subhead | Dek |
| Thumbnail / Cover / Hero image | Lead image |
| Hero (Home opening) | Masthead |
| Dark mode / Light mode | Shell / Reading |
| Background / bg | Ground (or Surface) |
| Text color | Ink / Soft / Muted (by role) |
| Tagline | Statement |

---

## Conventions

- **Components** — PascalCase: `Masthead`, `Card`, `Index`, `ShareRail`.
- **Props / fields** — camelCase: `leadImage`, `readTime`, `category`.
- **Routes & content folders** — lowercase, hyphenated: `/writing`, `content/writing/`.
- **Tokens** — kebab-case with `--`: `--accent-lift`.
- **CSS class names** — the kebab-case version of the component or surface: `Masthead` → `.masthead`, `Card` → `.card`, `DetailLayout` → `.detail-layout`, `WorkPreview` → `.work-preview`. Element/modifier suffixes are flat hyphens (`.card-image`, `.card-dek`) or BEM `__`/`--` when an existing block already uses them. No `.article-*` legacy.
- **Category & Tag values** — lowercase in data, Title-cased in display.
- **Singular is canonical** — Piece, Case study, Tag, Role are the canonical forms even when referring to many. Sections that aggregate them get their own term (Writing, Work, Roles); don't pluralise the entity to refer to its section. Code identifiers compress the two-word entity to PascalCase `CaseStudy` (singular) / `caseStudies` (plural).

---

## Model rules

1. One term, everywhere (label = route = folder = component).
2. Category is one, controlled, and navigable; Tag is many, open, and not. Never swap them.
3. Identity is the Slug; set once, never churned.
4. Read time and Slug are derived, not authored.
5. Color is referenced by role, never by value — one prop survives Shell and Reading.
6. Shell vs Reading is decided by what the surface is *for* (browse vs read), not a user toggle.