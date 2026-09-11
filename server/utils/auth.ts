import { createHash, timingSafeEqual } from 'node:crypto'
import type { H3Event } from 'h3'

export interface AdminSession {
  authenticated: boolean
  username?: string
  /** Fingerprint of the password the session was opened with (see passwordFingerprint) */
  fingerprint?: string
}

function sha256(value: string): Buffer {
  return createHash('sha256').update(value).digest()
}

/**
 * Short, non-reversible fingerprint of the current admin password. Stored in
 * the session so that rotating ADMIN_PASSWORD invalidates existing sessions.
 */
function passwordFingerprint(): string {
  return sha256(useRuntimeConfig().adminPassword).toString('hex').slice(0, 16)
}

function getSessionConfig() {
  return {
    name: 'admin-session',
    password: useRuntimeConfig().sessionSecret,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    cookie: { sameSite: 'strict' as const },
  }
}

function useAdminSession(event: H3Event) {
  return useSession<AdminSession>(event, getSessionConfig())
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const config = useRuntimeConfig()
  if (!config.adminPassword) return false

  // Hash both sides so the buffers have equal length, then compare in constant time
  const usernameMatches = timingSafeEqual(sha256(username), sha256(config.adminUsername))
  const passwordMatches = timingSafeEqual(sha256(password), sha256(config.adminPassword))
  return usernameMatches && passwordMatches
}

export async function getAdminSession(event: H3Event): Promise<AdminSession> {
  const session = await useAdminSession(event)
  const { authenticated, username, fingerprint } = session.data

  if (!authenticated || fingerprint !== passwordFingerprint()) {
    return { authenticated: false }
  }

  return { authenticated: true, username }
}

export async function setAdminSession(event: H3Event, username: string) {
  const session = await useAdminSession(event)

  await session.update({
    authenticated: true,
    username,
    fingerprint: passwordFingerprint(),
  })
}

export async function clearAdminSession(event: H3Event) {
  const session = await useAdminSession(event)

  await session.clear()
}

export async function requireAdminAuth(event: H3Event): Promise<AdminSession> {
  const session = await getAdminSession(event)

  if (!session.authenticated) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized - Admin authentication required',
    })
  }

  return session
}
