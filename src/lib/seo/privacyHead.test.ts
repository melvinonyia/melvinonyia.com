import { describe, it, expect } from 'vitest'
import { privacyHead } from './privacyHead'

const findMeta = (
  meta: Array<Record<string, unknown>>,
  predicate: (m: Record<string, unknown>) => boolean,
) => meta.find(predicate) as Record<string, unknown> | undefined

describe('privacyHead', () => {
  it('declares title and description', () => {
    const head = privacyHead()
    expect(findMeta(head.meta, (m) => 'title' in m)?.title).toBe('Privacy — Melvin Onyia')
    expect(findMeta(head.meta, (m) => m.name === 'description')?.content).toMatch(
      /privacy policy/i,
    )
  })

  it('sets canonical to the /privacy URL', () => {
    const head = privacyHead()
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://melvinonyia.com/privacy',
    })
  })

  it('declares OG cluster pointing at the default OG image', () => {
    const head = privacyHead()
    expect(findMeta(head.meta, (m) => m.property === 'og:image')?.content).toBe(
      'https://melvinonyia.com/og/default.png',
    )
    expect(findMeta(head.meta, (m) => m.property === 'og:url')?.content).toBe(
      'https://melvinonyia.com/privacy',
    )
  })

  it('declares the twitter cluster', () => {
    const head = privacyHead()
    expect(findMeta(head.meta, (m) => m.name === 'twitter:card')?.content).toBe(
      'summary_large_image',
    )
    expect(findMeta(head.meta, (m) => m.name === 'twitter:image')?.content).toBe(
      'https://melvinonyia.com/og/default.png',
    )
  })

  it('asks search engines not to index the privacy page', () => {
    const head = privacyHead()
    expect(findMeta(head.meta, (m) => m.name === 'robots')?.content).toBe('noindex')
  })
})
