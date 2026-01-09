<template>
  <div class="min-h-screen bg-warmCream">
    <div class="fixed inset-0 opacity-[0.03] pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;200&quot; height=&quot;200&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cfilter id=&quot;noise&quot;%3E%3CfeTurbulence type=&quot;fractalNoise&quot; baseFrequency=&quot;0.9&quot; numOctaves=&quot;4&quot; /%3E%3C/filter%3E%3Crect width=&quot;100%25&quot; height=&quot;100%25&quot; filter=&quot;url(%23noise)&quot; /%3E%3C/svg%3E')" />

    <div class="relative">
      <!-- Header -->
      <header class="border-b border-deepTeal/10 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div class="container mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <NuxtLink to="/admin" class="text-deepTeal/60 hover:text-deepTeal transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </NuxtLink>
              <h1 class="text-2xl font-serif font-bold text-deepTeal">
                Catégories
              </h1>
            </div>

            <button
              type="button"
              class="px-4 py-2 bg-deepTeal text-white font-medium rounded-lg hover:bg-deepTeal/90 transition-all shadow-lg"
              @click="openCreateModal"
            >
              + Nouvelle catégorie
            </button>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-6 py-12">
        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-20">
          <div class="text-center">
            <div class="w-16 h-16 border-4 border-deepTeal/20 border-t-deepTeal rounded-full animate-spin mx-auto mb-4" />
            <p class="text-deepTeal/60">Chargement...</p>
          </div>
        </div>

        <!-- Categories List -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="category in categories"
            :key="category.id"
            class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div class="flex items-start justify-between mb-4">
              <div
                class="w-12 h-12 rounded-full flex-shrink-0"
                :style="{ backgroundColor: category.color }"
              />
              <div class="flex gap-2">
                <button
                  type="button"
                  class="p-2 text-deepTeal/60 hover:text-deepTeal hover:bg-deepTeal/5 rounded-lg transition-all"
                  @click="openEditModal(category)"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="p-2 text-terracotta/60 hover:text-terracotta hover:bg-terracotta/5 rounded-lg transition-all"
                  @click="confirmDelete(category)"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <h3 class="text-xl font-serif font-bold text-deepTeal mb-2">
              {{ category.name }}
            </h3>

            <p class="text-sm text-deepTeal/60 mb-4">
              {{ category.description || 'Aucune description' }}
            </p>

            <div class="flex items-center gap-2 text-xs text-deepTeal/60">
              <span class="px-2 py-1 bg-deepTeal/5 rounded font-mono">
                {{ category.color }}
              </span>
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
            <h2 class="text-2xl font-serif font-bold text-deepTeal mb-6">
              {{ editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
            </h2>

            <CategoryForm
              :category="editingCategory"
              :is-edit="!!editingCategory"
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
              <div class="w-16 h-16 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 class="text-xl font-serif font-bold text-deepTeal mb-2">
                Confirmer la suppression
              </h3>
              <p class="text-deepTeal/60">
                Êtes-vous sûr de vouloir supprimer la catégorie
                <span class="font-semibold text-deepTeal">{{ categoryToDelete?.name }}</span> ?
              </p>
              <p class="text-sm text-terracotta mt-2">
                Cette action ne peut pas être annulée.
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

            <p v-if="deleteError" class="text-terracotta text-sm mt-4 text-center">
              {{ deleteError }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types'
import CategoryForm from '~/components/admin/CategoryForm.vue'

definePageMeta({
  middleware: 'admin'
})

const { categories, fetchCategories, loading } = useCategories()

const showModal = ref(false)
const editingCategory = ref<Category | null>(null)
const showDeleteConfirm = ref(false)
const categoryToDelete = ref<Category | null>(null)
const deleting = ref(false)
const deleteError = ref<string | null>(null)

onMounted(() => {
  fetchCategories()
})

function openCreateModal() {
  editingCategory.value = null
  showModal.value = true
}

function openEditModal(category: Category) {
  editingCategory.value = category
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingCategory.value = null
}

async function handleSubmit(data: { name: string; color: string; description?: string }) {
  try {
    if (editingCategory.value) {
      // Update existing category
      await $fetch(`/api/admin/categories/${editingCategory.value.id}`, {
        method: 'PUT',
        body: data
      })
    }
    else {
      // Create new category
      await $fetch('/api/admin/categories', {
        method: 'POST',
        body: data
      })
    }

    closeModal()
    await fetchCategories()
  }
  catch (error) {
    console.error('Failed to save category:', error)
  }
}

function confirmDelete(category: Category) {
  categoryToDelete.value = category
  showDeleteConfirm.value = true
  deleteError.value = null
}

function closeDeleteConfirm() {
  showDeleteConfirm.value = false
  categoryToDelete.value = null
  deleteError.value = null
}

async function handleDelete() {
  if (!categoryToDelete.value) return

  deleting.value = true
  deleteError.value = null

  try {
    await $fetch(`/api/admin/categories/${categoryToDelete.value.id}`, {
      method: 'DELETE'
    })

    closeDeleteConfirm()
    await fetchCategories()
  }
  catch (error) {
    console.error('Failed to delete category:', error)
    deleteError.value = 'Impossible de supprimer cette catégorie. Elle contient peut-être des termes.'
  }
  finally {
    deleting.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
}

.font-serif {
  font-family: 'Crimson Pro', serif;
}

.bg-warmCream {
  background-color: #FAF9F6;
}

.text-deepTeal {
  color: #2D5F5D;
}

.bg-deepTeal {
  background-color: #2D5F5D;
}

.text-terracotta {
  color: #C1666B;
}

.bg-terracotta {
  background-color: #C1666B;
}
</style>
