export default defineEventHandler(async (event) => {
  await requireAdminAuth(event)

  try {
    const id = Number.parseInt(getRouterParam(event, 'id') as string)

    if (Number.isNaN(id)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid term ID'
      })
    }

    const body = await readBody(event)
    const term = await updateTerm(id, body)

    if (!term) {
      throw createError({
        statusCode: 404,
        message: 'Term not found'
      })
    }

    return term
  }
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Failed to update term'
    })
  }
})
