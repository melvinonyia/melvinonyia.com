import { describe, it, expect } from 'vitest'
import { writingHead } from './writingHead'

const findMeta = (
  meta: Array<Record<string, unknown>>,
  predicate: (m: Record<string, unknown>) => boolean,
) => meta.find(predicate) as Record<string, unknown> | undefined

describe('writingHead', () => {
  it('declares title and description', () => {
    const head = writingHead()
    expect(findMeta(head.meta, (m) => 'title' in m)?.title).toBe('Writing — Melvin Onyia')
    expect(findMeta(head.meta, (m) => m.name === 'description')?.content).toMatch(
      /Essays/,
    )
  })

  it('sets canonical to the /writing URL', () => {
    const head = writingHead()
    expect(head.links).toContainEqual({
      rel: 'canonical',
      href: 'https://melvinonyia.com/writing',
    })
  })

  it('declares the og cluster pointing at /writing', () => {
    const head = writingHead()
    expect(findMeta(head.meta, (m) => m.property === 'og:url')?.content).toBe(
      'https://melvinonyia.com/writing',
    )
    expect(findMeta(head.meta, (m) => m.property === 'og:type')?.content).toBe('website')
  })

  it('declares twitter card metadata', () => {
    const head = writingHead()
    expect(findMeta(head.meta, (m) => m.name === 'twitter:card')?.content).toBe(
      'summary_large_image',
    )
  })
})
