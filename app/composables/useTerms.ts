import type { TermWithCategory } from '~/types'

export function useTerms() {
  const terms = useState<TermWithCategory[]>('terms', () => [])
  const loading = useState('terms-loading', () => false)
  const error = useState<string | null>('terms-error', () => null)

  async function fetchTerms(categoryId?: number) {
    loading.value = true
    error.value = null

    try {
      const params = categoryId ? { categoryId: categoryId.toString() } : {}
      const data = await $fetch<TermWithCategory[]>('/api/terms', { params })
      terms.value = data
    } catch (e) {
      error.value = 'Failed to load terms'
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  function getTermsByCategory(categoryId: number) {
    return computed(() => terms.value.filter((t) => t.category_id === categoryId))
  }

  function shuffleTerms() {
    terms.value = [...terms.value].sort(() => Math.random() - 0.5)
  }

  return {
    terms: readonly(terms),
    loading: readonly(loading),
    error: readonly(error),
    fetchTerms,
    getTermsByCategory,
    shuffleTerms,
  }
}
