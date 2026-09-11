<template>
  <div class="flex min-h-screen items-center justify-center px-5">
    <main class="w-full max-w-sm">
      <div class="mb-8">
        <AppWordmark />
        <p class="kicker mt-2">Administration</p>
      </div>

      <h1 class="text-2xl font-semibold tracking-tight">Connexion</h1>

      <form class="mt-6 flex flex-col gap-5" @submit.prevent="handleLogin">
        <div>
          <label for="username" class="label">Nom d'utilisateur</label>
          <input
            id="username"
            ref="usernameRef"
            v-model="credentials.username"
            type="text"
            autocomplete="username"
            required
            :aria-invalid="!!error"
            :aria-describedby="error ? 'login-error' : undefined"
            class="field"
          />
        </div>

        <div>
          <label for="password" class="label">Mot de passe</label>
          <input
            id="password"
            v-model="credentials.password"
            type="password"
            autocomplete="current-password"
            required
            :aria-invalid="!!error"
            :aria-describedby="error ? 'login-error' : undefined"
            class="field"
          />
        </div>

        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Connexion…' : 'Se connecter' }}
        </button>

        <p v-if="error" id="login-error" role="alert" class="text-sm text-danger">
          {{ error }}
        </p>
      </form>

      <p class="mt-8 border-t border-line pt-5">
        <NuxtLink to="/" class="text-sm text-ink-soft hover:text-ink">← Retour au site</NuxtLink>
      </p>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
})

const { login } = useAdminAuth()
const router = useRouter()

const credentials = reactive({
  username: '',
  password: '',
})

const loading = ref(false)
const error = ref<string | null>(null)
const usernameRef = ref<HTMLInputElement | null>(null)

async function handleLogin() {
  loading.value = true
  error.value = null

  try {
    await login(credentials)
    await router.push('/admin')
  } catch {
    error.value = "Nom d'utilisateur ou mot de passe incorrect"
    // The submit button is disabled while loading, which drops focus to <body>
    nextTick(() => usernameRef.value?.focus())
  } finally {
    loading.value = false
  }
}
</script>
