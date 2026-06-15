import { describe, it, expect } from 'vitest'
import { legalHead } from './legalHead'

const findMeta = (
  meta: Array<Record<string, unknown>>,
  predicate: (m: Record<string, unknown>) => boolean,
) => meta.find(predicate) as Record<string, unknown> | undefined

describe('legalHead', () => {
  it('declares title and description', () => {
    const head = legalHead()
    expect(findMeta(head.meta, (m) => 'title' in m)?.title).toBe('Legal — Melvin Onyia')
    expect(findMeta(head.meta, (m) => m.name === 'description')?.content).toMatch(
      /Legal notices/i,
    )
  })

  it('sets canonical to the /legal URL', () => {
    const head = legalHead()
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://melvinonyia.com/legal',
    })
  })

  it('declares OG cluster pointing at the default OG image', () => {
    const head = legalHead()
    expect(findMeta(head.meta, (m) => m.property === 'og:image')?.content).toBe(
      'https://melvinonyia.com/og/default.png',
    )
    expect(findMeta(head.meta, (m) => m.property === 'og:url')?.content).toBe(
      'https://melvinonyia.com/legal',
    )
  })

  it('declares the twitter cluster', () => {
    const head = legalHead()
    expect(findMeta(head.meta, (m) => m.name === 'twitter:card')?.content).toBe(
      'summary_large_image',
    )
    expect(findMeta(head.meta, (m) => m.name === 'twitter:image')?.content).toBe(
      'https://melvinonyia.com/og/default.png',
    )
  })

  it('asks search engines not to index the legal page', () => {
    const head = legalHead()
    expect(findMeta(head.meta, (m) => m.name === 'robots')?.content).toBe('noindex')
  })
})
