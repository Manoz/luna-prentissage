<template>
  <div class="min-h-screen bg-warm-cream">
    <div
      class="fixed inset-0 opacity-[0.03] pointer-events-none"
      style="
        background-image: url('data:image/svg+xml,%3Csvg width=&quot;200&quot; height=&quot;200&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cfilter id=&quot;noise&quot;%3E%3CfeTurbulence type=&quot;fractalNoise&quot; baseFrequency=&quot;0.9&quot; numOctaves=&quot;4&quot; /%3E%3C/filter%3E%3Crect width=&quot;100%25&quot; height=&quot;100%25&quot; filter=&quot;url(%23noise)&quot; /%3E%3C/svg%3E');
      "
    />

    <div class="relative">
      <!-- Header -->
      <header class="border-b border-deep-teal/10 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div class="container mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <NuxtLink
                to="/admin"
                class="text-deep-teal/60 hover:text-deep-teal transition-colors"
              >
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </NuxtLink>
              <h1 class="text-2xl font-serif font-bold text-deep-teal">Termes médicaux</h1>
            </div>

            <button
              type="button"
              class="px-4 py-2 bg-deep-teal text-white font-medium rounded-lg hover:bg-deep-teal/90 transition-all shadow-lg"
              @click="openCreateModal"
            >
              + Nouveau terme
            </button>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-6 py-12">
        <!-- Filters -->
        <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-deep-teal mb-2"> Rechercher </label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher par radical ou signification..."
                class="w-full px-4 py-2 border-2 border-deep-teal/20 rounded-lg focus:border-deep-teal focus:outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-deep-teal mb-2">
                Filtrer par catégorie
              </label>
              <select
                v-model="filterCategoryId"
                class="w-full px-4 py-2 border-2 border-deep-teal/20 rounded-lg focus:border-deep-teal focus:outline-none"
              >
                <option :value="null">Toutes les catégories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
          </div>

          <div class="mt-4 flex items-center justify-between text-sm text-deep-teal/60">
            <span>{{ filteredTerms.length }} terme(s) trouvé(s)</span>
            <span>Page {{ currentPage }} sur {{ totalPages }}</span>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div
              class="w-16 h-16 border-4 border-deep-teal/20 border-t-deep-teal rounded-full animate-spin mx-auto mb-4"
            />
            <p class="text-deep-teal/60">Chargement...</p>
          </div>
        </div>

        <!-- Terms Table -->
        <div v-else class="bg-white rounded-xl shadow-lg overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-deep-teal/5 border-b border-deep-teal/10">
                <tr>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-deep-teal">Radical</th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-deep-teal">
                    Signification
                  </th>
                  <th class="px-6 py-4 text-left text-sm font-semibold text-deep-teal">
                    Catégorie
                  </th>
                  <th class="px-6 py-4 text-right text-sm font-semibold text-deep-teal">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-deep-teal/10">
                <tr
                  v-for="term in paginatedTerms"
                  :key="term.id"
                  class="hover:bg-deep-teal/5 transition-colors"
                >
                  <td class="px-6 py-4">
                    <span class="font-semibold text-deep-teal">{{ term.root }}</span>
                  </td>
                  <td class="px-6 py-4 text-deep-teal/70">
                    {{ term.meaning }}
                  </td>
                  <td class="px-6 py-4">
                    <span
                      class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm text-white"
                      :style="{ backgroundColor: term.category_color }"
                    >
                      {{ term.category_name }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        class="p-2 text-deep-teal/60 hover:text-deep-teal hover:bg-deep-teal/5 rounded-lg transition-all"
                        @click="openEditModal(term)"
                      >
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        type="button"
                        class="p-2 text-terracotta/60 hover:text-terracotta hover:bg-terracotta/5 rounded-lg transition-all"
                        @click="confirmDelete(term)"
                      >
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="px-6 py-4 border-t border-deep-teal/10">
            <div class="flex items-center justify-between">
              <button
                type="button"
                :disabled="currentPage === 1"
                class="px-4 py-2 text-sm font-medium text-deep-teal border-2 border-deep-teal/20 rounded-lg hover:bg-deep-teal/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                @click="currentPage--"
              >
                Précédent
              </button>

              <div class="flex items-center gap-2">
                <button
                  v-for="page in visiblePages"
                  :key="page"
                  type="button"
                  class="w-10 h-10 rounded-lg font-medium transition-all"
                  :class="{
                    'bg-deep-teal text-white': page === currentPage,
                    'text-deep-teal hover:bg-deep-teal/5': page !== currentPage,
                  }"
                  @click="currentPage = page"
                >
                  {{ page }}
                </button>
              </div>

              <button
                type="button"
                :disabled="currentPage === totalPages"
                class="px-4 py-2 text-sm font-medium text-deep-teal border-2 border-deep-teal/20 rounded-lg hover:bg-deep-teal/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                @click="currentPage++"
              >
                Suivant
              </button>
            </div>
          </div>
        </div>

        <!-- Create/Edit Modal -->
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          @click.self="closeModal"
        >
          <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8">
            <h2 class="text-2xl font-serif font-bold text-deep-teal mb-6">
              {{ editingTerm ? 'Modifier le terme' : 'Nouveau terme' }}
            </h2>

            <AdminTermForm
              :key="editingTerm?.id || 'new'"
              :term="editingTerm"
              :categories="categories"
              :is-edit="!!editingTerm"
              @submit="handleSubmit"
              @cancel="closeModal"
            />
          </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div
          v-if="showDeleteConfirm"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          @click.self="closeDeleteConfirm"
        >
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div class="text-center mb-6">
              <div
                class="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg
                  class="w-8 h-8 text-terracotta"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 class="text-xl font-serif font-bold text-deep-teal mb-2">
                Confirmer la suppression
              </h3>
              <p class="text-deep-teal/60">
                Êtes-vous sûr de vouloir supprimer le terme
                <span class="font-semibold text-deep-teal">{{ termToDelete?.root }}</span> ?
              </p>
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                class="flex-1 px-4 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all"
                @click="closeDeleteConfirm"
              >
                Annuler
              </button>
              <button
                type="button"
                :disabled="deleting"
                class="flex-1 px-4 py-3 bg-terracotta text-white font-semibold rounded-lg hover:bg-terracotta/90 transition-all disabled:opacity-50"
                @click="handleDelete"
              >
                {{ deleting ? 'Suppression...' : 'Supprimer' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Term, TermWithCategory } from '~/types'

definePageMeta({
  middleware: 'admin',
})

const { categories, fetchCategories } = useCategories()
const { terms, fetchTerms, loading } = useTerms()

const searchQuery = ref('')
const filterCategoryId = ref<number | null>(null)
const currentPage = ref(1)
const perPage = 20

const showModal = ref(false)
const editingTerm = ref<Term | null>(null)
const showDeleteConfirm = ref(false)
const termToDelete = ref<TermWithCategory | null>(null)
const deleting = ref(false)

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchTerms()])
})

const filteredTerms = computed(() => {
  let filtered = terms.value

  // Filter by category
  if (filterCategoryId.value !== null) {
    filtered = filtered.filter((t: TermWithCategory) => t.category_id === filterCategoryId.value)
  }

  // Search by root or meaning
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(
      (t: TermWithCategory) =>
        t.root.toLowerCase().includes(query) || t.meaning.toLowerCase().includes(query),
    )
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredTerms.value.length / perPage)
})

const paginatedTerms = computed(() => {
  const start = (currentPage.value - 1) * perPage
  const end = start + perPage
  return filteredTerms.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  const end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Reset to page 1 when filters change
watch([searchQuery, filterCategoryId], () => {
  currentPage.value = 1
})

function openCreateModal() {
  editingTerm.value = null
  showModal.value = true
}

function openEditModal(term: TermWithCategory) {
  editingTerm.value = {
    id: term.id,
    root: term.root,
    meaning: term.meaning,
    category_id: term.category_id,
    created_at: term.created_at,
    updated_at: term.updated_at,
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingTerm.value = null
}

async function handleSubmit(data: { root: string; meaning: string; category_id: number }) {
  try {
    if (editingTerm.value) {
      // Update existing term
      await $fetch(`/api/admin/terms/${editingTerm.value.id}`, {
        method: 'PUT',
        body: data,
      })
    } else {
      // Create new term
      await $fetch('/api/admin/terms', {
        method: 'POST',
        body: data,
      })
    }

    closeModal()
    await fetchTerms()
  } catch (error) {
    console.error('Failed to save term:', error)
  }
}

function confirmDelete(term: TermWithCategory) {
  termToDelete.value = term
  showDeleteConfirm.value = true
}

function closeDeleteConfirm() {
  showDeleteConfirm.value = false
  termToDelete.value = null
}

async function handleDelete() {
  if (!termToDelete.value) return

  deleting.value = true

  try {
    await $fetch(`/api/admin/terms/${termToDelete.value.id}`, {
      method: 'DELETE',
    })

    closeDeleteConfirm()
    await fetchTerms()
  } catch (error) {
    console.error('Failed to delete term:', error)
  } finally {
    deleting.value = false
  }
}
</script>
