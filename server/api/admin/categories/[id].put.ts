export default defineEventHandler(async (event) => {
  await requireAdminAuth(event)

  try {
    const id = getIdParam(event, 'category ID')

    const body = await readBody(event)
    validateCategoryInput(body, false)
    const category = await updateCategory(id, body)

    if (!category) {
      throw createError({
        statusCode: 404,
        message: 'Category not found',
      })
    }

    return category
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to update category',
    })
  }
})
