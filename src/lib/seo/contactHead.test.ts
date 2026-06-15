import { describe, it, expect } from 'vitest'
import { contactHead } from './contactHead'

const findMeta = (
  meta: Array<Record<string, unknown>>,
  predicate: (m: Record<string, unknown>) => boolean,
) => meta.find(predicate) as Record<string, unknown> | undefined

describe('contactHead', () => {
  it('declares title and description', () => {
    const head = contactHead()
    expect(findMeta(head.meta, (m) => 'title' in m)?.title).toBe(
      'Contact — Melvin Onyia',
    )
    expect(findMeta(head.meta, (m) => m.name === 'description')?.content).toMatch(
      /Get in touch/i,
    )
  })

  it('sets canonical to the /contact URL', () => {
    const head = contactHead()
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://melvinonyia.com/contact',
    })
  })

  it('declares the OG cluster pointing at /og/contact.png', () => {
    const head = contactHead()
    expect(findMeta(head.meta, (m) => m.property === 'og:image')?.content).toBe(
      'https://melvinonyia.com/og/contact.png',
    )
    expect(findMeta(head.meta, (m) => m.property === 'og:url')?.content).toBe(
      'https://melvinonyia.com/contact',
    )
    expect(findMeta(head.meta, (m) => m.property === 'og:type')?.content).toBe('website')
  })

  it('declares the twitter cluster', () => {
    const head = contactHead()
    expect(findMeta(head.meta, (m) => m.name === 'twitter:card')?.content).toBe(
      'summary_large_image',
    )
    expect(findMeta(head.meta, (m) => m.name === 'twitter:image')?.content).toBe(
      'https://melvinonyia.com/og/contact.png',
    )
  })
})
