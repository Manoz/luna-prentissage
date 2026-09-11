<template>
  <main class="px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
    <div class="max-w-3xl">
      <p class="kicker mb-2">Terminologie médicale</p>
      <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">
        Radicaux, préfixes et suffixes
      </h1>
      <p v-if="dataReady" class="mt-3 text-ink-soft">
        <span class="font-medium text-ink tabular-nums">{{ terms.length }}</span> termes répartis en
        <span class="font-medium text-ink tabular-nums">{{ categories.length }}</span> catégories.
        Révisez-les fiche par fiche, puis vérifiez ce qui est retenu avec un quiz.
      </p>

      <div class="mt-6 flex flex-wrap gap-2">
        <NuxtLink to="/flashcards" class="btn-primary">Réviser les fiches</NuxtLink>
        <NuxtLink to="/quiz" class="btn-secondary">Lancer un quiz</NuxtLink>
      </div>
    </div>

    <section v-if="dataReady" class="mt-12 max-w-3xl">
      <p class="kicker mb-3">Par catégorie</p>
      <ul class="divide-y divide-line border-y border-line">
        <li
          v-for="category in categories"
          :key="category.id"
          class="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:gap-4"
        >
          <span class="flex min-w-0 flex-1 items-center gap-3">
            <span class="dot" :style="{ backgroundColor: category.color }" aria-hidden="true" />
            <span class="min-w-0">
              <span class="block text-sm font-medium">{{ category.name }}</span>
              <span class="block truncate text-xs text-ink-faint">{{ category.description }}</span>
            </span>
          </span>
          <span class="w-20 text-xs text-ink-faint tabular-nums sm:text-right">
            {{ countFor(category.id) }} termes
          </span>
          <span class="flex gap-1">
            <NuxtLink :to="`/flashcards?category=${category.id}`" class="btn-ghost px-2.5 text-xs">
              Fiches
            </NuxtLink>
            <NuxtLink :to="`/quiz?category=${category.id}`" class="btn-ghost px-2.5 text-xs">
              Quiz
            </NuxtLink>
          </span>
        </li>
      </ul>
    </section>
  </main>
</template>

<script setup lang="ts">
import type { TermWithCategory } from '~/types'

const { categories, fetchCategories, loading } = useCategories()
const { terms, fetchTerms, loading: termsLoading } = useTerms()

const dataReady = computed(() => !loading.value && !termsLoading.value)

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchTerms()])
})

function countFor(categoryId: number) {
  return terms.value.filter((t: TermWithCategory) => t.category_id === categoryId).length
}
</script>
