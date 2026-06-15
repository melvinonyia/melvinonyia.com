import { describe, it, expect } from 'vitest'
import { workHead } from './workHead'

const findMeta = (
  meta: Array<Record<string, unknown>>,
  predicate: (m: Record<string, unknown>) => boolean,
) => meta.find(predicate) as Record<string, unknown> | undefined

describe('workHead', () => {
  it('declares title and description', () => {
    const head = workHead()
    expect(findMeta(head.meta, (m) => 'title' in m)?.title).toBe('Work — Melvin Onyia')
    expect(findMeta(head.meta, (m) => m.name === 'description')?.content).toMatch(
      /biomechanics/,
    )
  })

  it('sets canonical to the /work URL', () => {
    const head = workHead()
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://melvinonyia.com/work',
    })
  })

  it('declares the og cluster pointing at /work', () => {
    const head = workHead()
    expect(findMeta(head.meta, (m) => m.property === 'og:url')?.content).toBe(
      'https://melvinonyia.com/work',
    )
    expect(findMeta(head.meta, (m) => m.property === 'og:type')?.content).toBe('website')
    expect(findMeta(head.meta, (m) => m.property === 'og:image')?.content).toBe(
      'https://melvinonyia.com/og/work.png',
    )
  })

  it('declares twitter card metadata', () => {
    const head = workHead()
    expect(findMeta(head.meta, (m) => m.name === 'twitter:card')?.content).toBe(
      'summary_large_image',
    )
    expect(findMeta(head.meta, (m) => m.name === 'twitter:title')?.content).toBe(
      'Work — Melvin Onyia',
    )
  })
})
