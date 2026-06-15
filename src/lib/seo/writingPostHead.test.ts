import { describe, it, expect } from 'vitest'
import { writingPostHead } from './writingPostHead'
import type { EssaySummary } from '~/lib/content/writing'

function makeEssay(overrides: Partial<EssaySummary> = {}): EssaySummary {
  return {
    slug: 'the-leg-between-lab-and-field',
    title: 'The leg between lab and field',
    date: '2025-10-08',
    excerpt: 'A short excerpt.',
    tags: ['notes'],
    ...overrides,
  }
}

const findMeta = (
  meta: Array<Record<string, unknown>>,
  predicate: (m: Record<string, unknown>) => boolean,
) => meta.find(predicate) as Record<string, unknown> | undefined

describe('writingPostHead', () => {
  it('builds title from essay title and site name', () => {
    const head = writingPostHead(makeEssay())
    expect(findMeta(head.meta, (m) => 'title' in m)?.title).toBe(
      'The leg between lab and field — Melvin Onyia',
    )
  })

  it('uses excerpt as description when present', () => {
    const head = writingPostHead(makeEssay({ excerpt: 'Custom excerpt here.' }))
    expect(findMeta(head.meta, (m) => m.name === 'description')?.content).toBe(
      'Custom excerpt here.',
    )
  })

  it('falls back to a derived description when excerpt is empty', () => {
    const head = writingPostHead(makeEssay({ excerpt: '' }))
    expect(findMeta(head.meta, (m) => m.name === 'description')?.content).toMatch(
      /The leg between lab and field\. An essay by Melvin Onyia\./,
    )
  })

  it('sets og:type to article and includes published_time', () => {
    const head = writingPostHead(makeEssay())
    expect(findMeta(head.meta, (m) => m.property === 'og:type')?.content).toBe('article')
    expect(
      findMeta(head.meta, (m) => m.property === 'article:published_time')?.content,
    ).toBe('2025-10-08')
  })

  it('sets canonical to the essay URL', () => {
    const head = writingPostHead(makeEssay())
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://melvinonyia.com/writing/the-leg-between-lab-and-field',
    })
  })
})
