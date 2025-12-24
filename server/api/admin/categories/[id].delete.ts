export default defineEventHandler(async (event) => {
  await requireAdminAuth(event)

  try {
    const id = Number.parseInt(getRouterParam(event, 'id') as string)

    if (Number.isNaN(id)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid category ID'
      })
    }

    await deleteCategory(id)
    return { success: true }
  }
  catch (error: unknown) {
    throw createError({
      statusCode: 500,
      message: 'Failed to delete category. It may have associated terms.'
    })
  }
})
