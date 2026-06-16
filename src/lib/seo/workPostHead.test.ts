import { describe, it, expect } from 'vitest'
import { workPostHead } from './workPostHead'
import type { WorkPostSummary } from '~/lib/content/work'

function makePost(overrides: Partial<WorkPostSummary> = {}): WorkPostSummary {
  return {
    slug: 'movement-fingerprint',
    title: 'Movement fingerprint engine',
    date: '2025-11-12',
    excerpt: 'Per-athlete kinematic signatures.',
    tags: ['biomechanics'],
    heroImage: '/images/movement-fingerprint/arch.png',
    ogImage: null,
    ...overrides,
  }
}

const findMeta = (
  meta: Array<Record<string, unknown>>,
  predicate: (m: Record<string, unknown>) => boolean,
) => meta.find(predicate) as Record<string, unknown> | undefined

describe('workPostHead', () => {
  it('builds title from post title and site name', () => {
    const head = workPostHead(makePost())
    expect(findMeta(head.meta, (m) => 'title' in m)?.title).toBe(
      'Movement fingerprint engine — Melvin Onyia',
    )
  })

  it('uses excerpt as description when present', () => {
    const head = workPostHead(makePost({ excerpt: 'Custom excerpt here.' }))
    expect(findMeta(head.meta, (m) => m.name === 'description')?.content).toBe(
      'Custom excerpt here.',
    )
  })

  it('falls back to a derived description when excerpt is empty', () => {
    const head = workPostHead(makePost({ excerpt: '' }))
    expect(findMeta(head.meta, (m) => m.name === 'description')?.content).toMatch(
      /Movement fingerprint engine\. A case study by Melvin Onyia\./,
    )
  })

  it('sets og:type to article and includes published_time', () => {
    const head = workPostHead(makePost())
    expect(findMeta(head.meta, (m) => m.property === 'og:type')?.content).toBe('article')
    expect(
      findMeta(head.meta, (m) => m.property === 'article:published_time')?.content,
    ).toBe('2025-11-12')
  })

  it('uses heroImage absolutized when present, otherwise default', () => {
    expect(
      findMeta(workPostHead(makePost()).meta, (m) => m.property === 'og:image')?.content,
    ).toBe('https://melvinonyia.com/images/movement-fingerprint/arch.png')

    expect(
      findMeta(workPostHead(makePost({ heroImage: null })).meta, (m) => m.property === 'og:image')
        ?.content,
    ).toBe('https://melvinonyia.com/og/work.png')
  })

  it('ogImage overrides heroImage for the og:image slot', () => {
    const head = workPostHead(
      makePost({ ogImage: '/og/work-movement-fingerprint.png' }),
    )
    expect(findMeta(head.meta, (m) => m.property === 'og:image')?.content).toBe(
      'https://melvinonyia.com/og/work-movement-fingerprint.png',
    )
    expect(findMeta(head.meta, (m) => m.name === 'twitter:image')?.content).toBe(
      'https://melvinonyia.com/og/work-movement-fingerprint.png',
    )
  })

  it('sets canonical to the post URL', () => {
    const head = workPostHead(makePost())
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://melvinonyia.com/work/movement-fingerprint',
    })
  })
})
