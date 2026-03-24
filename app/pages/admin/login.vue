<template>
  <div class="min-h-screen bg-warm-cream flex items-center justify-center px-6">
    <div
      class="fixed inset-0 opacity-[0.03] pointer-events-none"
      style="
        background-image: url('data:image/svg+xml,%3Csvg width=&quot;200&quot; height=&quot;200&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cfilter id=&quot;noise&quot;%3E%3CfeTurbulence type=&quot;fractalNoise&quot; baseFrequency=&quot;0.9&quot; numOctaves=&quot;4&quot; /%3E%3C/filter%3E%3Crect width=&quot;100%25&quot; height=&quot;100%25&quot; filter=&quot;url(%23noise)&quot; /%3E%3C/svg%3E');
      "
    />

    <div class="relative w-full max-w-md">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block">
          <h1 class="text-4xl font-serif font-bold text-deep-teal">
            Luna<span class="text-terracotta">·</span>Prentissage
          </h1>
        </NuxtLink>
        <p class="text-deep-teal/60 mt-2">Administration</p>
      </div>

      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h2 class="text-2xl font-serif font-bold text-deep-teal mb-6">Connexion</h2>

        <form class="space-y-6" @submit.prevent="handleLogin">
          <div>
            <label for="username" class="block text-sm font-medium text-deep-teal mb-2">
              Nom d'utilisateur
            </label>
            <input
              id="username"
              v-model="credentials.username"
              type="text"
              required
              class="w-full px-4 py-3 border-2 border-deep-teal/20 rounded-lg focus:border-deep-teal focus:outline-none transition-colors"
              placeholder=""
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-deep-teal mb-2">
              Mot de passe
            </label>
            <input
              id="password"
              v-model="credentials.password"
              type="password"
              autocomplete="current-password"
              required
              class="w-full px-4 py-3 border-2 border-deep-teal/20 rounded-lg focus:border-deep-teal focus:outline-none transition-colors"
              placeholder=""
            />
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3 bg-deep-teal text-white font-semibold rounded-lg hover:bg-deep-teal/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>

          <p v-if="error" class="text-terracotta text-sm text-center">
            {{ error }}
          </p>
        </form>

        <div class="mt-6 pt-6 border-t border-deep-teal/10">
          <NuxtLink
            to="/"
            class="text-sm text-deep-teal/60 hover:text-deep-teal transition-colors flex items-center justify-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Retour à l'accueil
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { login } = useAdminAuth()
const router = useRouter()

const credentials = reactive({
  username: '',
  password: '',
})

const loading = ref(false)
const error = ref<string | null>(null)

async function handleLogin() {
  loading.value = true
  error.value = null

  try {
    await login(credentials)
    await router.push('/admin')
  } catch {
    error.value = "Nom d'utilisateur ou mot de passe incorrect"
  } finally {
    loading.value = false
  }
}
</script>
