import { describe, it, expect } from 'vitest'
import { serverErrorHead } from './serverErrorHead'

const findMeta = (
  meta: Array<Record<string, unknown>>,
  predicate: (m: Record<string, unknown>) => boolean,
) => meta.find(predicate) as Record<string, unknown> | undefined

describe('serverErrorHead', () => {
  it('declares the title', () => {
    const head = serverErrorHead()
    expect(findMeta(head.meta, (m) => 'title' in m)?.title).toBe(
      'Server error — Melvin Onyia',
    )
  })

  it('declares a description', () => {
    const head = serverErrorHead()
    expect(findMeta(head.meta, (m) => m.name === 'description')?.content).toMatch(
      /server hit an error/i,
    )
  })

  it('asks search engines not to index', () => {
    const head = serverErrorHead()
    expect(findMeta(head.meta, (m) => m.name === 'robots')?.content).toBe('noindex')
  })
})
