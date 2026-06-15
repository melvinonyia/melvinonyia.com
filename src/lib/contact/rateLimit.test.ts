import { describe, it, expect } from 'vitest'
import { createInMemoryRateLimit } from './rateLimit'

describe('createInMemoryRateLimit', () => {
  it('allows up to `max` checks per window for a given key', () => {
    let t = 0
    const rl = createInMemoryRateLimit({ windowMs: 1000, max: 3, now: () => t })
    expect(rl.check('a').allowed).toBe(true)
    expect(rl.check('a').allowed).toBe(true)
    expect(rl.check('a').allowed).toBe(true)
    expect(rl.check('a').allowed).toBe(false)
  })

  it('isolates buckets by key', () => {
    let t = 0
    const rl = createInMemoryRateLimit({ windowMs: 1000, max: 1, now: () => t })
    expect(rl.check('a').allowed).toBe(true)
    expect(rl.check('b').allowed).toBe(true)
    expect(rl.check('a').allowed).toBe(false)
  })

  it('resets the bucket when the window expires', () => {
    let t = 0
    const rl = createInMemoryRateLimit({ windowMs: 1000, max: 1, now: () => t })
    expect(rl.check('a').allowed).toBe(true)
    expect(rl.check('a').allowed).toBe(false)
    t = 1001
    expect(rl.check('a').allowed).toBe(true)
  })

  it('reports retryAfterMs when blocked', () => {
    let t = 0
    const rl = createInMemoryRateLimit({ windowMs: 1000, max: 1, now: () => t })
    rl.check('a')
    t = 200
    const decision = rl.check('a')
    expect(decision.allowed).toBe(false)
    expect(decision.retryAfterMs).toBe(800)
  })
})
