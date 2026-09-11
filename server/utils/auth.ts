import type { H3Event } from 'h3'

export interface AdminSession {
  authenticated: boolean
  username?: string
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
  return username === config.adminUsername && password === config.adminPassword
}

export async function getAdminSession(event: H3Event): Promise<AdminSession> {
  const session = await useAdminSession(event)

  return {
    authenticated: session.data.authenticated || false,
    username: session.data.username,
  }
}

export async function setAdminSession(event: H3Event, username: string) {
  const session = await useAdminSession(event)

  await session.update({
    authenticated: true,
    username,
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
