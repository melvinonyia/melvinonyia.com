import { describe, it, expect } from 'vitest'
import {
  getEssays,
  getEssay,
  getEssaySummaries,
  resolveEssay,
  EssayNotFoundError,
} from './writing'

describe('writing content collection', () => {
  it('parses frontmatter into a typed list of essays', () => {
    const essays = getEssays()
    expect(essays.length).toBeGreaterThanOrEqual(1)

    const fixture = essays.find((e) => e.slug === 'the-leg-between-lab-and-field')
    expect(fixture).toBeDefined()
    expect(fixture!.title).toBe('The leg between lab and field')
    expect(fixture!.date).toBe('2025-10-08')
    expect(fixture!.tags).toEqual(expect.arrayContaining(['notes', 'biomechanics']))
    expect(typeof fixture!.Body).toBe('function')
  })

  it('derives slug from the source filename', () => {
    const slugs = getEssays().map((e) => e.slug)
    expect(slugs).toContain('the-leg-between-lab-and-field')
  })

  it('sorts essays reverse-chronologically by date', () => {
    const dates = getEssays().map((e) => e.date)
    const sorted = [...dates].sort((a, b) => (a < b ? 1 : -1))
    expect(dates).toEqual(sorted)
  })

  it('exposes excerpt from frontmatter when present', () => {
    const essay = getEssay('the-leg-between-lab-and-field')
    expect(essay).not.toBeNull()
    expect(essay!.excerpt).toMatch(/movement-science findings/)
  })

  it('getEssay returns null for unknown slugs', () => {
    expect(getEssay('does-not-exist')).toBeNull()
  })

  it('getEssaySummaries excludes the Body component for loader-safe payloads', () => {
    const summaries = getEssaySummaries()
    expect(summaries.length).toBeGreaterThan(0)
    summaries.forEach((s) => expect('Body' in s).toBe(false))
  })

  it('resolveEssay returns the essay for a known slug', () => {
    expect(resolveEssay('the-leg-between-lab-and-field').slug).toBe(
      'the-leg-between-lab-and-field',
    )
  })

  it('resolveEssay throws EssayNotFoundError for an unknown slug', () => {
    expect(() => resolveEssay('nope')).toThrow(EssayNotFoundError)
  })
})
