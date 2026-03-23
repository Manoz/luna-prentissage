<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <div>
      <label for="root" class="block text-sm font-medium text-gray-700 mb-1">
        Radical *
      </label>
      <input
        id="root"
        v-model="formData.root"
        type="text"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="arthro-"
      >
      <p class="mt-1 text-sm text-gray-500">Le préfixe ou suffixe médical</p>
    </div>

    <div>
      <label for="meaning" class="block text-sm font-medium text-gray-700 mb-1">
        Signification *
      </label>
      <input
        id="meaning"
        v-model="formData.meaning"
        type="text"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="articulation"
      >
      <p class="mt-1 text-sm text-gray-500">La signification du radical</p>
    </div>

    <div>
      <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
        Catégorie *
      </label>
      <select
        id="category"
        v-model="formData.category_id"
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      >
        <option value="">Sélectionner une catégorie</option>
        <option
          v-for="category in categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>
    </div>

    <div class="flex gap-3 pt-4">
      <button
        type="submit"
        :disabled="loading"
        class="flex-1 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ loading ? 'En cours...' : (isEdit ? 'Modifier' : 'Créer') }}
      </button>
      <button
        type="button"
        :disabled="loading"
        class="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
        @click="$emit('cancel')"
      >
        Annuler
      </button>
    </div>

    <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import type { Category, Term } from '~/types'

interface Props {
  term?: Term | null
  categories: readonly Category[]
  isEdit?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [data: { root: string; meaning: string; category_id: number }]
  cancel: []
}>()

const loading = ref(false)
const error = ref<string | null>(null)

const formData = reactive({
  root: props.term?.root || '',
  meaning: props.term?.meaning || '',
  category_id: props.term?.category_id || ''
})

async function handleSubmit() {
  loading.value = true
  error.value = null

  try {
    emit('submit', {
      root: formData.root,
      meaning: formData.meaning,
      category_id: Number(formData.category_id)
    })
  }
  catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
  }
  finally {
    loading.value = false
  }
}

// Update form when term prop changes
watch(() => props.term, (newTerm) => {
  if (newTerm) {
    formData.root = newTerm.root
    formData.meaning = newTerm.meaning
    formData.category_id = newTerm.category_id
  }
})
</script>
