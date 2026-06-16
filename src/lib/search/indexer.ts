import type { CaseStudySummary } from '~/lib/content/work'
import type { PieceSummary } from '~/lib/content/writing'

export type SearchEntryKind = 'route' | 'case-study' | 'piece' | 'external' | 'mailto'

export interface SearchEntry {
  id: string
  kind: SearchEntryKind
  title: string
  dek?: string
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
  caseStudies: readonly CaseStudySummary[]
  pieces: readonly PieceSummary[]
  staticEntries: StaticEntryInput
}

export function buildSearchIndex({
  caseStudies,
  pieces,
  staticEntries,
}: BuildSearchIndexInput): SearchEntry[] {
  const entries: SearchEntry[] = []

  for (const r of staticEntries.routes) {
    entries.push({ id: r.id, kind: 'route', title: r.title, to: r.to, hint: r.hint })
  }

  for (const c of caseStudies) {
    entries.push({
      id: `case-study:${c.slug}`,
      kind: 'case-study',
      title: c.title,
      dek: c.dek || undefined,
      tags: c.tags,
      to: '/work/$slug',
      params: { slug: c.slug },
    })
  }

  for (const piece of pieces) {
    entries.push({
      id: `piece:${piece.slug}`,
      kind: 'piece',
      title: piece.title,
      dek: piece.dek || undefined,
      tags: piece.tags,
      to: '/writing/$slug',
      params: { slug: piece.slug },
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
  const dekScore = entry.dek ? scoreField(entry.dek, query) : null
  const tagScores = entry.tags
    ? entry.tags.map((t) => scoreField(t, query)).filter((s): s is number => s !== null)
    : []
  const candidates: number[] = []
  if (titleScore !== null) candidates.push(titleScore)
  if (dekScore !== null) candidates.push(dekScore * 0.5)
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
