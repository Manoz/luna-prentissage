<template>
  <main class="px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
    <p class="kicker mb-2">Tableau de bord</p>
    <h1 class="text-3xl font-semibold tracking-tight">Contenu de l'application</h1>

    <dl
      v-if="!loading"
      class="mt-8 grid max-w-2xl grid-cols-3 divide-x divide-line border-y border-line py-5"
    >
      <div v-for="stat in stats" :key="stat.label" class="px-4 first:pl-0">
        <dt class="text-xs text-ink-faint">{{ stat.label }}</dt>
        <dd class="mt-1 text-3xl font-semibold tracking-tight tabular-nums">{{ stat.value }}</dd>
      </div>
    </dl>

    <ul class="mt-10 flex max-w-2xl flex-col divide-y divide-line border-y border-line">
      <li v-for="action in actions" :key="action.to">
        <NuxtLink
          :to="action.to"
          class="group flex items-center justify-between gap-4 py-4 transition-colors hover:text-accent"
        >
          <span>
            <span class="block font-medium">{{ action.title }}</span>
            <span class="block text-sm text-ink-soft">{{ action.description }}</span>
          </span>
          <span
            class="text-ink-faint transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
            >→</span
          >
        </NuxtLink>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin',
  layout: 'admin',
})

const { categories, fetchCategories, loading: categoriesLoading } = useCategories()
const { terms, fetchTerms, loading: termsLoading } = useTerms()

const loading = computed(() => categoriesLoading.value || termsLoading.value)

const averageTermsPerCategory = computed(() => {
  if (categories.value.length === 0) return 0
  return Math.round(terms.value.length / categories.value.length)
})

const stats = computed(() => [
  { label: 'Catégories', value: categories.value.length },
  { label: 'Termes', value: terms.value.length },
  { label: 'Termes par catégorie', value: averageTermsPerCategory.value },
])

const actions = [
  {
    to: '/admin/categories',
    title: 'Catégories',
    description: 'Ajouter, renommer, recolorer ou supprimer des catégories',
  },
  {
    to: '/admin/terms',
    title: 'Termes',
    description: 'Ajouter, corriger ou supprimer des radicaux et leur signification',
  },
]

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchTerms()])
})
</script>
