import { describe, it, expect } from 'vitest'
import { aboutHead } from './aboutHead'

const findMeta = (
  meta: Array<Record<string, unknown>>,
  predicate: (m: Record<string, unknown>) => boolean,
) => meta.find(predicate) as Record<string, unknown> | undefined

describe('aboutHead', () => {
  it('declares title and description', () => {
    const head = aboutHead()
    expect(findMeta(head.meta, (m) => 'title' in m)?.title).toBe('About — Melvin Onyia')
    expect(findMeta(head.meta, (m) => m.name === 'description')?.content).toMatch(
      /simple & scalable/,
    )
  })

  it('sets canonical to the /about URL', () => {
    const head = aboutHead()
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://melvinonyia.com/about',
    })
  })

  it('uses profile og:type for the about page', () => {
    const head = aboutHead()
    expect(findMeta(head.meta, (m) => m.property === 'og:type')?.content).toBe('profile')
    expect(findMeta(head.meta, (m) => m.property === 'og:url')?.content).toBe(
      'https://melvinonyia.com/about',
    )
  })

  it('declares the twitter cluster', () => {
    const head = aboutHead()
    expect(findMeta(head.meta, (m) => m.name === 'twitter:card')?.content).toBe(
      'summary_large_image',
    )
    expect(findMeta(head.meta, (m) => m.name === 'twitter:title')?.content).toBe(
      'About — Melvin Onyia',
    )
  })
})
