export default defineEventHandler(async (event) => {
  await requireAdminAuth(event)

  try {
    const id = getIdParam(event, 'term ID')

    await deleteTerm(id)
    return { success: true }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to delete term',
    })
  }
})
