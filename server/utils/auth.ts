import type { H3Event } from 'h3'

export interface AdminSession {
  authenticated: boolean
  username?: string
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const config = useRuntimeConfig()
  return username === config.adminUsername && password === config.adminPassword
}

export async function getAdminSession(event: H3Event): Promise<AdminSession> {
  const session = await useSession<AdminSession>(event, {
    name: 'admin-session',
    password: useRuntimeConfig().sessionSecret,
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })

  return {
    authenticated: session.data.authenticated || false,
    username: session.data.username
  }
}

export async function setAdminSession(event: H3Event, username: string) {
  const session = await useSession<AdminSession>(event, {
    name: 'admin-session',
    password: useRuntimeConfig().sessionSecret,
    maxAge: 60 * 60 * 24 * 7
  })

  await session.update({
    authenticated: true,
    username
  })
}

export async function clearAdminSession(event: H3Event) {
  const session = await useSession<AdminSession>(event, {
    name: 'admin-session',
    password: useRuntimeConfig().sessionSecret
  })

  await session.clear()
}

export async function requireAdminAuth(event: H3Event): Promise<AdminSession> {
  const session = await getAdminSession(event)

  if (!session.authenticated) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized - Admin authentication required'
    })
  }

  return session
}
