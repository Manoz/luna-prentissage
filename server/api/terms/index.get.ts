export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const categoryId = query.categoryId ? Number.parseInt(query.categoryId as string) : null

    if (categoryId) {
      const terms = await getTermsByCategory(categoryId)
      return terms
    }

    const terms = await getAllTerms()
    return terms
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch terms'
    })
  }
})
