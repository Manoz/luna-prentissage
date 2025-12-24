export default defineNuxtRouteMiddleware(async () => {
  // Check authentication status from API
  const { data, error } = await useFetch('/api/admin/auth/status')

  if (error.value || !data.value?.authenticated) {
    return navigateTo('/admin/login')
  }
})
