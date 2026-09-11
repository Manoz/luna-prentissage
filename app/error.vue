<template>
  <div class="flex min-h-screen items-center px-6 sm:px-12">
    <main class="w-full max-w-xl">
      <p class="kicker mb-3">Erreur {{ error.statusCode }}</p>
      <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">{{ errorTitle }}</h1>
      <p class="mt-3 text-ink-soft">{{ errorMessage }}</p>

      <div class="mt-8 flex flex-wrap gap-2">
        <button type="button" class="btn-primary" @click="handleError">Retour à l'accueil</button>
        <button v-if="error.statusCode === 404" type="button" class="btn-secondary" @click="goBack">
          Page précédente
        </button>
      </div>

      <div v-if="isDev" class="mt-12 border-t border-line pt-6">
        <h2 class="kicker mb-3">Détails (dev)</h2>
        <pre class="overflow-x-auto text-xs text-ink-soft">{{ error }}</pre>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const isDev = import.meta.dev

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
      return "La page que vous recherchez n'existe pas ou a été déplacée."
    case 401:
      return 'Vous devez être connecté pour accéder à cette page.'
    case 403:
      return "Vous n'avez pas les permissions nécessaires pour accéder à cette page."
    case 500:
      return "Une erreur s'est produite sur le serveur. Veuillez réessayer plus tard."
    default:
      return props.error.message || "Une erreur inattendue s'est produite."
  }
})

function handleError() {
  clearError({ redirect: '/' })
}

function goBack() {
  if (window.history.length > 1) {
    window.history.back()
  } else {
    handleError()
  }
}
</script>
