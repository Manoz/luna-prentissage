<template>
  <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
    <div>
      <label for="name" class="label">Nom de la catégorie</label>
      <input
        id="name"
        v-model="formData.name"
        type="text"
        required
        class="field"
        placeholder="Système nerveux et motricité"
      />
    </div>

    <div>
      <label for="color" class="label">Couleur</label>
      <div class="flex gap-2">
        <input
          id="color-picker"
          v-model="formData.color"
          type="color"
          required
          aria-label="Sélecteur de couleur"
          class="h-10 w-12 shrink-0 cursor-pointer rounded border border-line-strong bg-surface p-0.5"
        />
        <input
          id="color"
          v-model="formData.color"
          type="text"
          pattern="^#[0-9A-Fa-f]{6}$"
          required
          aria-describedby="color-hint"
          class="field uppercase"
          placeholder="#D4A574"
        />
      </div>
      <p id="color-hint" class="hint">Format hexadécimal, par exemple #D4A574</p>
      <p v-if="isValidColor" class="mt-3 flex items-center gap-2 text-sm text-ink-soft">
        Aperçu
        <span class="dot" :style="{ backgroundColor: formData.color }" aria-hidden="true" />
        <span class="text-ink">{{ formData.name || 'Catégorie' }}</span>
      </p>
    </div>

    <div>
      <label for="description" class="label">Description</label>
      <textarea
        id="description"
        v-model="formData.description"
        rows="3"
        class="field"
        placeholder="Radicaux liés au système nerveux et à la motricité"
      />
    </div>

    <div class="flex gap-2 pt-1">
      <button type="submit" :disabled="submitting" class="btn-primary">
        {{ submitting ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer la catégorie' }}
      </button>
      <button type="button" :disabled="submitting" class="btn-secondary" @click="$emit('cancel')">
        Annuler
      </button>
    </div>

    <p v-if="error" role="alert" class="text-sm text-danger">{{ error }}</p>
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
