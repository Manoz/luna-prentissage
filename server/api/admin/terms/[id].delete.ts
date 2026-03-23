export default defineEventHandler(async (event) => {
  await requireAdminAuth(event)

  try {
    const id = Number.parseInt(getRouterParam(event, 'id') as string)

    if (Number.isNaN(id)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid term ID',
      })
    }

    await deleteTerm(id)
    return { success: true }
  } catch {
    throw createError({
      statusCode: 500,
      message: 'Failed to delete term',
    })
  }
})
