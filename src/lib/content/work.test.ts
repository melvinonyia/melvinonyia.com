import { describe, it, expect } from 'vitest'
import {
  getCaseStudies,
  getCaseStudy,
  resolveCaseStudy,
  CaseStudyNotFoundError,
} from './work'

describe('work content collection', () => {
  it('parses frontmatter into a typed list of case studies', () => {
    const cases = getCaseStudies()
    expect(cases.length).toBeGreaterThanOrEqual(2)

    const fingerprint = cases.find((c) => c.slug === 'movement-fingerprint')
    expect(fingerprint).toBeDefined()
    expect(fingerprint!.title).toBe('Movement fingerprint engine')
    expect(fingerprint!.published).toBe('2025-11-12')
    expect(fingerprint!.tags).toEqual(
      expect.arrayContaining(['biomechanics', 'signal processing', 'engineering']),
    )
    expect(fingerprint!.leadImage).toBeNull()
    expect(fingerprint!.ogImage).toBeNull()
    expect(typeof fingerprint!.Body).toBe('function')
  })

  it('derives slug from the source filename', () => {
    const slugs = getCaseStudies().map((c) => c.slug)
    expect(slugs).toEqual(expect.arrayContaining(['movement-fingerprint', 'gait-lab-toolkit']))
  })

  it('sorts case studies reverse-chronologically by published date', () => {
    const dates = getCaseStudies().map((c) => c.published)
    const sorted = [...dates].sort((a, b) => (a < b ? 1 : -1))
    expect(dates).toEqual(sorted)
  })

  it('exposes dek as a string for every case study, defaulting to empty when frontmatter omits it', () => {
    for (const c of getCaseStudies()) {
      expect(typeof c.dek).toBe('string')
    }
  })

  it('exposes dek from frontmatter when present', () => {
    const fingerprint = getCaseStudy('movement-fingerprint')
    expect(fingerprint!.dek).toMatch(/per-athlete kinematic signatures/)
  })

  it('getCaseStudy returns null for unknown slugs', () => {
    expect(getCaseStudy('does-not-exist')).toBeNull()
  })

  it('resolveCaseStudy returns the case study for a known slug', () => {
    const c = resolveCaseStudy('movement-fingerprint')
    expect(c.slug).toBe('movement-fingerprint')
  })

  it('resolveCaseStudy throws CaseStudyNotFoundError for an unknown slug', () => {
    expect(() => resolveCaseStudy('does-not-exist')).toThrow(CaseStudyNotFoundError)
  })
})
