<template>
  <main class="px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
    <div class="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p class="kicker mb-2">Termes</p>
        <h1 class="text-3xl font-semibold tracking-tight tabular-nums">
          {{ terms.length }} termes
        </h1>
      </div>
      <button type="button" class="btn-primary" @click="openCreateModal">Nouveau terme</button>
    </div>

    <!-- Filters -->
    <div class="mt-8 grid grid-cols-1 gap-2 md:grid-cols-[1fr_260px]">
      <div>
        <label for="terms-search" class="sr-only">Rechercher</label>
        <input
          id="terms-search"
          v-model="searchQuery"
          type="search"
          placeholder="Rechercher un radical ou une signification"
          class="field"
        />
      </div>
      <div>
        <label for="terms-category" class="sr-only">Filtrer par catégorie</label>
        <select id="terms-category" v-model="filterCategoryId" class="field">
          <option :value="null">Toutes les catégories</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>

    <div
      class="mt-3 flex items-center justify-between text-xs text-ink-faint tabular-nums"
      aria-live="polite"
    >
      <span>{{ filteredTerms.length }} résultat{{ filteredTerms.length > 1 ? 's' : '' }}</span>
      <span>Page {{ currentPage }} / {{ totalPages || 1 }}</span>
    </div>

    <div v-if="loading" role="status" class="py-24 text-sm text-ink-soft">Chargement…</div>

    <div v-else class="mt-2 overflow-x-auto">
      <table class="w-full border-y border-line text-sm">
        <caption class="sr-only">
          Termes médicaux, page
          {{
            currentPage
          }}
          sur
          {{
            totalPages
          }}
        </caption>
        <thead>
          <tr class="border-b border-line">
            <th scope="col" class="kicker py-2.5 pr-4 text-left font-semibold">Radical</th>
            <th scope="col" class="kicker py-2.5 pr-4 text-left font-semibold">Signification</th>
            <th scope="col" class="kicker py-2.5 pr-4 text-left font-semibold">Catégorie</th>
            <th scope="col" class="py-2.5 text-right"><span class="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-line">
          <tr v-if="paginatedTerms.length === 0">
            <td colspan="4" class="py-12 text-center text-ink-soft">
              Aucun terme ne correspond à cette recherche.
            </td>
          </tr>
          <tr
            v-for="term in paginatedTerms"
            :key="term.id"
            class="transition-colors hover:bg-ink/4"
          >
            <td class="py-2 pr-4 font-medium whitespace-nowrap">{{ term.root }}</td>
            <td class="py-2 pr-4 text-ink-2">{{ term.meaning }}</td>
            <td class="py-2 pr-4">
              <span class="inline-flex items-center gap-2 whitespace-nowrap text-ink-2">
                <span
                  class="dot"
                  :style="{ backgroundColor: term.category_color }"
                  aria-hidden="true"
                />
                {{ term.category_name }}
              </span>
            </td>
            <td class="py-1">
              <div class="flex items-center justify-end gap-1">
                <button
                  type="button"
                  :aria-label="`Modifier le terme ${term.root}`"
                  class="btn-ghost min-h-8 px-2 text-xs"
                  @click="openEditModal(term)"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  :aria-label="`Supprimer le terme ${term.root}`"
                  class="btn-ghost min-h-8 px-2 text-xs hover:bg-danger-soft hover:text-danger"
                  @click="confirmDelete(term)"
                >
                  Supprimer
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <nav
        v-if="totalPages > 1"
        aria-label="Pagination"
        class="flex items-center justify-between py-3"
      >
        <button
          type="button"
          :disabled="currentPage === 1"
          class="btn-secondary"
          @click="currentPage--"
        >
          ← Précédent
        </button>
        <div class="flex items-center gap-0.5">
          <button
            v-for="page in visiblePages"
            :key="page"
            type="button"
            :aria-label="`Page ${page}`"
            :aria-current="page === currentPage ? 'page' : undefined"
            class="size-9 rounded text-[13px] tabular-nums transition-colors"
            :class="
              page === currentPage
                ? 'bg-ink text-paper'
                : 'text-ink-soft hover:bg-ink/6 hover:text-ink'
            "
            @click="currentPage = page"
          >
            {{ page }}
          </button>
        </div>
        <button
          type="button"
          :disabled="currentPage === totalPages"
          class="btn-secondary"
          @click="currentPage++"
        >
          Suivant →
        </button>
      </nav>
    </div>

    <!-- Create/Edit Modal -->
    <AdminModal
      :open="showModal"
      :title="editingTerm ? 'Modifier le terme' : 'Nouveau terme'"
      @close="closeModal"
    >
      <AdminTermForm
        :key="editingTerm?.id || 'new'"
        :term="editingTerm"
        :categories="categories"
        :is-edit="!!editingTerm"
        :submitting="saving"
        :error="saveError"
        @submit="handleSubmit"
        @cancel="closeModal"
      />
    </AdminModal>

    <!-- Delete Confirmation Modal -->
    <AdminModal
      :open="showDeleteConfirm"
      title="Supprimer ce terme ?"
      alert
      size="md"
      @close="closeDeleteConfirm"
    >
      <p class="text-sm text-ink-2">
        <span class="font-semibold text-ink">{{ termToDelete?.root }}</span> sera supprimé
        définitivement.
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
import type { Term, TermWithCategory } from '~/types'

definePageMeta({
  middleware: 'admin',
  layout: 'admin',
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
const deleteError = ref<string | null>(null)
const saving = ref(false)
const saveError = ref<string | null>(null)

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
  saveError.value = null
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
  saveError.value = null
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingTerm.value = null
  saveError.value = null
}

async function handleSubmit(data: { root: string; meaning: string; category_id: number }) {
  saving.value = true
  saveError.value = null

  try {
    if (editingTerm.value) {
      await $fetch(`/api/admin/terms/${editingTerm.value.id}`, {
        method: 'PUT',
        body: data,
      })
    } else {
      await $fetch('/api/admin/terms', {
        method: 'POST',
        body: data,
      })
    }

    closeModal()
    await fetchTerms()
  } catch {
    saveError.value = "L'enregistrement a échoué. Vérifiez les champs et réessayez."
  } finally {
    saving.value = false
  }
}

function confirmDelete(term: TermWithCategory) {
  termToDelete.value = term
  deleteError.value = null
  showDeleteConfirm.value = true
}

function closeDeleteConfirm() {
  showDeleteConfirm.value = false
  termToDelete.value = null
  deleteError.value = null
}

async function handleDelete() {
  if (!termToDelete.value) return

  deleting.value = true
  deleteError.value = null

  try {
    await $fetch(`/api/admin/terms/${termToDelete.value.id}`, {
      method: 'DELETE',
    })

    closeDeleteConfirm()
    await fetchTerms()
  } catch {
    deleteError.value = 'La suppression a échoué. Veuillez réessayer.'
  } finally {
    deleting.value = false
  }
}
</script>
