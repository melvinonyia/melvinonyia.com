import { describe, it, expect } from 'vitest'
import { getWorkPosts, getWorkPost, resolveWorkPost, WorkNotFoundError } from './work'

describe('work content collection', () => {
  it('parses frontmatter into a typed list of posts', () => {
    const posts = getWorkPosts()
    expect(posts.length).toBeGreaterThanOrEqual(2)

    const fingerprint = posts.find((p) => p.slug === 'movement-fingerprint')
    expect(fingerprint).toBeDefined()
    expect(fingerprint!.title).toBe('Movement fingerprint engine')
    expect(fingerprint!.date).toBe('2025-11-12')
    expect(fingerprint!.tags).toEqual(
      expect.arrayContaining(['biomechanics', 'signal processing', 'engineering']),
    )
    expect(fingerprint!.heroImage).toBe('/og/work-movement-fingerprint.png')
    expect(typeof fingerprint!.Body).toBe('function')
  })

  it('derives slug from the source filename', () => {
    const slugs = getWorkPosts().map((p) => p.slug)
    expect(slugs).toEqual(expect.arrayContaining(['movement-fingerprint', 'gait-lab-toolkit']))
  })

  it('sorts posts reverse-chronologically by date', () => {
    const dates = getWorkPosts().map((p) => p.date)
    const sorted = [...dates].sort((a, b) => (a < b ? 1 : -1))
    expect(dates).toEqual(sorted)
  })

  it('falls back to an empty excerpt when frontmatter omits it', () => {
    const gait = getWorkPost('gait-lab-toolkit')
    expect(gait).not.toBeNull()
    expect(gait!.excerpt).toBe('')
  })

  it('exposes excerpt from frontmatter when present', () => {
    const fingerprint = getWorkPost('movement-fingerprint')
    expect(fingerprint!.excerpt).toMatch(/per-athlete kinematic signatures/)
  })

  it('getWorkPost returns null for unknown slugs', () => {
    expect(getWorkPost('does-not-exist')).toBeNull()
  })

  it('resolveWorkPost returns the post for a known slug', () => {
    const post = resolveWorkPost('movement-fingerprint')
    expect(post.slug).toBe('movement-fingerprint')
  })

  it('resolveWorkPost throws WorkNotFoundError for an unknown slug', () => {
    expect(() => resolveWorkPost('does-not-exist')).toThrow(WorkNotFoundError)
  })
})
