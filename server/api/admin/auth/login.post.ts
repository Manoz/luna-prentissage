export default defineEventHandler(async (event) => {
  assertLoginNotRateLimited(event)

  try {
    const body = await readBody(event)
    validateLoginInput(body)
    const { username, password } = body

    if (verifyAdminCredentials(username, password)) {
      clearFailedLogins(event)
      await setAdminSession(event, username)
      return { success: true, message: 'Login successful' }
    }

    recordFailedLogin(event)
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials',
    })
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Login failed',
    })
  }
})
