import type { H3Event } from 'h3'

/** Reads a numeric route param, rejecting anything that is not a plain positive integer. */
export function getIdParam(event: H3Event, label = 'ID'): number {
  const raw = getRouterParam(event, 'id') ?? ''

  if (!/^\d{1,9}$/.test(raw)) {
    throw createError({
      statusCode: 400,
      message: `Invalid ${label}`,
    })
  }

  return Number(raw)
}
