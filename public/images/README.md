# Post images

Drop images for a post under `public/images/<post-slug>/` and reference
them root-relative.

- **Hero / cover image** — set in frontmatter. Work posts use
  `heroImage`, writing posts use `coverImage`:
  ```yaml
  heroImage:  /images/movement-fingerprint/hero.jpg          # work
  coverImage: /images/the-leg-between-lab-and-field/hero.jpg # writing
  ```
- **Inline body images** — use standard markdown syntax inside the MDX:
  ```markdown
  ![alt text](/images/movement-fingerprint/diagram.png)
  ```

Slug = the MDX filename without extension (e.g. `movement-fingerprint.mdx`
→ `movement-fingerprint/`).

## Other image slots

- `public/og/` — social-share cards (1200×630). Per-post cards are named
  after the slug, e.g. `og/work-movement-fingerprint.png`. Opt in per
  post via frontmatter:
  ```yaml
  ogImage: /og/work-movement-fingerprint.png
  ```
  Resolution order:
  - Work: `ogImage > heroImage > /og/work.png` (`src/lib/seo/workPostHead.ts`)
  - Writing: `ogImage > coverImage > /og/writing.png` (`src/lib/seo/writingPostHead.ts`)
- `public/images/error-500.svg` — illustration for the 500 view. Not yet
  committed; drop the artwork here and it renders automatically. The 404
  view is text-only.
