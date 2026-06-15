import type { WorkPostSummary } from '~/lib/content/work'
import type { EssaySummary } from '~/lib/content/writing'

export type SearchEntryKind = 'route' | 'work' | 'essay' | 'external' | 'mailto'

export interface SearchEntry {
  id: string
  kind: SearchEntryKind
  title: string
  excerpt?: string
  tags?: readonly string[]
  to?: string
  params?: Record<string, string>
  href?: string
  hint?: string
}

export interface StaticEntryInput {
  routes: Array<{ id: string; title: string; to: string; hint?: string }>
  externals: Array<{ id: string; title: string; href: string; hint?: string }>
  mailto: { id: string; title: string; href: string; hint?: string }
}

export interface BuildSearchIndexInput {
  work: readonly WorkPostSummary[]
  essays: readonly EssaySummary[]
  staticEntries: StaticEntryInput
}

export function buildSearchIndex({
  work,
  essays,
  staticEntries,
}: BuildSearchIndexInput): SearchEntry[] {
  const entries: SearchEntry[] = []

  for (const r of staticEntries.routes) {
    entries.push({ id: r.id, kind: 'route', title: r.title, to: r.to, hint: r.hint })
  }

  for (const post of work) {
    entries.push({
      id: `work:${post.slug}`,
      kind: 'work',
      title: post.title,
      excerpt: post.excerpt || undefined,
      tags: post.tags,
      to: '/work/$slug',
      params: { slug: post.slug },
    })
  }

  for (const essay of essays) {
    entries.push({
      id: `essay:${essay.slug}`,
      kind: 'essay',
      title: essay.title,
      excerpt: essay.excerpt || undefined,
      tags: essay.tags,
      to: '/writing/$slug',
      params: { slug: essay.slug },
    })
  }

  for (const ext of staticEntries.externals) {
    entries.push({
      id: ext.id,
      kind: 'external',
      title: ext.title,
      href: ext.href,
      hint: ext.hint,
    })
  }

  entries.push({
    id: staticEntries.mailto.id,
    kind: 'mailto',
    title: staticEntries.mailto.title,
    href: staticEntries.mailto.href,
    hint: staticEntries.mailto.hint,
  })

  return entries
}

function scoreField(text: string, query: string): number | null {
  if (!query) return 0
  const t = text.toLowerCase()
  const q = query.toLowerCase()
  const idx = t.indexOf(q)
  if (idx === 0) return 100
  if (idx > 0) return Math.max(40, 70 - idx)
  let ti = 0
  let gap = 0
  for (let qi = 0; qi < q.length; qi++) {
    const c = q[qi]
    while (ti < t.length && t[ti] !== c) {
      ti++
      gap++
    }
    if (ti >= t.length) return null
    ti++
  }
  return Math.max(1, 30 - gap)
}

export function scoreEntry(entry: SearchEntry, query: string): number | null {
  if (!query) return 0
  const titleScore = scoreField(entry.title, query)
  const excerptScore = entry.excerpt ? scoreField(entry.excerpt, query) : null
  const tagScores = entry.tags
    ? entry.tags.map((t) => scoreField(t, query)).filter((s): s is number => s !== null)
    : []
  const candidates: number[] = []
  if (titleScore !== null) candidates.push(titleScore)
  if (excerptScore !== null) candidates.push(excerptScore * 0.5)
  for (const t of tagScores) candidates.push(t * 0.4)
  if (candidates.length === 0) return null
  return Math.max(...candidates)
}

export function searchIndex(entries: SearchEntry[], query: string): SearchEntry[] {
  if (!query.trim()) return entries
  const scored: Array<{ entry: SearchEntry; score: number }> = []
  for (const entry of entries) {
    const s = scoreEntry(entry, query)
    if (s !== null && s > 0) scored.push({ entry, score: s })
  }
  scored.sort((a, b) => b.score - a.score)
  return scored.map((s) => s.entry)
}
