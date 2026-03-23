<template>
  <div class="min-h-screen bg-warm-cream">
    <div class="fixed inset-0 opacity-[0.03] pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;200&quot; height=&quot;200&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cfilter id=&quot;noise&quot;%3E%3CfeTurbulence type=&quot;fractalNoise&quot; baseFrequency=&quot;0.9&quot; numOctaves=&quot;4&quot; /%3E%3C/filter%3E%3Crect width=&quot;100%25&quot; height=&quot;100%25&quot; filter=&quot;url(%23noise)&quot; /%3E%3C/svg%3E')" />

    <div class="relative">
      <!-- Header -->
      <header class="border-b border-deep-teal/10 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div class="container mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-6">
              <NuxtLink to="/" class="text-2xl font-serif font-bold text-deep-teal">
                Luna<span class="text-terracotta">·</span>Prentissage
              </NuxtLink>
              <span class="text-sm text-deep-teal/60">Administration</span>
            </div>

            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-deep-teal/70 hover:text-terracotta transition-colors"
              @click="handleLogout"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-6 py-12">
        <!-- Welcome Section -->
        <div class="mb-12">
          <h1 class="text-4xl font-serif font-bold text-deep-teal mb-2">
            Tableau de bord
          </h1>
          <p class="text-deep-teal/60">
            Gérez les catégories et les termes médicaux
          </p>
        </div>

        <!-- Statistics -->
        <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-full bg-deep-teal/10 flex items-center justify-center">
                <svg class="w-6 h-6 text-deep-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
            </div>
            <div class="text-3xl font-serif font-bold text-deep-teal mb-1">
              {{ categories.length }}
            </div>
            <div class="text-sm text-deep-teal/60">
              Catégories
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center">
                <svg class="w-6 h-6 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <div class="text-3xl font-serif font-bold text-deep-teal mb-1">
              {{ terms.length }}
            </div>
            <div class="text-sm text-deep-teal/60">
              Termes médicaux
            </div>
          </div>

          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center justify-between mb-4">
              <div class="w-12 h-12 rounded-full bg-deep-teal/10 flex items-center justify-center">
                <svg class="w-6 h-6 text-deep-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div class="text-3xl font-serif font-bold text-deep-teal mb-1">
              {{ averageTermsPerCategory }}
            </div>
            <div class="text-sm text-deep-teal/60">
              Termes / catégorie
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <NuxtLink
            to="/admin/categories"
            class="group bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 rounded-full bg-deep-teal/10 flex items-center justify-center group-hover:bg-deep-teal/20 transition-colors">
                <svg class="w-8 h-8 text-deep-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-serif font-bold text-deep-teal mb-1">
                  Gérer les catégories
                </h3>
                <p class="text-sm text-deep-teal/60">
                  Ajouter, modifier ou supprimer des catégories
                </p>
              </div>
              <svg class="w-6 h-6 text-deep-teal/40 group-hover:text-deep-teal group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </NuxtLink>

          <NuxtLink
            to="/admin/terms"
            class="group bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all hover:-translate-y-1"
          >
            <div class="flex items-center gap-4 mb-4">
              <div class="w-16 h-16 rounded-full bg-terracotta/10 flex items-center justify-center group-hover:bg-terracotta/20 transition-colors">
                <svg class="w-8 h-8 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="text-xl font-serif font-bold text-deep-teal mb-1">
                  Gérer les termes
                </h3>
                <p class="text-sm text-deep-teal/60">
                  Ajouter, modifier ou supprimer des termes médicaux
                </p>
              </div>
              <svg class="w-6 h-6 text-deep-teal/40 group-hover:text-deep-teal group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'admin'
})

const { logout } = useAdminAuth()
const { categories, fetchCategories, loading: categoriesLoading } = useCategories()
const { terms, fetchTerms, loading: termsLoading } = useTerms()
const router = useRouter()

const loading = computed(() => categoriesLoading.value || termsLoading.value)

const averageTermsPerCategory = computed(() => {
  if (categories.value.length === 0) return 0
  return Math.round(terms.value.length / categories.value.length)
})

onMounted(async () => {
  await Promise.all([
    fetchCategories(),
    fetchTerms()
  ])
})

async function handleLogout() {
  await logout()
  await router.push('/admin/login')
}
</script>

