<template>
  <div class="flex min-h-screen flex-col">
    <header class="flex h-13 items-center gap-4 border-b border-line px-5 text-[13px] sm:px-7">
      <p class="min-w-0 truncate text-ink-soft">
        Quiz
        <template v-if="quizState !== 'setup'">
          <span class="text-ink-faint" aria-hidden="true">/</span>
          {{ selectedCategoryName }}
        </template>
      </p>
    </header>

    <main class="flex-1 px-5 py-10 sm:px-7 lg:px-14">
      <!-- Setup -->
      <div v-if="quizState === 'setup'" class="max-w-xl">
        <h1
          ref="setupHeadingRef"
          tabindex="-1"
          class="text-3xl font-semibold tracking-tight focus:outline-none"
        >
          Nouveau quiz
        </h1>
        <p class="mt-2 text-sm text-ink-soft">Réglez la session, puis lancez le quiz.</p>

        <div class="mt-8 flex flex-col gap-7">
          <div>
            <label for="quiz-category" class="label">Catégorie</label>
            <select id="quiz-category" v-model="selectedCategoryId" class="field">
              <option :value="null">Toutes les catégories</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>

          <fieldset class="m-0 border-0 p-0">
            <legend class="label">Type de questions</legend>
            <div class="grid grid-cols-3 gap-0.5 rounded border border-line-strong p-0.5">
              <label v-for="option in quizTypeOptions" :key="option.value" class="cursor-pointer">
                <input
                  v-model="quizType"
                  type="radio"
                  name="quiz-type"
                  :value="option.value"
                  class="peer sr-only"
                />
                <span
                  class="block rounded py-2 text-center text-[13px] font-medium text-ink-soft transition-colors hover:text-ink peer-checked:bg-surface peer-checked:text-ink peer-checked:shadow-[0_0_0_1px_var(--line)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-1 peer-focus-visible:outline-accent"
                >
                  {{ option.label }}
                </span>
              </label>
            </div>
          </fieldset>

          <div>
            <div class="flex items-baseline justify-between">
              <label for="quiz-count" class="label">Nombre de questions</label>
              <output for="quiz-count" class="text-sm font-semibold tabular-nums">{{
                questionCount
              }}</output>
            </div>
            <input
              id="quiz-count"
              v-model.number="questionCount"
              type="range"
              min="5"
              max="50"
              step="5"
              class="slider w-full"
            />
            <div class="mt-1 flex justify-between text-xs text-ink-faint tabular-nums">
              <span>5</span>
              <span>50</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              :disabled="termsLoading || availableTerms.length === 0"
              class="btn-primary"
              @click="startQuiz"
            >
              <span v-if="termsLoading">Chargement…</span>
              <span v-else>Commencer le quiz</span>
            </button>
            <p
              v-if="!termsLoading && availableTerms.length === 0"
              role="status"
              class="mt-3 text-sm text-danger"
            >
              Aucun terme disponible pour cette catégorie
            </p>
          </div>
        </div>
      </div>

      <!-- Quiz -->
      <div v-else-if="quizState === 'quiz' && currentQuestion" class="max-w-3xl">
        <QuizQuestion
          ref="quizQuestionRef"
          :question="currentQuestion"
          :current-question="currentIndex"
          :total-questions="questions.length"
          :score="score"
          @answer="handleAnswer"
        />

        <div class="mt-8">
          <button
            v-if="currentIndex < questions.length - 1"
            ref="nextButtonRef"
            type="button"
            :disabled="!hasAnswered"
            class="btn-primary"
            @click="nextQuestion"
          >
            Question suivante →
          </button>
          <button
            v-else
            ref="nextButtonRef"
            type="button"
            :disabled="!hasAnswered"
            class="btn-primary"
            @click="finishQuiz"
          >
            Voir les résultats
          </button>
        </div>

        <div
          class="mt-10 h-0.5 w-full max-w-md bg-line"
          role="progressbar"
          aria-label="Progression du quiz"
          :aria-valuenow="currentIndex + 1"
          aria-valuemin="1"
          :aria-valuemax="questions.length"
        >
          <div
            class="h-full bg-accent transition-[width] duration-300"
            :style="{ width: `${progress}%` }"
          />
        </div>
      </div>

      <!-- Results -->
      <div v-else-if="quizState === 'results'" class="max-w-xl">
        <p class="kicker mb-3">Résultat</p>
        <p class="text-7xl font-semibold tracking-[-0.04em] tabular-nums sm:text-8xl">
          {{ percentage }}<span class="text-ink-faint">%</span>
        </p>
        <h2
          ref="resultsHeadingRef"
          tabindex="-1"
          class="mt-4 font-serif text-3xl italic text-accent focus:outline-none"
        >
          {{ getResultTitle() }}
        </h2>

        <dl class="mt-8 grid max-w-sm grid-cols-2 border-y border-line py-4 text-sm">
          <div>
            <dt class="text-ink-faint">Bonnes réponses</dt>
            <dd class="mt-1 text-2xl font-semibold text-success tabular-nums">{{ score }}</dd>
          </div>
          <div>
            <dt class="text-ink-faint">Erreurs</dt>
            <dd class="mt-1 text-2xl font-semibold text-danger tabular-nums">
              {{ questions.length - score }}
            </dd>
          </div>
        </dl>

        <div class="mt-8 flex flex-wrap gap-2">
          <button type="button" class="btn-primary" @click="resetQuiz">Refaire un quiz</button>
          <NuxtLink to="/flashcards" class="btn-secondary">Réviser les fiches</NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import confetti from 'canvas-confetti'
import type { TermWithCategory } from '~/types'

const { categories, fetchCategories } = useCategories()
const { terms, fetchTerms, loading: termsLoading } = useTerms()
const {
  questions,
  currentIndex,
  score,
  progress,
  generateQuestions,
  submitAnswer,
  nextQuestion: quizNextQuestion,
  resetQuiz: quizReset,
} = useQuiz()

const route = useRoute()

function categoryFromQuery() {
  const raw = route.query.category
  if (typeof raw !== 'string') return null
  const id = parseInt(raw, 10)
  return isNaN(id) ? null : id
}

const quizState = ref<'setup' | 'quiz' | 'results'>('setup')
const selectedCategoryId = ref<number | null>(categoryFromQuery())

const selectedCategoryName = computed(
  () =>
    categories.value.find((c) => c.id === selectedCategoryId.value)?.name ??
    'Toutes les catégories',
)
const quizType = ref<'multiple-choice' | 'true-false' | 'mixed'>('mixed')
const questionCount = ref(10)
const hasAnswered = ref(false)
const nextButtonRef = ref<HTMLButtonElement | null>(null)
const quizQuestionRef = ref<{ focusHeading: () => void } | null>(null)
const setupHeadingRef = ref<HTMLElement | null>(null)
const resultsHeadingRef = ref<HTMLElement | null>(null)

const quizTypeOptions = [
  { value: 'multiple-choice', label: 'QCM' },
  { value: 'true-false', label: 'Vrai/Faux' },
  { value: 'mixed', label: 'Mixte' },
] as const

const availableTerms = computed(() => {
  if (selectedCategoryId.value === null) {
    return terms.value
  }
  return terms.value.filter((t: TermWithCategory) => t.category_id === selectedCategoryId.value)
})

const currentQuestion = computed(() => {
  return questions.value[currentIndex.value]
})

const percentage = computed(() => {
  return Math.round((score.value / questions.value.length) * 100)
})

onMounted(async () => {
  await Promise.all([fetchCategories(), fetchTerms()])
})

function startQuiz() {
  if (availableTerms.value.length === 0) return

  generateQuestions([...availableTerms.value], quizType.value, questionCount.value)
  quizState.value = 'quiz'
  hasAnswered.value = false
  nextTick(() => quizQuestionRef.value?.focusHeading())
}

function handleAnswer(answer: string | boolean) {
  submitAnswer(answer)
  hasAnswered.value = true
  nextTick(() => {
    nextButtonRef.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    nextButtonRef.value?.focus({ preventScroll: true })
  })
}

function nextQuestion() {
  quizNextQuestion()
  hasAnswered.value = false
  nextTick(() => quizQuestionRef.value?.focusHeading())
}

function finishQuiz() {
  quizState.value = 'results'
  nextTick(() => resultsHeadingRef.value?.focus())
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  setTimeout(() => {
    triggerConfetti(percentage.value)
  }, 300)
}

function resetQuiz() {
  quizReset()
  quizState.value = 'setup'
  hasAnswered.value = false
  nextTick(() => setupHeadingRef.value?.focus())
}

function getResultTitle() {
  if (percentage.value >= 90) return 'Excellent !'
  if (percentage.value >= 70) return 'Très bien !'
  if (percentage.value >= 50) return 'Pas mal !'
  return 'Continuez à vous entraîner !'
}

function triggerConfetti(percentage: number) {
  if (percentage >= 90) {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999,
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    })
    fire(0.2, {
      spread: 60,
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    })
  } else if (percentage >= 70) {
    // Good result: Stars and emojis
    const scalar = 2
    const star = confetti.shapeFromText({ text: '⭐', scalar })
    const party = confetti.shapeFromText({ text: '🎉', scalar })
    const fire = confetti.shapeFromText({ text: '🔥', scalar })

    confetti({
      shapes: [star, party, fire],
      scalar,
      spread: 100,
      particleCount: 50,
      origin: { y: 0.6 },
      zIndex: 9999,
    })
  } else if (percentage >= 50) {
    // Average result: Thumbs up and OK emojis
    const scalar = 2
    const thumbsup = confetti.shapeFromText({ text: '👍', scalar })
    const ok = confetti.shapeFromText({ text: '👌', scalar })
    const smile = confetti.shapeFromText({ text: '😊', scalar })

    confetti({
      shapes: [thumbsup, ok, smile],
      scalar,
      spread: 80,
      particleCount: 30,
      origin: { y: 0.6 },
      zIndex: 9999,
    })
  } else {
    // Bad result: Poop emoji
    const scalar = 3.5
    const poop = confetti.shapeFromText({ text: '💩', scalar })

    confetti({
      shapes: [poop],
      scalar,
      spread: 120,
      particleCount: 80,
      origin: { y: 0.6 },
      zIndex: 9999,
    })
  }
}
</script>
<style scoped>
.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 2px;
  background: var(--line-strong);
  outline: none;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--accent);
  border: 2px solid var(--paper);
  border-radius: 50%;
  cursor: pointer;
}

.slider:focus-visible::-webkit-slider-thumb {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.slider::-moz-range-track {
  height: 2px;
  background: var(--line-strong);
}

.slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: var(--accent);
  border: 2px solid var(--paper);
  border-radius: 50%;
  cursor: pointer;
}

.slider:focus-visible::-moz-range-thumb {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
</style>
