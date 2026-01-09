<template>
  <div
    class="flashcard-container cursor-pointer select-none"
    :style="{ perspective: '1000px' }"
    @click="flip"
  >
    <div
      class="flashcard relative w-full h-80 transition-transform duration-600"
      :style="{
        transformStyle: 'preserve-3d',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
      }"
    >
      <!-- Front (root) -->
      <div
        class="flashcard-face absolute w-full h-full rounded-xl shadow-2xl p-8 flex items-center justify-center"
        :style="{
          backgroundColor: term.category_color,
          backfaceVisibility: 'hidden'
        }"
      >
        <div class="text-center">
          <h2 class="text-5xl font-bold text-white mb-4">{{ term.root }}</h2>
          <p class="text-white/70 text-sm uppercase tracking-wide">Cliquez pour révéler</p>
        </div>
      </div>

      <!-- Back (meaning) -->
      <div
        class="flashcard-face absolute w-full h-full rounded-xl shadow-2xl p-8 flex items-center justify-center"
        :style="{
          backgroundColor: term.category_color,
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)'
        }"
      >
        <div class="text-center">
          <h3 class="text-3xl font-semibold text-white mb-4">{{ term.meaning }}</h3>
          <p class="text-white/70 text-sm uppercase tracking-wide mt-6">{{ term.category_name }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TermWithCategory } from '~/types'

interface Props {
  term: TermWithCategory
}

const props = defineProps<Props>()
const isFlipped = ref(false)

function flip() {
  isFlipped.value = !isFlipped.value
}

// Reset flip when term changes
watch(() => props.term, () => {
  isFlipped.value = false
})

// Expose flip method for parent components
defineExpose({
  flip
})
</script>

<style scoped>
.flashcard {
  transition: transform 0.6s;
}
</style>
