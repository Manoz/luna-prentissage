<template>
  <main class="px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="kicker mb-2">Catégories</p>
        <h1 class="text-3xl font-semibold tracking-tight tabular-nums">
          {{ categories.length }} catégories
        </h1>
      </div>
      <button type="button" class="btn-primary" @click="openCreateModal">Nouvelle catégorie</button>
    </div>

    <div v-if="loading" role="status" class="py-24 text-sm text-ink-soft">Chargement…</div>

    <ul v-else class="mt-8 divide-y divide-line border-y border-line">
      <li
        v-for="category in categories"
        :key="category.id"
        class="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:gap-5"
      >
        <span class="flex min-w-0 flex-1 items-start gap-3">
          <span
            class="dot mt-1.5"
            :style="{ backgroundColor: category.color }"
            aria-hidden="true"
          />
          <span class="min-w-0">
            <span class="block font-medium">{{ category.name }}</span>
            <span class="block text-sm text-ink-soft">
              {{ category.description || 'Aucune description' }}
            </span>
          </span>
        </span>
        <span class="w-20 text-xs text-ink-faint uppercase">{{ category.color }}</span>
        <span class="flex gap-1">
          <button
            type="button"
            :aria-label="`Modifier la catégorie ${category.name}`"
            class="btn-ghost px-2.5 text-xs"
            @click="openEditModal(category)"
          >
            Modifier
          </button>
          <button
            type="button"
            :aria-label="`Supprimer la catégorie ${category.name}`"
            class="btn-ghost px-2.5 text-xs hover:bg-danger-soft hover:text-danger"
            @click="confirmDelete(category)"
          >
            Supprimer
          </button>
        </span>
      </li>
    </ul>

    <!-- Create/Edit Modal -->
    <AdminModal
      :open="showModal"
      :title="editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'"
      @close="closeModal"
    >
      <CategoryForm
        :category="editingCategory"
        :is-edit="!!editingCategory"
        :submitting="saving"
        :error="saveError"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </AdminModal>

    <!-- Delete Confirmation Modal -->
    <AdminModal
      :open="showDeleteConfirm"
      title="Supprimer cette catégorie ?"
      alert
      size="md"
      @close="closeDeleteConfirm"
    >
      <p class="text-sm text-ink-2">
        <span class="font-semibold text-ink">{{ categoryToDelete?.name }}</span> sera supprimée
        définitivement. Les termes qu'elle contient doivent d'abord être déplacés ou supprimés.
      </p>

      <div class="mt-6 flex gap-2">
        <button type="button" :disabled="deleting" class="btn-danger" @click="handleDelete">
          {{ deleting ? 'Suppression…' : 'Supprimer' }}
        </button>
        <button type="button" class="btn-secondary" @click="closeDeleteConfirm">Annuler</button>
      </div>

      <p v-if="deleteError" role="alert" class="mt-4 text-sm text-danger">
        {{ deleteError }}
      </p>
    </AdminModal>
  </main>
</template>

<script setup lang="ts">
import type { Category } from '~/types'
import CategoryForm from '~/components/admin/CategoryForm.vue'

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const { categories, fetchCategories, loading } = useCategories()

const showModal = ref(false)
const editingCategory = ref<Category | null>(null)
const showDeleteConfirm = ref(false)
const categoryToDelete = ref<Category | null>(null)
const deleting = ref(false)
const deleteError = ref<string | null>(null)
const saving = ref(false)
const saveError = ref<string | null>(null)

onMounted(() => {
  fetchCategories()
})

function openCreateModal() {
  editingCategory.value = null
  saveError.value = null
  showModal.value = true
}

function openEditModal(category: Category) {
  editingCategory.value = category
  saveError.value = null
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingCategory.value = null
  saveError.value = null
}

async function handleSubmit(data: { name: string; color: string; description?: string }) {
  saving.value = true
  saveError.value = null

  try {
    if (editingCategory.value) {
      await $fetch(`/api/admin/categories/${editingCategory.value.id}`, {
        method: 'PUT',
        body: data,
      })
    } else {
      await $fetch('/api/admin/categories', {
        method: 'POST',
        body: data,
      })
    }

    closeModal()
    await fetchCategories()
  } catch {
    saveError.value = "L'enregistrement a échoué. Vérifiez les champs et réessayez."
  } finally {
    saving.value = false
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
      method: 'DELETE',
    })

    closeDeleteConfirm()
    await fetchCategories()
  } catch {
    deleteError.value =
      'Impossible de supprimer cette catégorie. Elle contient peut-être des termes.'
  } finally {
    deleting.value = false
  }
}
</script>
