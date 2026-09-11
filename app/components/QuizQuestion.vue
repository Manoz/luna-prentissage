<template>
  <div class="quiz-question">
    <div class="mb-8 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink-faint">
      <span id="quiz-question-position" class="tabular-nums">
        Question <span class="text-ink">{{ currentQuestion + 1 }}</span> / {{ totalQuestions }}
      </span>
      <span class="tabular-nums">
        Score <span class="text-ink">{{ score }}</span> / {{ currentQuestion + (answered ? 1 : 0) }}
      </span>
    </div>

    <!-- Multiple choice -->
    <div v-if="question.type === 'multiple-choice'">
      <h2
        ref="headingRef"
        tabindex="-1"
        aria-describedby="quiz-question-position"
        class="text-2xl font-semibold tracking-tight focus:outline-none sm:text-3xl"
      >
        Que signifie <span class="font-serif italic text-accent">{{ question.term.root }}</span> ?
      </h2>
      <div class="mt-7 flex max-w-xl flex-col gap-2">
        <button
          v-for="(option, index) in question.options"
          :key="index"
          type="button"
          :aria-disabled="answered"
          class="flex min-h-11 w-full items-center gap-3 rounded border px-4 py-2.5 text-left text-[15px] transition-colors aria-disabled:cursor-default"
          :class="getOptionClass(option)"
          @click="selectAnswer(option)"
        >
          <span class="w-4 shrink-0 text-xs text-ink-faint" aria-hidden="true">{{
            letters[index]
          }}</span>
          {{ option }}
        </button>
      </div>
    </div>

    <!-- True / false -->
    <div v-else-if="question.type === 'true-false'">
      <h2
        ref="headingRef"
        tabindex="-1"
        aria-describedby="quiz-question-position"
        class="text-2xl font-semibold tracking-tight focus:outline-none sm:text-3xl"
      >
        <span class="font-serif italic text-accent">{{ question.term.root }}</span> signifie
        <span class="font-serif italic text-accent">{{ question.statement }}</span>
      </h2>
      <div class="mt-7 grid max-w-xl grid-cols-2 gap-2">
        <button
          type="button"
          :aria-disabled="answered"
          class="min-h-12 rounded border px-4 text-[15px] font-medium transition-colors aria-disabled:cursor-default"
          :class="getTrueFalseClass(true)"
          @click="selectAnswer(true)"
        >
          Vrai
        </button>
        <button
          type="button"
          :aria-disabled="answered"
          class="min-h-12 rounded border px-4 text-[15px] font-medium transition-colors aria-disabled:cursor-default"
          :class="getTrueFalseClass(false)"
          @click="selectAnswer(false)"
        >
          Faux
        </button>
      </div>
    </div>

    <!-- Feedback: the live region stays mounted so announcements are reliable -->
    <div role="status" aria-live="polite">
      <div
        v-if="answered"
        class="mt-8 max-w-xl border-l-2 pl-4"
        :class="isCorrect ? 'border-success' : 'border-danger'"
      >
        <p class="font-semibold" :class="isCorrect ? 'text-success' : 'text-danger'">
          {{ isCorrect ? 'Correct' : 'Incorrect' }}
        </p>
        <p v-if="!isCorrect" class="mt-1 text-sm text-ink-2">
          La bonne réponse est
          <span class="font-serif text-base italic text-accent">{{
            formatAnswer(question.correctAnswer)
          }}</span
          >.
        </p>
        <p class="mt-1 text-xs text-ink-faint">{{ question.term.category_name }}</p>
        <p class="sr-only">Score : {{ score }} sur {{ currentQuestion + 1 }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { QuizQuestion } from '~/types'

interface Props {
  question: QuizQuestion
  currentQuestion: number
  totalQuestions: number
  score: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  answer: [answer: string | boolean]
}>()

const letters = ['A', 'B', 'C', 'D', 'E', 'F']

const answered = ref(false)
const selectedAnswer = ref<string | boolean | null>(null)
const isCorrect = ref(false)
const headingRef = ref<HTMLElement | null>(null)

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

function focusHeading() {
  headingRef.value?.focus()
}

const idleClass = 'border-line-strong text-ink hover:border-ink hover:bg-ink/6'
const correctClass = 'border-success bg-success-soft text-ink'
const wrongClass = 'border-danger bg-danger-soft text-ink'
const dimClass = 'border-line text-ink-faint'

function getOptionClass(option: string) {
  if (!answered.value) return idleClass
  if (option === props.question.correctAnswer) return correctClass
  if (option === selectedAnswer.value && !isCorrect.value) return wrongClass
  return dimClass
}

function getTrueFalseClass(value: boolean) {
  if (!answered.value) return idleClass
  if (value === props.question.correctAnswer) return correctClass
  if (value === selectedAnswer.value && !isCorrect.value) return wrongClass
  return dimClass
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

defineExpose({
  focusHeading,
})
</script>
