import { describe, it, expect } from 'vitest'
import type { CaseStudySummary } from '~/lib/content/work'
import type { PieceSummary } from '~/lib/content/writing'
import {
  buildSearchIndex,
  scoreEntry,
  searchIndex,
  type SearchEntry,
  type StaticEntryInput,
} from './indexer'

function makeCaseStudy(overrides: Partial<CaseStudySummary>): CaseStudySummary {
  return {
    slug: 'placeholder',
    title: 'Placeholder',
    published: '2025-01-01',
    dek: '',
    tags: [],
    leadImage: null,
    ogImage: null,
    ...overrides,
  }
}

function makePiece(overrides: Partial<PieceSummary>): PieceSummary {
  return {
    slug: 'placeholder',
    title: 'Placeholder',
    published: '2025-01-01',
    dek: '',
    tags: [],
    ogImage: null,
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
  it('produces routes, case studies, pieces, externals, and the mailto in that order', () => {
    const entries = buildSearchIndex({
      caseStudies: [makeCaseStudy({ slug: 'fingerprint', title: 'Movement fingerprint' })],
      pieces: [makePiece({ slug: 'leg', title: 'The leg' })],
      staticEntries: STATIC_FIXTURE,
    })
    const kinds = entries.map((e) => e.kind)
    expect(kinds).toEqual(['route', 'route', 'case-study', 'piece', 'external', 'mailto'])
  })

  it('maps case studies to the /work/$slug route with params', () => {
    const entries = buildSearchIndex({
      caseStudies: [makeCaseStudy({ slug: 'fingerprint', title: 'Movement fingerprint' })],
      pieces: [],
      staticEntries: STATIC_FIXTURE,
    })
    const csEntry = entries.find((e) => e.kind === 'case-study')
    expect(csEntry).toBeDefined()
    expect(csEntry!.to).toBe('/work/$slug')
    expect(csEntry!.params).toEqual({ slug: 'fingerprint' })
    expect(csEntry!.id).toBe('case-study:fingerprint')
  })

  it('maps pieces to the /writing/$slug route with params', () => {
    const entries = buildSearchIndex({
      caseStudies: [],
      pieces: [makePiece({ slug: 'leg', title: 'The leg' })],
      staticEntries: STATIC_FIXTURE,
    })
    const pieceEntry = entries.find((e) => e.kind === 'piece')!
    expect(pieceEntry.to).toBe('/writing/$slug')
    expect(pieceEntry.params).toEqual({ slug: 'leg' })
  })

  it('omits empty deks', () => {
    const entries = buildSearchIndex({
      caseStudies: [makeCaseStudy({ slug: 'x', title: 'X', dek: '' })],
      pieces: [],
      staticEntries: STATIC_FIXTURE,
    })
    const c = entries.find((e) => e.kind === 'case-study')!
    expect(c.dek).toBeUndefined()
  })
})

describe('scoreEntry', () => {
  const sample: SearchEntry = {
    id: 'case-study:fingerprint',
    kind: 'case-study',
    title: 'Movement fingerprint',
    dek: 'A study of gait individuality across runners.',
    tags: ['gait', 'biomechanics'],
  }

  it('scores a prefix match higher than a mid-string substring match', () => {
    const prefix = scoreEntry(sample, 'Move')
    const mid = scoreEntry(sample, 'finger')
    expect(prefix).not.toBeNull()
    expect(mid).not.toBeNull()
    expect(prefix!).toBeGreaterThan(mid!)
  })

  it('scores a title substring match higher than a dek-only match', () => {
    const titleHit = scoreEntry(sample, 'fingerprint')
    const dekOnly = scoreEntry(sample, 'individuality')
    expect(titleHit!).toBeGreaterThan(dekOnly!)
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
