<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <div>
      <label for="root" class="block text-sm font-medium text-gray-700 mb-1"> Radical * </label>
      <input
        id="root"
        v-model="formData.root"
        type="text"
        required
        aria-describedby="root-hint"
        class="w-full px-4 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="arthro-"
      />
      <p id="root-hint" class="mt-1 text-sm text-gray-500">Le préfixe ou suffixe médical</p>
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
        aria-describedby="meaning-hint"
        class="w-full px-4 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="articulation"
      />
      <p id="meaning-hint" class="mt-1 text-sm text-gray-500">La signification du radical</p>
    </div>

    <div>
      <label for="category" class="block text-sm font-medium text-gray-700 mb-1">
        Catégorie *
      </label>
      <select
        id="category"
        v-model="formData.category_id"
        required
        class="w-full px-4 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      >
        <option value="">Sélectionner une catégorie</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <div class="flex gap-3 pt-4">
      <button
        type="submit"
        :disabled="submitting"
        class="flex-1 px-6 py-3 bg-deep-teal text-white font-semibold rounded-lg hover:bg-deep-teal/80 transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
      >
        {{ submitting ? 'En cours...' : isEdit ? 'Modifier' : 'Créer' }}
      </button>
      <button
        type="button"
        :disabled="submitting"
        class="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 cursor-pointer"
        @click="$emit('cancel')"
      >
        Annuler
      </button>
    </div>

    <p v-if="error" role="alert" class="text-red-700 text-sm">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import type { Category, Term } from '~/types'

interface Props {
  term?: Term | null
  categories: readonly Category[]
  isEdit?: boolean
  submitting?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  term: null,
  isEdit: false,
  submitting: false,
  error: null,
})

const emit = defineEmits<{
  submit: [data: { root: string; meaning: string; category_id: number }]
  cancel: []
}>()

const formData = reactive({
  root: props.term?.root || '',
  meaning: props.term?.meaning || '',
  category_id: props.term?.category_id || '',
})

function handleSubmit() {
  emit('submit', {
    root: formData.root,
    meaning: formData.meaning,
    category_id: Number(formData.category_id),
  })
}

// Update form when term prop changes
watch(
  () => props.term,
  (newTerm) => {
    if (newTerm) {
      formData.root = newTerm.root
      formData.meaning = newTerm.meaning
      formData.category_id = newTerm.category_id
    }
  },
)
</script>
