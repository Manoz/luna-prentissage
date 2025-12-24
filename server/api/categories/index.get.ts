export default defineEventHandler(async () => {
  try {
    const categories = await getAllCategories()
    return categories
  }
  catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch categories'
    })
  }
})
