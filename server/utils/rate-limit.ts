import type { H3Event } from 'h3'

interface Bucket {
  count: number
  resetAt: number
}

interface RateLimiterOptions {
  /** Sliding window length */
  windowMs: number
  /** Hits allowed per key within the window */
  max: number
  /** Message of the 429 error */
  message: string
}

// Per-instance memory. Good enough for a single admin and a classroom-sized
// audience: Fluid Compute reuses instances, and a cold start only resets the
// counters for that instance.
function createRateLimiter({ windowMs, max, message }: RateLimiterOptions) {
  const buckets = new Map<string, Bucket>()

  function prune(now: number) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key)
    }
  }

  /** Throws 429 when the key reached `max` hits in the current window. */
  function assert(key: string) {
    const now = Date.now()
    prune(now)

    const bucket = buckets.get(key)
    if (bucket && bucket.count >= max) {
      throw createError({
        statusCode: 429,
        message,
        data: { retryAfter: Math.ceil((bucket.resetAt - now) / 1000) },
      })
    }
  }

  function record(key: string) {
    const now = Date.now()
    const bucket = buckets.get(key)

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs })
    } else {
      bucket.count++
    }
  }

  function clear(key: string) {
    buckets.delete(key)
  }

  return { assert, record, clear }
}

export function clientKey(event: H3Event): string {
  return getRequestIP(event, { xForwardedFor: true }) || 'unknown'
}

/** Sets Retry-After from a 429 thrown by a limiter, then rethrows. */
export function withRetryAfter(event: H3Event, error: unknown): never {
  if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 429) {
    const retryAfter = (error as { data?: { retryAfter?: number } }).data?.retryAfter
    if (retryAfter) setResponseHeader(event, 'Retry-After', retryAfter)
  }
  throw error
}

// Admin login: 5 failed attempts per IP, 15-minute window
const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Too many login attempts. Try again later.',
})

export function assertLoginNotRateLimited(event: H3Event) {
  try {
    loginLimiter.assert(clientKey(event))
  } catch (error) {
    withRetryAfter(event, error)
  }
}

export function recordFailedLogin(event: H3Event) {
  loginLimiter.record(clientKey(event))
}

export function clearFailedLogins(event: H3Event) {
  loginLimiter.clear(clientKey(event))
}

// Tutor: 20 messages per IP per 10 minutes, and a global daily ceiling that
// bounds the bill whatever the number of visitors.
const tutorClientLimiter = createRateLimiter({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: 'Trop de questions en peu de temps. Réessayez dans quelques minutes.',
})

const tutorGlobalLimiter = createRateLimiter({
  windowMs: 24 * 60 * 60 * 1000,
  max: 400,
  message: 'Le tuteur a atteint sa limite quotidienne. Réessayez demain.',
})

const GLOBAL_KEY = 'global'

export function assertTutorNotRateLimited(event: H3Event) {
  try {
    tutorGlobalLimiter.assert(GLOBAL_KEY)
    tutorClientLimiter.assert(clientKey(event))
  } catch (error) {
    withRetryAfter(event, error)
  }
}

export function recordTutorMessage(event: H3Event) {
  tutorGlobalLimiter.record(GLOBAL_KEY)
  tutorClientLimiter.record(clientKey(event))
}
