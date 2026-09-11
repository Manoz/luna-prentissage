const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

/**
 * Defence in depth on top of the SameSite=Strict session cookie: state-changing
 * requests to the admin API must come from this origin.
 */
export default defineEventHandler((event) => {
  if (SAFE_METHODS.has(event.method)) return
  if (!getRequestURL(event).pathname.startsWith('/api/admin/')) return

  const secFetchSite = getRequestHeader(event, 'sec-fetch-site')
  if (secFetchSite === 'same-origin') return

  const origin = getRequestHeader(event, 'origin')
  const host = getRequestHost(event, { xForwardedHost: true })
  if (origin) {
    try {
      if (new URL(origin).host === host) return
    } catch {
      // malformed Origin header: fall through and reject
    }
  }

  throw createError({
    statusCode: 403,
    message: 'Cross-site request rejected',
  })
})
