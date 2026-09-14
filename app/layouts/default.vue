<template>
  <div class="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
    <!-- Mobile top bar -->
    <header
      class="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-panel px-4 lg:hidden"
    >
      <AppWordmark />
      <button
        type="button"
        class="btn-ghost -mr-2"
        :aria-expanded="menuOpen"
        aria-controls="app-sidebar"
        @click="menuOpen = !menuOpen"
      >
        {{ menuOpen ? 'Fermer' : 'Menu' }}
      </button>
    </header>

    <!-- Sidebar: static column on desktop, overlay panel on mobile -->
    <div
      v-if="menuOpen"
      class="fixed inset-0 z-30 bg-ink/40 lg:hidden"
      aria-hidden="true"
      @click="menuOpen = false"
    />
    <aside
      id="app-sidebar"
      class="fixed inset-y-0 left-0 z-40 w-[280px] max-w-[85vw] border-r border-line bg-panel transition-[transform,visibility] duration-200 lg:sticky lg:top-0 lg:h-screen lg:w-auto lg:max-w-none lg:translate-x-0"
      :class="menuOpen ? 'translate-x-0' : '-translate-x-full max-lg:invisible'"
    >
      <AppSidebar :nav="nav">
        <p class="kicker mb-2 px-2.5">Catégories</p>
        <div class="flex flex-col gap-px">
          <NuxtLink
            to="/flashcards"
            class="row"
            :class="{ 'row-active': isFlashcards && selectedCategoryId === null }"
            :aria-current="isFlashcards && selectedCategoryId === null ? 'page' : undefined"
          >
            <span>Toutes</span>
            <span class="text-ink-faint tabular-nums">{{ terms.length }}</span>
          </NuxtLink>
          <NuxtLink
            v-for="category in categories"
            :key="category.id"
            :to="`/flashcards?category=${category.id}`"
            class="row"
            :class="{ 'row-active': isFlashcards && selectedCategoryId === category.id }"
            :aria-current="isFlashcards && selectedCategoryId === category.id ? 'page' : undefined"
          >
            <span class="flex min-w-0 items-center gap-2">
              <span class="dot" :style="{ backgroundColor: category.color }" aria-hidden="true" />
              <span class="truncate">{{ category.name }}</span>
            </span>
            <span class="text-ink-faint tabular-nums">{{ countFor(category.id) }}</span>
          </NuxtLink>
        </div>
      </AppSidebar>
    </aside>

    <div class="min-w-0">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TermWithCategory } from '~/types'

const route = useRoute()
const { categories } = useCategories()
const { terms } = useTerms()

const menuOpen = ref(false)

const { tutorEnabled } = useRuntimeConfig().public

const nav = [
  { to: '/', label: 'Accueil', exact: true },
  { to: '/flashcards', label: 'Fiches' },
  { to: '/quiz', label: 'Quiz' },
  ...(tutorEnabled ? [{ to: '/tutor', label: 'Tuteur' }] : []),
  { to: '/admin', label: 'Administration' },
]

const isFlashcards = computed(() => route.path === '/flashcards')

const selectedCategoryId = computed(() => {
  const raw = route.query.category
  if (typeof raw !== 'string') return null
  const id = parseInt(raw, 10)
  return isNaN(id) ? null : id
})

function countFor(categoryId: number) {
  return terms.value.filter((t: TermWithCategory) => t.category_id === categoryId).length
}

watch(
  () => route.fullPath,
  () => {
    menuOpen.value = false
  },
)

function closeOnEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') menuOpen.value = false
}

onMounted(() => window.addEventListener('keydown', closeOnEscape))
onUnmounted(() => window.removeEventListener('keydown', closeOnEscape))
</script>
