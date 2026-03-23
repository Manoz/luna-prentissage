export function useAdminAuth() {
  const isAuthenticated = useState('admin-authenticated', () => false)
  const username = useState<string | null>('admin-username', () => null)
  const loading = useState('admin-auth-loading', () => false)

  async function login(credentials: { username: string; password: string }) {
    loading.value = true

    try {
      const response = await $fetch('/api/admin/auth/login', {
        method: 'POST',
        body: credentials
      })

      isAuthenticated.value = true
      username.value = credentials.username

      return response
    }
    catch (_error) {
      isAuthenticated.value = false
      username.value = null
      throw _error
    }
    finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await $fetch('/api/admin/auth/logout', { method: 'POST' })
    }
    finally {
      isAuthenticated.value = false
      username.value = null
    }
  }

  async function checkAuth() {
    try {
      const response = await $fetch<{ authenticated: boolean; username?: string }>(
        '/api/admin/auth/status'
      )
      isAuthenticated.value = response.authenticated
      username.value = response.username || null
    }
    catch {
      isAuthenticated.value = false
      username.value = null
    }
  }

  return {
    isAuthenticated: readonly(isAuthenticated),
    username: readonly(username),
    loading: readonly(loading),
    login,
    logout,
    checkAuth
  }
}
