<template>
  <div class="quiz-question bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
    <!-- Progress Bar -->
    <div class="mb-8">
      <div class="flex justify-between items-center mb-2">
        <span class="text-sm font-medium text-deep-teal/60">
          Question {{ currentQuestion + 1 }} sur {{ totalQuestions }}
        </span>
        <span class="text-sm font-medium text-deep-teal/60">
          Score: {{ score }}/{{ currentQuestion + (answered ? 1 : 0) }}
        </span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div
          class="bg-gradient-to-r from-deep-teal to-terracotta h-2 rounded-full transition-all duration-300"
          :style="{ width: `${progress}%` }"
        />
      </div>
    </div>

    <!-- Multiple Choice Question -->
    <div v-if="question.type === 'multiple-choice'" class="space-y-6">
      <h3 class="text-2xl font-bold text-deep-teal mb-6">
        Que signifie <span class="text-terracotta">"{{ question.term.root }}"</span> ?
      </h3>
      <div class="space-y-3">
        <button
          v-for="(option, index) in question.options"
          :key="index"
          type="button"
          :disabled="answered"
          class="w-full p-4 text-left rounded-lg border-2 transition-all font-medium"
          :class="getOptionClass(option)"
          @click="selectAnswer(option)"
        >
          {{ option }}
        </button>
      </div>
    </div>

    <!-- True/False Question -->
    <div v-else-if="question.type === 'true-false'" class="space-y-6">
      <h3 class="text-2xl font-bold text-deep-teal mb-6">
        <span class="text-terracotta">"{{ question.term.root }}"</span> signifie
        <span class="text-terracotta">"{{ question.statement }}"</span>
      </h3>
      <div class="grid grid-cols-2 gap-4">
        <button
          type="button"
          :disabled="answered"
          class="p-6 flex items-center justify-center rounded-lg border-2 transition-all font-semibold text-lg"
          :class="getTrueFalseClass(true)"
          @click="selectAnswer(true)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>

          <span>Vrai</span>
        </button>
        <button
          type="button"
          :disabled="answered"
          class="p-6 flex items-center justify-center rounded-lg border-2 transition-all font-semibold text-lg"
          :class="getTrueFalseClass(false)"
          @click="selectAnswer(false)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>

          <span>Faux</span>
        </button>
      </div>
    </div>

    <!-- Feedback -->
    <div
      v-if="answered"
      class="mt-8 p-4 rounded-lg"
      :class="isCorrect ? 'bg-green-50' : 'bg-red-50'"
    >
      <p class="text-lg font-semibold" :class="isCorrect ? 'text-green-700' : 'text-red-700'">
        {{ isCorrect ? '✓ Correct !' : '✗ Incorrect' }}
      </p>
      <p v-if="!isCorrect" class="mt-2 text-gray-700">
        La bonne réponse est : <span class="font-semibold">{{ formatAnswer(question.correctAnswer) }}</span>
      </p>
      <p class="mt-3 text-sm text-deep-teal/60">
        Catégorie : <span class="font-medium">{{ question.term.category_name }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuizQuestion } from '~/types'

interface Props {
  question: QuizQuestion
  currentQuestion: number
  totalQuestions: number
  progress: number
  score: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  answer: [answer: string | boolean]
}>()

const answered = ref(false)
const selectedAnswer = ref<string | boolean | null>(null)
const isCorrect = ref(false)

function formatAnswer(answer: string | boolean) {
  if (typeof answer === 'boolean') return answer ? 'Vrai' : 'Faux'
  return answer
}

function selectAnswer(answer: string | boolean) {
  if (answered.value) return

  selectedAnswer.value = answer
  isCorrect.value = answer === props.question.correctAnswer
  answered.value = true

  emit('answer', answer)
}

function getOptionClass(option: string) {
  if (!answered.value) {
    return 'border-gray-300 hover:border-deep-teal hover:bg-deep-teal/5'
  }

  if (option === props.question.correctAnswer) {
    return 'border-green-500 bg-green-50 text-green-900'
  }

  if (option === selectedAnswer.value && !isCorrect.value) {
    return 'border-red-500 bg-red-50 text-red-900'
  }

  return 'border-gray-200 bg-gray-50 text-gray-500'
}

function getTrueFalseClass(value: boolean) {
  if (!answered.value) {
    return 'border-gray-300 hover:border-deep-teal hover:bg-deep-teal/5'
  }

  if (value === props.question.correctAnswer) {
    return 'border-green-500 bg-green-50 text-green-900'
  }

  if (value === selectedAnswer.value && !isCorrect.value) {
    return 'border-red-500 bg-red-50 text-red-900'
  }

  return 'border-gray-200 bg-gray-50 text-gray-500'
}

// Reset when question changes
watch(
  () => props.question,
  () => {
    answered.value = false
    selectedAnswer.value = null
    isCorrect.value = false
  },
)
</script>
