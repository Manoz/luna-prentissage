export default defineEventHandler(async (event) => {
  await requireAdminAuth(event)

  try {
    const body = await readBody(event)
    const { root, meaning, category_id } = body

    if (!root || !meaning || !category_id) {
      throw createError({
        statusCode: 400,
        message: 'Root, meaning, and category_id are required'
      })
    }

    const term = await createTerm({ root, meaning, category_id })
    return term
  }
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to create term'
    })
  }
})
