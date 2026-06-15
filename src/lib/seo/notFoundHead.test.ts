import { describe, it, expect } from 'vitest'
import { notFoundHead } from './notFoundHead'

const findMeta = (
  meta: Array<Record<string, unknown>>,
  predicate: (m: Record<string, unknown>) => boolean,
) => meta.find(predicate) as Record<string, unknown> | undefined

describe('notFoundHead', () => {
  it('declares the title', () => {
    const head = notFoundHead()
    expect(findMeta(head.meta, (m) => 'title' in m)?.title).toBe(
      'Page not found — Melvin Onyia',
    )
  })

  it('declares a description', () => {
    const head = notFoundHead()
    expect(findMeta(head.meta, (m) => m.name === 'description')?.content).toMatch(
      /not on melvinonyia/i,
    )
  })

  it('asks search engines not to index', () => {
    const head = notFoundHead()
    expect(findMeta(head.meta, (m) => m.name === 'robots')?.content).toBe('noindex')
  })
})
