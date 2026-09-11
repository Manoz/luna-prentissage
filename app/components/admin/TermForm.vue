<template>
  <form class="flex flex-col gap-5" @submit.prevent="handleSubmit">
    <div>
      <label for="root" class="label">Radical</label>
      <input
        id="root"
        v-model="formData.root"
        type="text"
        required
        aria-describedby="root-hint"
        class="field"
        placeholder="arthro-"
      />
      <p id="root-hint" class="hint">Le préfixe, le suffixe ou le radical, avec son tiret</p>
    </div>

    <div>
      <label for="meaning" class="label">Signification</label>
      <input
        id="meaning"
        v-model="formData.meaning"
        type="text"
        required
        class="field"
        placeholder="articulation"
      />
    </div>

    <div>
      <label for="category" class="label">Catégorie</label>
      <select id="category" v-model="formData.category_id" required class="field">
        <option value="">Sélectionner une catégorie</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
      </select>
    </div>

    <div class="flex gap-2 pt-1">
      <button type="submit" :disabled="submitting" class="btn-primary">
        {{ submitting ? 'Enregistrement…' : isEdit ? 'Enregistrer' : 'Créer le terme' }}
      </button>
      <button type="button" :disabled="submitting" class="btn-secondary" @click="$emit('cancel')">
        Annuler
      </button>
    </div>

    <p v-if="error" role="alert" class="text-sm text-danger">{{ error }}</p>
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
