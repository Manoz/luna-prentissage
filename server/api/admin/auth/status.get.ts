export default defineEventHandler(async (event) => {
  const session = await getAdminSession(event)
  return session
})
