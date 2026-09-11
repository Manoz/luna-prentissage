import type { H3Event } from 'h3'

interface Bucket {
  count: number
  resetAt: number
}

const WINDOW_MS = 15 * 60 * 1000
const MAX_ATTEMPTS = 5

// Per-instance memory. Good enough for a single admin: Fluid Compute reuses
// instances, and a cold start only resets the counter for that instance.
const buckets = new Map<string, Bucket>()

function clientKey(event: H3Event): string {
  return getRequestIP(event, { xForwardedFor: true }) || 'unknown'
}

function prune(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key)
  }
}

/** Throws 429 when the client exceeded MAX_ATTEMPTS failed attempts in the window. */
export function assertLoginNotRateLimited(event: H3Event) {
  const now = Date.now()
  prune(now)

  const bucket = buckets.get(clientKey(event))
  if (bucket && bucket.count >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000)
    setResponseHeader(event, 'Retry-After', retryAfter)
    throw createError({
      statusCode: 429,
      message: 'Too many login attempts. Try again later.',
    })
  }
}

export function recordFailedLogin(event: H3Event) {
  const now = Date.now()
  const key = clientKey(event)
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS })
  } else {
    bucket.count++
  }
}

export function clearFailedLogins(event: H3Event) {
  buckets.delete(clientKey(event))
}
