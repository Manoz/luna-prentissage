<template>
  <div class="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
    <header
      class="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-panel px-4 lg:hidden"
    >
      <AppWordmark to="/admin" />
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
      <AppSidebar :nav="nav" nav-label="Navigation admin" home="/admin">
        <template #footer>
          <div class="flex items-center justify-between gap-2">
            <NuxtLink to="/" class="text-xs text-ink-soft hover:text-ink">Voir le site</NuxtLink>
            <button
              type="button"
              class="text-xs font-medium text-ink-soft hover:text-ink"
              @click="handleLogout"
            >
              Se déconnecter
            </button>
          </div>
        </template>
      </AppSidebar>
    </aside>

    <div class="min-w-0">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { logout } = useAdminAuth()

const menuOpen = ref(false)

const nav = [
  { to: '/admin', label: 'Tableau de bord', exact: true },
  { to: '/admin/categories', label: 'Catégories' },
  { to: '/admin/terms', label: 'Termes' },
]

async function handleLogout() {
  await logout()
  await router.push('/admin/login')
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
