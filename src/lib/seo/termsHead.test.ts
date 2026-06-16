import { describe, it, expect } from 'vitest'
import { termsHead } from './termsHead'

const findMeta = (
  meta: Array<Record<string, unknown>>,
  predicate: (m: Record<string, unknown>) => boolean,
) => meta.find(predicate) as Record<string, unknown> | undefined

describe('termsHead', () => {
  it('declares title and description', () => {
    const head = termsHead()
    expect(findMeta(head.meta, (m) => 'title' in m)?.title).toBe('Terms — Melvin Onyia')
    expect(findMeta(head.meta, (m) => m.name === 'description')?.content).toMatch(
      /terms of use/i,
    )
  })

  it('sets canonical to the /terms URL', () => {
    const head = termsHead()
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://melvinonyia.com/terms',
    })
  })

  it('declares OG cluster pointing at the default OG image', () => {
    const head = termsHead()
    expect(findMeta(head.meta, (m) => m.property === 'og:image')?.content).toBe(
      'https://melvinonyia.com/og/default.png',
    )
    expect(findMeta(head.meta, (m) => m.property === 'og:url')?.content).toBe(
      'https://melvinonyia.com/terms',
    )
  })

  it('declares the twitter cluster', () => {
    const head = termsHead()
    expect(findMeta(head.meta, (m) => m.name === 'twitter:card')?.content).toBe(
      'summary_large_image',
    )
    expect(findMeta(head.meta, (m) => m.name === 'twitter:image')?.content).toBe(
      'https://melvinonyia.com/og/default.png',
    )
  })

  it('asks search engines not to index the terms page', () => {
    const head = termsHead()
    expect(findMeta(head.meta, (m) => m.name === 'robots')?.content).toBe('noindex')
  })
})
