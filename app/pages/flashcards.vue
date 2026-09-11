<template>
  <div class="flex min-h-screen flex-col">
    <header
      class="flex h-13 items-center justify-between gap-4 border-b border-line px-5 text-[13px] sm:px-7"
    >
      <p class="min-w-0 truncate text-ink-soft">
        Fiches <span class="text-ink-faint" aria-hidden="true">/</span>
        {{ selectedCategory ? selectedCategory.name : 'Toutes les catégories' }}
      </p>
      <button
        v-if="filteredTerms.length > 0"
        type="button"
        class="btn-ghost -mr-2 shrink-0"
        @click="handleShuffle"
      >
        Mélanger
      </button>
    </header>

    <!-- Loading -->
    <div v-if="loading" role="status" class="flex flex-1 items-center justify-center py-24">
      <p class="text-sm text-ink-soft">Chargement des fiches…</p>
    </div>

    <!-- Empty -->
    <div v-else-if="filteredTerms.length === 0" role="status" class="px-7 py-16">
      <h1 class="text-2xl font-semibold tracking-tight">Aucune fiche dans cette catégorie</h1>
      <p class="mt-2 text-sm text-ink-soft">Choisissez-en une autre dans le menu.</p>
      <NuxtLink to="/flashcards" class="btn-secondary mt-6">Voir toutes les fiches</NuxtLink>
    </div>

    <!-- Deck -->
    <main v-else class="grid flex-1 xl:grid-cols-[1fr_340px]">
      <div class="flex flex-col justify-center px-5 py-10 sm:px-7 lg:px-14">
        <div class="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-ink-faint">
          <span aria-live="polite" class="tabular-nums">
            Fiche <span class="text-ink">{{ currentIndex + 1 }}</span> / {{ filteredTerms.length }}
          </span>
          <span class="hidden items-center gap-1 md:inline-flex">
            <kbd>←</kbd><kbd>→</kbd><span class="ml-1">pour naviguer</span>
          </span>
        </div>

        <FlashCard v-if="currentTerm" ref="flashcardRef" :term="currentTerm" />

        <div class="mt-10 flex flex-wrap gap-2">
          <button
            type="button"
            :disabled="currentIndex === 0"
            class="btn-secondary"
            @click="previousCard"
          >
            ← Précédente
          </button>
          <button
            type="button"
            :disabled="currentIndex === filteredTerms.length - 1"
            class="btn-primary"
            @click="nextCard"
          >
            Suivante →
          </button>
        </div>

        <div
          class="mt-8 h-0.5 w-full max-w-md bg-line"
          role="progressbar"
          aria-label="Progression des fiches"
          :aria-valuenow="currentIndex + 1"
          aria-valuemin="1"
          :aria-valuemax="filteredTerms.length"
        >
          <div
            class="h-full bg-accent transition-[width] duration-300"
            :style="{ width: `${((currentIndex + 1) / filteredTerms.length) * 100}%` }"
          />
        </div>
      </div>

      <aside class="hidden min-h-0 border-l border-line xl:block">
        <div class="sticky top-0 flex max-h-screen flex-col">
          <p class="kicker px-6 pt-6 pb-3">Dans cette série</p>
          <ol ref="listRef" class="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
            <li v-for="(term, index) in filteredTerms" :key="term.id">
              <button
                type="button"
                class="row"
                :class="{ 'row-active': index === currentIndex }"
                :aria-current="index === currentIndex ? 'true' : undefined"
                @click="goTo(index)"
              >
                <span class="truncate font-medium">{{ term.root }}</span>
                <span
                  class="truncate text-ink-faint"
                  :class="{ 'text-accent': index === currentIndex }"
                >
                  {{ term.meaning }}
                </span>
              </button>
            </li>
          </ol>
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { TermWithCategory } from '~/types'

const { categories, fetchCategories } = useCategories()
const { terms, fetchTerms, shuffleTerms, loading } = useTerms()

const route = useRoute()
const currentIndex = ref(0)
const flashcardRef = ref<{ flip: () => void; focus: () => void } | null>(null)
const listRef = ref<HTMLElement | null>(null)

const selectedCategoryId = computed(() => {
  const raw = route.query.category
  if (typeof raw !== 'string') return null
  const id = parseInt(raw, 10)
  return isNaN(id) ? null : id
})

const selectedCategory = computed(() =>
  categories.value.find((c) => c.id === selectedCategoryId.value),
)

const filteredTerms = computed(() => {
  if (selectedCategoryId.value === null) {
    return terms.value
  }
  return terms.value.filter((t: TermWithCategory) => t.category_id === selectedCategoryId.value)
})

const currentTerm = computed(() => {
  return filteredTerms.value[currentIndex.value]
})

// Arrow keys navigate cards unless the user is inside a form control
// (where arrows already have a meaning). Flipping is handled natively by
// the card button (Enter/Space), so no global Space shortcut is needed.
function handleKeyPress(e: KeyboardEvent) {
  const target = e.target as HTMLElement | null
  if (target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) return

  if (e.key === 'ArrowRight') {
    nextCard()
  } else if (e.key === 'ArrowLeft') {
    previousCard()
  }
}

onMounted(async () => {
  window.addEventListener('keydown', handleKeyPress)
  await Promise.all([fetchCategories(), fetchTerms()])
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})

// When a nav button becomes disabled under the focused element, the browser
// drops focus to <body>; move it to the card instead.
function keepFocusOnCard() {
  nextTick(() => {
    if (document.activeElement === document.body) {
      flashcardRef.value?.focus()
    }
  })
}

function scrollListToCurrent() {
  nextTick(() => {
    const active = listRef.value?.querySelector<HTMLElement>('[aria-current="true"]')
    active?.scrollIntoView({ block: 'nearest' })
  })
}

function goTo(index: number) {
  currentIndex.value = index
  nextTick(() => flashcardRef.value?.focus())
}

function nextCard() {
  if (currentIndex.value < filteredTerms.value.length - 1) {
    currentIndex.value++
    keepFocusOnCard()
    scrollListToCurrent()
  }
}

function previousCard() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    keepFocusOnCard()
    scrollListToCurrent()
  }
}

function handleShuffle() {
  shuffleTerms()
  currentIndex.value = 0
  // The counter may not change (index already 0); focusing the card reads the new term
  nextTick(() => flashcardRef.value?.focus())
}

// Reset index when the filter changes
watch(selectedCategoryId, () => {
  currentIndex.value = 0
})

watch(filteredTerms, () => {
  if (currentIndex.value >= filteredTerms.value.length) {
    currentIndex.value = 0
  }
})
</script>
