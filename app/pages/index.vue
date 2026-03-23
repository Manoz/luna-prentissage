<template>
  <div class="min-h-screen bg-warm-cream">
    <div class="relative">
      <!-- Navigation -->
      <nav class="container mx-auto px-6 py-8">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-serif font-bold text-deep-teal">
            Luna<span class="text-terracotta">·</span>Prentissage
          </h1>
          <NuxtLink
            to="/admin"
            class="hidden sm:inline text-sm text-deep-teal/60 hover:text-deep-teal hover:underline transition-colors"
          >
            Administration
          </NuxtLink>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="py-12 sm:py-20">
        <div class="container mx-auto px-6">
          <div class="max-w-4xl mx-auto text-center">
            <div class="inline-block mb-6">
              <span class="text-sm uppercase tracking-[0.3em] text-deep-teal font-medium">
                Terminologie Médicale
              </span>
            </div>

            <h2
              class="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-gray-900 leading-[0.95] mb-8"
            >
              Maîtrisez les
              <span class="block mt-2 italic text-gray-900">radicaux</span>
              médicaux
            </h2>

            <p class="text-base sm:text-xl text-gray-900 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              Une approche moderne pour apprendre et mémoriser les préfixes, suffixes et radicaux de
              la terminologie médicale.
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <NuxtLink
                to="/flashcards"
                class="group px-8 py-4 bg-white text-deep-teal font-medium rounded-full hover:bg-deep-teal hover:text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto"
              >
                <span class="flex items-center justify-center gap-2">
                  <svg
                    class="w-5 h-5 group-hover:rotate-12 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  Flashcards
                </span>
              </NuxtLink>

              <NuxtLink
                to="/quiz"
                class="group px-8 py-4 bg-white text-deep-teal font-medium rounded-full hover:bg-terracotta hover:text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto"
              >
                <span class="flex items-center justify-center gap-2">
                  <svg
                    class="w-5 h-5 group-hover:scale-110 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Mode Quiz
                </span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories Grid -->
      <section v-if="dataReady" class="container mx-auto px-6 py-20">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <h3 class="text-4xl font-serif font-bold text-deep-teal mb-4">
              Explorer par catégorie
            </h3>
            <p class="text-deep-teal/70 max-w-2xl mx-auto">
              Chaque catégorie regroupe des radicaux liés à un système ou concept médical
              spécifique.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <NuxtLink
              v-for="(category, index) in categories"
              :key="category.id"
              :to="`/flashcards?category=${category.id}`"
              class="group relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all hover:shadow-2xl hover:-translate-y-1 block"
              :style="{
                backgroundColor: category.color,
                animationDelay: `${index * 50}ms`,
              }"
              style="animation: fadeInUp 0.6s ease-out backwards"
            >
              <div class="relative z-10">
                <div class="flex items-start justify-between mb-3">
                  <span class="text-xs uppercase tracking-wider font-medium text-white/80">
                    {{ getTermCountForCategory(category.id) }} termes
                  </span>
                  <div
                    class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform"
                  >
                    <svg
                      class="w-4 h-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                <h4 class="text-xl font-serif font-bold text-white mb-2 leading-tight">
                  {{ category.name }}
                </h4>

                <p class="text-sm text-white/80 leading-relaxed">
                  {{ category.description }}
                </p>
              </div>

              <!-- Decorative gradient overlay -->
              <div
                class="absolute inset-0 bg-gradient-to-br from-white/0 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="container mx-auto px-6 py-12 border-t border-deep-teal/10">
        <div class="text-center text-deep-teal/60 text-sm">
          <p>Luna-Prentissage · Terminologie Médicale</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TermWithCategory } from '~/types'

const { categories, fetchCategories, loading } = useCategories()
const { terms, fetchTerms, loading: termsLoading } = useTerms()

const dataReady = computed(() => !loading.value && !termsLoading.value)

// Fetch data on mount
onMounted(async () => {
  await Promise.all([fetchCategories(), fetchTerms()])
})

function getTermCountForCategory(categoryId: number) {
  return terms.value.filter((t: TermWithCategory) => t.category_id === categoryId).length
}
</script>

<style>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
