import type { Category } from '~/types'

export function useCategories() {
  const categories = useState<Category[]>('categories', () => [])
  const loading = useState('categories-loading', () => false)
  const error = useState<string | null>('categories-error', () => null)

  async function fetchCategories() {
    loading.value = true
    error.value = null

    try {
      const data = await $fetch<Category[]>('/api/categories')
      categories.value = data
    } catch (e) {
      error.value = 'Failed to load categories'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  return {
    categories: readonly(categories),
    loading: readonly(loading),
    error: readonly(error),
    fetchCategories,
  }
}
