import { describe, it, expect } from 'vitest'
import type { WorkPostSummary } from '~/lib/content/work'
import type { EssaySummary } from '~/lib/content/writing'
import {
  buildSearchIndex,
  scoreEntry,
  searchIndex,
  type SearchEntry,
  type StaticEntryInput,
} from './indexer'

function makeWork(overrides: Partial<WorkPostSummary>): WorkPostSummary {
  return {
    slug: 'placeholder',
    title: 'Placeholder',
    date: '2025-01-01',
    excerpt: '',
    tags: [],
    heroImage: null,
    ...overrides,
  }
}

function makeEssay(overrides: Partial<EssaySummary>): EssaySummary {
  return {
    slug: 'placeholder',
    title: 'Placeholder',
    date: '2025-01-01',
    excerpt: '',
    tags: [],
    ...overrides,
  }
}

const STATIC_FIXTURE: StaticEntryInput = {
  routes: [
    { id: 'route:home', title: 'Home', to: '/' },
    { id: 'route:work', title: 'Work', to: '/work' },
  ],
  externals: [
    { id: 'ext:github', title: 'GitHub', href: 'https://github.com/example' },
  ],
  mailto: {
    id: 'mailto:contact',
    title: 'Send email',
    href: 'mailto:hello@example.com',
  },
}

describe('buildSearchIndex', () => {
  it('produces routes, work, essays, externals, and the mailto in that order', () => {
    const entries = buildSearchIndex({
      work: [makeWork({ slug: 'fingerprint', title: 'Movement fingerprint' })],
      essays: [makeEssay({ slug: 'leg', title: 'The leg' })],
      staticEntries: STATIC_FIXTURE,
    })
    const kinds = entries.map((e) => e.kind)
    expect(kinds).toEqual(['route', 'route', 'work', 'essay', 'external', 'mailto'])
  })

  it('maps work posts to the /work/$slug route with params', () => {
    const entries = buildSearchIndex({
      work: [makeWork({ slug: 'fingerprint', title: 'Movement fingerprint' })],
      essays: [],
      staticEntries: STATIC_FIXTURE,
    })
    const workEntry = entries.find((e) => e.kind === 'work')
    expect(workEntry).toBeDefined()
    expect(workEntry!.to).toBe('/work/$slug')
    expect(workEntry!.params).toEqual({ slug: 'fingerprint' })
    expect(workEntry!.id).toBe('work:fingerprint')
  })

  it('maps essays to the /writing/$slug route with params', () => {
    const entries = buildSearchIndex({
      work: [],
      essays: [makeEssay({ slug: 'leg', title: 'The leg' })],
      staticEntries: STATIC_FIXTURE,
    })
    const essayEntry = entries.find((e) => e.kind === 'essay')!
    expect(essayEntry.to).toBe('/writing/$slug')
    expect(essayEntry.params).toEqual({ slug: 'leg' })
  })

  it('omits empty excerpts', () => {
    const entries = buildSearchIndex({
      work: [makeWork({ slug: 'x', title: 'X', excerpt: '' })],
      essays: [],
      staticEntries: STATIC_FIXTURE,
    })
    const w = entries.find((e) => e.kind === 'work')!
    expect(w.excerpt).toBeUndefined()
  })
})

describe('scoreEntry', () => {
  const sample: SearchEntry = {
    id: 'work:fingerprint',
    kind: 'work',
    title: 'Movement fingerprint',
    excerpt: 'A study of gait individuality across runners.',
    tags: ['gait', 'biomechanics'],
  }

  it('scores a prefix match higher than a mid-string substring match', () => {
    const prefix = scoreEntry(sample, 'Move')
    const mid = scoreEntry(sample, 'finger')
    expect(prefix).not.toBeNull()
    expect(mid).not.toBeNull()
    expect(prefix!).toBeGreaterThan(mid!)
  })

  it('scores a title substring match higher than an excerpt-only match', () => {
    const titleHit = scoreEntry(sample, 'fingerprint')
    const excerptOnly = scoreEntry(sample, 'individuality')
    expect(titleHit!).toBeGreaterThan(excerptOnly!)
  })

  it('matches via subsequence with a lower score', () => {
    const subseq = scoreEntry(sample, 'mvfp')
    expect(subseq).not.toBeNull()
    expect(subseq!).toBeLessThan(50)
  })

  it('returns null when nothing matches', () => {
    expect(scoreEntry(sample, 'zxqxqz')).toBeNull()
  })

  it('matches a tag (lower weight than title)', () => {
    const tagHit = scoreEntry(sample, 'gait')
    expect(tagHit).not.toBeNull()
  })
})

describe('searchIndex', () => {
  const entries: SearchEntry[] = [
    { id: 'a', kind: 'route', title: 'Movement fingerprint' },
    { id: 'b', kind: 'route', title: 'Gait lab toolkit' },
    { id: 'c', kind: 'route', title: 'About' },
  ]

  it('returns the full list (preserving order) when the query is empty', () => {
    expect(searchIndex(entries, '').map((e) => e.id)).toEqual(['a', 'b', 'c'])
  })

  it('returns the full list when the query is whitespace-only', () => {
    expect(searchIndex(entries, '   ').map((e) => e.id)).toEqual(['a', 'b', 'c'])
  })

  it('filters out non-matching entries on a real query', () => {
    const hits = searchIndex(entries, 'fingerprint').map((e) => e.id)
    expect(hits).toEqual(['a'])
  })

  it('sorts higher-scoring matches first', () => {
    const hits = searchIndex(entries, 'gait').map((e) => e.id)
    expect(hits[0]).toBe('b')
  })

  it('returns an empty list for a complete miss', () => {
    expect(searchIndex(entries, 'qqqqqq')).toEqual([])
  })
})
