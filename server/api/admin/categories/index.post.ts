export default defineEventHandler(async (event) => {
  await requireAdminAuth(event)

  try {
    const body = await readBody(event)
    validateCategoryInput(body, true)
    const { name, color, description } = body

    const category = await createCategory({ name, color, description })
    return category
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to create category',
    })
  }
})
