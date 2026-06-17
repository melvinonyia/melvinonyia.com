import { describe, it, expect } from 'vitest'
import { caseStudyPageHead } from './caseStudyPageHead'
import type { CaseStudySummary } from '~/lib/content/work'

function makeCaseStudy(overrides: Partial<CaseStudySummary> = {}): CaseStudySummary {
  return {
    slug: 'movement-fingerprint',
    title: 'Movement fingerprint engine',
    published: '2025-11-12',
    dek: 'Per-athlete kinematic signatures.',
    tags: ['biomechanics'],
    leadImage: '/images/movement-fingerprint/arch.png',
    ogImage: null,
    featured: false,
    ...overrides,
  }
}

const findMeta = (
  meta: Array<Record<string, unknown>>,
  predicate: (m: Record<string, unknown>) => boolean,
) => meta.find(predicate) as Record<string, unknown> | undefined

describe('caseStudyPageHead', () => {
  it('builds title from case study title and site name', () => {
    const head = caseStudyPageHead(makeCaseStudy())
    expect(findMeta(head.meta, (m) => 'title' in m)?.title).toBe(
      'Movement fingerprint engine — Melvin Onyia',
    )
  })

  it('uses dek as description when present', () => {
    const head = caseStudyPageHead(makeCaseStudy({ dek: 'Custom dek here.' }))
    expect(findMeta(head.meta, (m) => m.name === 'description')?.content).toBe(
      'Custom dek here.',
    )
  })

  it('falls back to a derived description when dek is empty', () => {
    const head = caseStudyPageHead(makeCaseStudy({ dek: '' }))
    expect(findMeta(head.meta, (m) => m.name === 'description')?.content).toMatch(
      /Movement fingerprint engine\. A case study by Melvin Onyia\./,
    )
  })

  it('sets og:type to article and includes published_time', () => {
    const head = caseStudyPageHead(makeCaseStudy())
    expect(findMeta(head.meta, (m) => m.property === 'og:type')?.content).toBe('article')
    expect(
      findMeta(head.meta, (m) => m.property === 'article:published_time')?.content,
    ).toBe('2025-11-12')
  })

  it('uses leadImage absolutized when present, otherwise default', () => {
    expect(
      findMeta(caseStudyPageHead(makeCaseStudy()).meta, (m) => m.property === 'og:image')?.content,
    ).toBe('https://melvinonyia.com/images/movement-fingerprint/arch.png')

    expect(
      findMeta(caseStudyPageHead(makeCaseStudy({ leadImage: null })).meta, (m) => m.property === 'og:image')
        ?.content,
    ).toBe('https://melvinonyia.com/og/work.png')
  })

  it('ogImage overrides leadImage for the og:image slot', () => {
    const head = caseStudyPageHead(
      makeCaseStudy({ ogImage: '/og/work-movement-fingerprint.png' }),
    )
    expect(findMeta(head.meta, (m) => m.property === 'og:image')?.content).toBe(
      'https://melvinonyia.com/og/work-movement-fingerprint.png',
    )
    expect(findMeta(head.meta, (m) => m.name === 'twitter:image')?.content).toBe(
      'https://melvinonyia.com/og/work-movement-fingerprint.png',
    )
  })

  it('sets canonical to the case study URL', () => {
    const head = caseStudyPageHead(makeCaseStudy())
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://melvinonyia.com/work/movement-fingerprint',
    })
  })
})
