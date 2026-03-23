<template>
  <div class="category-filter">
    <h3 class="text-lg font-semibold text-deep-teal mb-4 lg:block hidden">
      Filtrer par catégorie
    </h3>

    <!-- Mobile: compact select dropdown -->
    <div class="lg:hidden">
      <select
        class="w-full p-3 rounded-lg border-2 border-deep-teal/20 bg-white text-deep-teal font-medium focus:border-deep-teal focus:outline-none"
        :value="selectedCategoryId ?? ''"
        @change="handleSelectChange"
      >
        <option value="">Toutes les catégories</option>
        <option
          v-for="category in categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>
    </div>

    <!-- Desktop: full button list -->
    <div class="hidden lg:block space-y-2">
      <button
        type="button"
        class="w-full p-3 text-left rounded-lg border-2 transition-all font-medium"
        :class="{
          'border-deep-teal bg-deep-teal/5 text-deep-teal': selectedCategoryId === null,
          'border-gray-300 hover:border-gray-400 text-gray-700': selectedCategoryId !== null,
        }"
        @click="selectCategory(null)"
      >
        <span class="flex items-center gap-3">
          <span class="w-4 h-4 rounded-full bg-gradient-to-r from-deep-teal to-terracotta" />
          Toutes les catégories
        </span>
      </button>
      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        class="w-full p-3 text-left rounded-lg border-2 transition-all font-medium"
        :class="{
          'border-deep-teal bg-deep-teal/5': selectedCategoryId === category.id,
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

function handleSelectChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  emit('select', value === '' ? null : Number(value))
}
</script>
