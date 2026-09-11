<template>
  <button
    ref="buttonRef"
    type="button"
    class="block w-full rounded text-left select-none focus-visible:outline-offset-8"
    :aria-pressed="isFlipped"
    @click="flip"
  >
    <p class="kicker mb-6 flex items-center gap-2">
      <span class="dot" :style="{ backgroundColor: term.category_color }" aria-hidden="true" />
      {{ term.category_name }}
    </p>

    <p class="text-6xl font-semibold tracking-[-0.04em] break-words sm:text-7xl lg:text-8xl">
      {{ term.root }}
    </p>

    <div class="mt-8 border-t border-dashed border-line-strong pt-6">
      <p
        class="font-serif text-3xl italic transition-opacity duration-200 sm:text-4xl"
        :class="isFlipped ? 'text-accent opacity-100' : 'opacity-0'"
        :aria-hidden="!isFlipped"
      >
        {{ term.meaning }}
      </p>
      <p
        class="mt-2 text-[13px] text-ink-faint transition-opacity duration-200"
        :class="isFlipped ? 'opacity-0' : 'opacity-100'"
        :aria-hidden="isFlipped"
      >
        Appuyez sur la fiche ou sur Entrée pour révéler la signification
      </p>
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

// Reset when term changes
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
