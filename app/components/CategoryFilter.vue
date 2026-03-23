<template>
  <div class="category-filter">
    <h3 class="text-lg font-semibold text-gray-900 mb-4">Filtrer par catégorie</h3>
    <div class="space-y-2">
      <button
        type="button"
        class="w-full p-3 text-left rounded-lg border-2 transition-all font-medium"
        :class="{
          'border-purple-500 bg-purple-50 text-purple-900': selectedCategoryId === null,
          'border-gray-300 hover:border-gray-400 text-gray-700': selectedCategoryId !== null,
        }"
        @click="selectCategory(null)"
      >
        <span class="flex items-center gap-3">
          <span class="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
          Toutes les catégories
        </span>
      </button>
      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        class="w-full p-3 text-left rounded-lg border-2 transition-all font-medium"
        :class="{
          'border-purple-500 bg-purple-50': selectedCategoryId === category.id,
          'border-gray-300 hover:border-gray-400': selectedCategoryId !== category.id,
        }"
        @click="selectCategory(category.id)"
      >
        <span class="flex items-center gap-3">
          <span
            class="w-4 h-4 rounded-full flex-shrink-0"
            :style="{ backgroundColor: category.color }"
          />
          <span class="flex-1">{{ category.name }}</span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '~/types'

interface Props {
  categories: readonly Category[]
  selectedCategoryId?: number | null
}

defineProps<Props>()
const emit = defineEmits<{
  select: [categoryId: number | null]
}>()

function selectCategory(categoryId: number | null) {
  emit('select', categoryId)
}
</script>
