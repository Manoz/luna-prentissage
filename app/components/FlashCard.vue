<template>
  <button
    ref="buttonRef"
    type="button"
    class="flashcard-container block w-full text-left select-none rounded-xl focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-deep-teal"
    :style="{ perspective: '1000px' }"
    :aria-pressed="isFlipped"
    @click="flip"
  >
    <div
      class="flashcard relative w-full h-80 transition-transform duration-600"
      :style="{
        transformStyle: 'preserve-3d',
        transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
      }"
    >
      <!-- Front (root) -->
      <div
        class="flashcard-face absolute w-full h-full rounded-xl shadow-2xl p-8 flex items-center justify-center"
        :style="{
          backgroundColor: term.category_color,
          backfaceVisibility: 'hidden',
        }"
        :aria-hidden="isFlipped"
      >
        <div class="text-center">
          <p class="text-5xl font-bold text-white mb-4">{{ term.root }}</p>
          <p class="text-white/70 text-sm uppercase tracking-wide">Appuyez pour révéler</p>
        </div>
      </div>

      <!-- Back (meaning) -->
      <div
        class="flashcard-face absolute w-full h-full rounded-xl shadow-2xl p-8 flex items-center justify-center"
        :style="{
          backgroundColor: term.category_color,
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
        }"
        :aria-hidden="!isFlipped"
      >
        <div class="text-center">
          <p class="text-3xl font-semibold text-white mb-4">{{ term.meaning }}</p>
          <p class="text-white/70 text-sm uppercase tracking-wide mt-6">{{ term.category_name }}</p>
        </div>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { TermWithCategory } from '~/types'

interface Props {
  term: TermWithCategory
}

const props = defineProps<Props>()
const isFlipped = ref(false)
const buttonRef = ref<HTMLButtonElement | null>(null)

function flip() {
  isFlipped.value = !isFlipped.value
}

function focus() {
  buttonRef.value?.focus()
}

// Reset flip when term changes
watch(
  () => props.term,
  () => {
    isFlipped.value = false
  },
)

defineExpose({
  flip,
  focus,
})
</script>
