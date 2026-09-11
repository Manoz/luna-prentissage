<template>
  <form class="space-y-6" @submit.prevent="handleSubmit">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
        Nom de la catégorie *
      </label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        required
        class="w-full px-4 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="Système Nerveux et Motricité"
      />
    </div>

    <div>
      <label for="color" class="block text-sm font-medium text-gray-700 mb-1"> Couleur * </label>
      <div class="flex gap-3">
        <input
          id="color-picker"
          v-model="formData.color"
          type="color"
          required
          aria-label="Sélecteur de couleur"
          class="h-12 w-20 rounded-lg cursor-pointer border border-gray-500"
        />
        <input
          id="color"
          v-model="formData.color"
          type="text"
          pattern="^#[0-9A-Fa-f]{6}$"
          required
          aria-describedby="color-hint"
          class="flex-1 px-4 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono"
          placeholder="#D4A574"
        />
      </div>
      <p id="color-hint" class="mt-1 text-sm text-gray-500">Format hexadécimal (ex: #D4A574)</p>
      <p v-if="isValidColor" class="mt-2 text-sm text-gray-700">
        Aperçu :
        <span
          class="inline-block px-3 py-1 rounded-full font-medium"
          :style="{ backgroundColor: formData.color, color: readableTextOn(formData.color) }"
        >
          {{ formData.name || 'Catégorie' }}
        </span>
      </p>
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
        Description
      </label>
      <textarea
        id="description"
        v-model="formData.description"
        rows="3"
        class="w-full px-4 py-2 border border-gray-500 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        placeholder="Radicaux liés au système nerveux et à la motricité"
      />
    </div>

    <div class="flex gap-3 pt-4">
      <button
        type="submit"
        :disabled="submitting"
        class="flex-1 px-6 py-3 bg-deep-teal text-white font-semibold rounded-lg hover:bg-deep-teal/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
import type { Category } from '~/types'

interface Props {
  category?: Category | null
  isEdit?: boolean
  submitting?: boolean
  error?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  category: null,
  isEdit: false,
  submitting: false,
  error: null,
})

const emit = defineEmits<{
  submit: [data: { name: string; color: string; description?: string }]
  cancel: []
}>()

const formData = reactive({
  name: props.category?.name || '',
  color: props.category?.color || '#D4A574',
  description: props.category?.description || '',
})

const isValidColor = computed(() => /^#[0-9A-Fa-f]{6}$/.test(formData.color))

function handleSubmit() {
  emit('submit', {
    name: formData.name,
    color: formData.color,
    description: formData.description || undefined,
  })
}

// Update form when category prop changes
watch(
  () => props.category,
  (newCategory) => {
    if (newCategory) {
      formData.name = newCategory.name
      formData.color = newCategory.color
      formData.description = newCategory.description || ''
    }
  },
)
</script>
