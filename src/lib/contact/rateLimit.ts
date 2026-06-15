export interface RateLimitDecision {
  allowed: boolean
  remaining: number
  retryAfterMs: number
}

export interface RateLimiter {
  check(key: string): RateLimitDecision
}

export interface RateLimitOptions {
  windowMs: number
  max: number
  now?: () => number
}

interface Bucket {
  resetAt: number
  count: number
}

export function createInMemoryRateLimit({
  windowMs,
  max,
  now = () => Date.now(),
}: RateLimitOptions): RateLimiter {
  const store = new Map<string, Bucket>()
  return {
    check(key: string): RateLimitDecision {
      const t = now()
      const existing = store.get(key)
      if (!existing || t >= existing.resetAt) {
        store.set(key, { resetAt: t + windowMs, count: 1 })
        return { allowed: true, remaining: max - 1, retryAfterMs: 0 }
      }
      if (existing.count >= max) {
        return {
          allowed: false,
          remaining: 0,
          retryAfterMs: Math.max(0, existing.resetAt - t),
        }
      }
      existing.count += 1
      return { allowed: true, remaining: max - existing.count, retryAfterMs: 0 }
    },
  }
}
