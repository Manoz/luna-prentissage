<template>
  <div class="min-h-screen bg-warmCream flex items-center justify-center px-6">
    <div class="fixed inset-0 opacity-[0.03] pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;200&quot; height=&quot;200&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cfilter id=&quot;noise&quot;%3E%3CfeTurbulence type=&quot;fractalNoise&quot; baseFrequency=&quot;0.9&quot; numOctaves=&quot;4&quot; /%3E%3C/filter%3E%3Crect width=&quot;100%25&quot; height=&quot;100%25&quot; filter=&quot;url(%23noise)&quot; /%3E%3C/svg%3E')" />

    <div class="relative text-center max-w-2xl">
      <div class="mb-8">
        <div class="text-9xl font-serif font-bold text-deepTeal/20 mb-4">
          {{ error.statusCode }}
        </div>
        <h1 class="text-4xl md:text-5xl font-serif font-bold text-deepTeal mb-4">
          {{ errorTitle }}
        </h1>
        <p class="text-xl text-deepTeal/70 mb-8">
          {{ errorMessage }}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          type="button"
          class="px-8 py-3 bg-deepTeal text-white font-semibold rounded-full hover:bg-deepTeal/90 transition-all shadow-lg"
          @click="handleError"
        >
          Retour à l'accueil
        </button>

        <button
          v-if="error.statusCode === 404"
          type="button"
          class="px-8 py-3 border-2 border-deepTeal/20 text-deepTeal font-semibold rounded-full hover:bg-deepTeal/5 transition-all"
          @click="goBack"
        >
          Retour en arrière
        </button>
      </div>

      <div v-if="isDev" class="mt-12 p-6 bg-white rounded-xl shadow-lg text-left">
        <h3 class="text-lg font-semibold text-deepTeal mb-2">Détails de l'erreur (dev mode)</h3>
        <pre class="text-sm text-deepTeal/70 overflow-x-auto">{{ error }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const isDev = process.dev

const errorTitle = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return 'Page introuvable'
    case 401:
      return 'Non autorisé'
    case 403:
      return 'Accès interdit'
    case 500:
      return 'Erreur serveur'
    default:
      return 'Une erreur est survenue'
  }
})

const errorMessage = computed(() => {
  switch (props.error.statusCode) {
    case 404:
      return 'La page que vous recherchez n\'existe pas ou a été déplacée.'
    case 401:
      return 'Vous devez être connecté pour accéder à cette page.'
    case 403:
      return 'Vous n\'avez pas les permissions nécessaires pour accéder à cette page.'
    case 500:
      return 'Une erreur s\'est produite sur le serveur. Veuillez réessayer plus tard.'
    default:
      return props.error.message || 'Une erreur inattendue s\'est produite.'
  }
})

function handleError() {
  clearError({ redirect: '/' })
}

function goBack() {
  if (window.history.length > 1) {
    window.history.back()
  }
  else {
    handleError()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
}

.font-serif {
  font-family: 'Crimson Pro', serif;
}

.bg-warmCream {
  background-color: #FAF9F6;
}

.text-deepTeal {
  color: #2D5F5D;
}

.bg-deepTeal {
  background-color: #2D5F5D;
}
</style>
