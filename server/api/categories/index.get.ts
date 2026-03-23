export default defineEventHandler(async () => {
  try {
    const categories = await getAllCategories()
    return categories
  } catch {
    throw createError({
      statusCode: 500,
      message: 'Failed to fetch categories',
    })
  }
})
