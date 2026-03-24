export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    validateLoginInput(body)
    const { username, password } = body

    if (verifyAdminCredentials(username, password)) {
      await setAdminSession(event, username)
      return { success: true, message: 'Login successful' }
    } else {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials',
      })
    }
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
