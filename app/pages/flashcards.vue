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
      <header class="border-b border-deep-teal/10">
        <div class="container mx-auto px-6 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <NuxtLink
                to="/"
                class="text-deep-teal/60 hover:text-deep-teal transition-colors"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </NuxtLink>
              <h1 class="text-2xl font-serif font-bold text-deep-teal">
                Flashcards
              </h1>
            </div>

            <button
              v-if="filteredTerms.length > 0"
              type="button"
              class="px-4 py-2 text-sm font-medium hover:text-deep-teal border border-deep-teal/20 rounded-full hover:bg-deep-teal/5 transition-all"
              @click="handleShuffle"
            >
              <span class="flex items-center gap-2">
                <svg
                  class="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Mélanger
              </span>
            </button>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-6 py-12">
        <div class="grid lg:grid-cols-[280px_1fr] gap-8">
          <!-- Sidebar - Category Filter -->
          <aside class="lg:sticky lg:top-6 h-fit">
            <CategoryFilter
              :categories="categories"
              :selected-category-id="selectedCategoryId"
              @select="handleCategorySelect"
            />
          </aside>

          <!-- Main Content -->
          <main>
            <!-- Loading State -->
            <div v-if="loading" class="flex items-center justify-center py-20">
              <div class="text-center">
                <div
                  class="w-16 h-16 border-4 border-deep-teal/20 border-t-deep-teal rounded-full animate-spin mx-auto mb-4"
                />
                <p class="text-deep-teal/60">Chargement...</p>
              </div>
            </div>

            <!-- No Terms -->
            <div
              v-else-if="filteredTerms.length === 0"
              class="text-center py-20"
            >
              <div class="max-w-md mx-auto">
                <div
                  class="w-20 h-20 rounded-full bg-terracotta/10 flex items-center justify-center mx-auto mb-6"
                >
                  <svg
                    class="w-10 h-10 text-terracotta"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 class="text-2xl font-serif font-bold text-deep-teal mb-2">
                  Aucun terme trouvé
                </h3>
                <p class="text-deep-teal/60">
                  Essayez de sélectionner une autre catégorie.
                </p>
              </div>
            </div>

            <!-- Flashcard Display -->
            <div v-else class="space-y-8">
              <!-- Progress -->
              <div class="flex items-center justify-between">
                <div class="text-sm">
                  Carte
                  <span class="font-semibold">{{ currentIndex + 1 }}</span> sur
                  <span class="font-semibold">{{ filteredTerms.length }}</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-deep-teal/60">
                  <kbd
                    class="px-2 py-1 bg-white rounded border border-deep-teal/20"
                    >←</kbd
                  >
                  <kbd
                    class="px-2 py-1 bg-white rounded border border-deep-teal/20"
                    >→</kbd
                  >
                  <span>pour naviguer</span>
                  <kbd
                    class="px-2 py-1 bg-white rounded border border-deep-teal/20"
                    >Espace</kbd
                  >
                  <span>pour retourner</span>
                </div>
              </div>

              <!-- Progress Bar -->
              <div
                class="w-full h-2 bg-deep-teal/10 rounded-full overflow-hidden"
              >
                <div
                  class="h-full bg-gradient-to-r from-deep-teal to-terracotta transition-all duration-300"
                  :style="{
                    width: `${((currentIndex + 1) / filteredTerms.length) * 100}%`,
                  }"
                />
              </div>

              <!-- Flashcard -->
              <div v-if="currentTerm" class="max-w-2xl mx-auto">
                <FlashCard ref="flashcardRef" :term="currentTerm" />
              </div>

              <!-- Navigation -->
              <div class="flex items-center justify-center gap-4 pt-8">
                <button
                  type="button"
                  :disabled="currentIndex === 0"
                  class="px-6 py-3 rounded-full border-2 border-deep-teal/20 text-deep-teal font-medium hover:bg-deep-teal hover:text-warm-cream transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-deep-teal"
                  @click="previousCard"
                >
                  <span class="flex items-center gap-2">
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    Précédent
                  </span>
                </button>

                <button
                  type="button"
                  :disabled="currentIndex === filteredTerms.length - 1"
                  class="px-6 py-3 rounded-full bg-deep-teal text-white font-medium hover:bg-deep-teal/90 transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                  @click="nextCard"
                >
                  <span class="flex items-center gap-2">
                    Suivant
                    <svg
                      class="w-5 h-5"
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
                  </span>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TermWithCategory } from "~/types";

const { categories, fetchCategories } = useCategories();
const { terms, fetchTerms, shuffleTerms, loading } = useTerms();

const route = useRoute();
const selectedCategoryId = ref<number | null>(null);
const currentIndex = ref(0);
const flashcardRef = ref();

const filteredTerms = computed(() => {
  if (selectedCategoryId.value === null) {
    return terms.value;
  }
  return terms.value.filter(
    (t: TermWithCategory) => t.category_id === selectedCategoryId.value,
  );
});

const currentTerm = computed(() => {
  return filteredTerms.value[currentIndex.value];
});

// Fetch data on mount
onMounted(async () => {
  await Promise.all([fetchCategories(), fetchTerms()]);

  // Check for category query param
  const categoryParam = route.query.category;
  if (categoryParam) {
    const categoryId = parseInt(categoryParam as string, 10);
    if (!isNaN(categoryId)) {
      selectedCategoryId.value = categoryId;
    }
  }
});

function handleCategorySelect(categoryId: number | null) {
  selectedCategoryId.value = categoryId;
  currentIndex.value = 0;
}

function nextCard() {
  if (currentIndex.value < filteredTerms.value.length - 1) {
    currentIndex.value++;
  }
}

function previousCard() {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
}

function handleShuffle() {
  shuffleTerms();
  currentIndex.value = 0;
}

// Keyboard navigation
onMounted(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      nextCard();
    } else if (e.key === "ArrowLeft") {
      previousCard();
    } else if (e.key === " ") {
      e.preventDefault();
      flashcardRef.value?.flip();
    }
  };

  window.addEventListener("keydown", handleKeyPress);

  onUnmounted(() => {
    window.removeEventListener("keydown", handleKeyPress);
  });
});

// Reset index when filtered terms change
watch(filteredTerms, () => {
  if (currentIndex.value >= filteredTerms.value.length) {
    currentIndex.value = 0;
  }
});
</script>

<style scoped>
kbd {
  font-family: "DM Sans", sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
}
</style>
