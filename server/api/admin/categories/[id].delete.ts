export default defineEventHandler(async (event) => {
  await requireAdminAuth(event)

  try {
    const id = getIdParam(event, 'category ID')

    await deleteCategory(id)
    return { success: true }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    // Postgres foreign_key_violation: terms still reference this category
    if (error && typeof error === 'object' && 'code' in error && error.code === '23503') {
      throw createError({
        statusCode: 409,
        message: 'Category still has associated terms',
      })
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to delete category',
    })
  }
})
