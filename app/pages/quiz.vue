<template>
  <div class="min-h-screen bg-warm-cream">
    <div
      class="fixed inset-0 opacity-[0.03] pointer-events-none"
      style="
        background-image: url('data:image/svg+xml,%3Csvg width=&quot;200&quot; height=&quot;200&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cfilter id=&quot;noise&quot;%3E%3CfeTurbulence type=&quot;fractalNoise&quot; baseFrequency=&quot;0.9&quot; numOctaves=&quot;4&quot; /%3E%3C/filter%3E%3Crect width=&quot;100%25&quot; height=&quot;100%25&quot; filter=&quot;url(%23noise)&quot; /%3E%3C/svg%3E');
      "
    />

    <div class="relative">
      <!-- Header -->
      <header class="border-b border-deep-teal/10">
        <div class="container mx-auto px-6 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <NuxtLink
                to="/"
                aria-label="Retour à l'accueil"
                class="text-deep-teal-muted hover:text-deep-teal transition-colors"
              >
                <svg
                  class="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </NuxtLink>
              <h1 class="text-2xl font-serif font-bold text-deep-teal">Mode Quiz</h1>
            </div>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-6 py-12">
        <!-- Setup Screen -->
        <div v-if="quizState === 'setup'" class="max-w-2xl mx-auto">
          <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2
              ref="setupHeadingRef"
              tabindex="-1"
              class="text-3xl font-serif font-bold text-deep-teal mb-2 focus:outline-none"
            >
              Configurer votre quiz
            </h2>
            <p class="text-deep-teal-muted mb-8">
              Choisissez les paramètres pour personnaliser votre session de quiz.
            </p>

            <div class="space-y-8">
              <!-- Category Selection -->
              <div>
                <label for="quiz-category" class="block text-sm font-semibold text-deep-teal mb-3">
                  Catégorie
                </label>
                <select
                  id="quiz-category"
                  v-model="selectedCategoryId"
                  class="w-full px-4 py-3 border-2 border-deep-teal/70 rounded-lg focus:border-deep-teal focus:outline-none"
                >
                  <option :value="null">Toutes les catégories</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <!-- Quiz Type -->
              <fieldset>
                <legend class="block text-sm font-semibold text-deep-teal mb-3">
                  Type de questions
                </legend>
                <div class="grid grid-cols-3 gap-3">
                  <label
                    v-for="option in quizTypeOptions"
                    :key="option.value"
                    class="cursor-pointer"
                  >
                    <input
                      v-model="quizType"
                      type="radio"
                      name="quiz-type"
                      :value="option.value"
                      class="sr-only peer"
                    />
                    <span
                      class="block p-4 rounded-lg border-2 border-deep-teal/40 text-center text-sm font-medium text-deep-teal transition-all hover:border-deep-teal peer-checked:border-terracotta peer-checked:bg-terracotta/10 peer-checked:font-semibold peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-deep-teal"
                    >
                      {{ option.label }}
                    </span>
                  </label>
                </div>
              </fieldset>

              <!-- Number of Questions -->
              <div>
                <label for="quiz-count" class="block text-sm font-semibold text-deep-teal mb-3">
                  Nombre de questions
                </label>
                <div class="py-4">
                  <input
                    id="quiz-count"
                    v-model.number="questionCount"
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    class="slider w-full"
                  />
                </div>
                <div class="flex justify-between text-sm text-deep-teal-muted mt-2">
                  <span>5</span>
                  <output for="quiz-count" class="text-lg font-semibold text-deep-teal">
                    {{ questionCount }}
                  </output>
                  <span>50</span>
                </div>
              </div>

              <!-- Start Button -->
              <button
                type="button"
                :disabled="termsLoading || availableTerms.length === 0"
                class="w-full py-4 bg-deep-teal text-white font-semibold rounded-full hover:bg-deep-teal/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                @click="startQuiz"
              >
                <span v-if="termsLoading">Chargement...</span>
                <span v-else>Commencer le quiz</span>
              </button>

              <p
                v-if="!termsLoading && availableTerms.length === 0"
                role="status"
                class="text-center text-red-700 text-sm"
              >
                Aucun terme disponible pour cette catégorie
              </p>
            </div>
          </div>
        </div>

        <!-- Quiz Screen -->
        <div v-else-if="quizState === 'quiz' && currentQuestion" class="max-w-4xl mx-auto">
          <QuizQuestion
            ref="quizQuestionRef"
            :question="currentQuestion"
            :current-question="currentIndex"
            :total-questions="questions.length"
            :progress="progress"
            :score="score"
            @answer="handleAnswer"
          />

          <div class="text-center mt-8">
            <button
              v-if="currentIndex < questions.length - 1"
              ref="nextButtonRef"
              type="button"
              :disabled="!hasAnswered"
              class="px-8 py-3 bg-deep-teal text-white font-semibold rounded-full hover:bg-deep-teal/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              @click="nextQuestion"
            >
              Question suivante
            </button>
            <button
              v-else
              ref="nextButtonRef"
              type="button"
              :disabled="!hasAnswered"
              class="px-8 py-3 bg-terracotta-dark text-warm-cream font-semibold rounded-full hover:bg-terracotta-dark/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              @click="finishQuiz"
            >
              Voir les résultats
            </button>
          </div>
        </div>

        <!-- Results Screen -->
        <div v-else-if="quizState === 'results'" class="max-w-2xl mx-auto">
          <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div class="mb-8">
              <div
                class="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-6xl font-serif font-bold"
                :class="{
                  'bg-green-100 text-green-800': percentage >= 70,
                  'bg-yellow-100 text-yellow-800': percentage >= 50 && percentage < 70,
                  'bg-red-100 text-red-800': percentage < 50,
                }"
              >
                {{ percentage }}%
              </div>

              <h2
                ref="resultsHeadingRef"
                tabindex="-1"
                class="text-4xl font-serif font-bold text-deep-teal mb-2 focus:outline-none"
              >
                {{ getResultTitle() }}
              </h2>

              <p class="text-xl text-deep-teal-muted">
                Vous avez obtenu
                <span class="font-semibold text-deep-teal">{{ score }}/{{ questions.length }}</span>
                bonnes réponses
              </p>
            </div>

            <div class="grid grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-deep-teal/5 rounded-xl">
                <div class="text-3xl font-serif font-bold text-deep-teal mb-1">
                  {{ score }}
                </div>
                <div class="text-sm text-deep-teal-muted">Bonnes réponses</div>
              </div>

              <div class="p-6 bg-terracotta/5 rounded-xl">
                <div class="text-3xl font-serif font-bold text-terracotta mb-1">
                  {{ questions.length - score }}
                </div>
                <div class="text-sm text-deep-teal-muted">Erreurs</div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                class="flex-1 px-6 py-3 bg-deep-teal text-white font-semibold rounded-full hover:bg-deep-teal/90 transition-all cursor-pointer"
                @click="resetQuiz"
              >
                Recommencer
              </button>
              <NuxtLink
                to="/"
                class="flex-1 px-6 py-3 border-2 border-deep-teal/70 text-deep-teal font-semibold rounded-full hover:bg-deep-teal/5 transition-all text-center"
              >
                Retour à l'accueil
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
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

const quizState = ref<'setup' | 'quiz' | 'results'>('setup')
const selectedCategoryId = ref<number | null>(null)
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
/* Custom range input styling */
.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  background: #2d5f5d20;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
}

/* WebKit (Chrome, Safari, Edge) */
.slider::-webkit-slider-track {
  width: 100%;
  height: 8px;
  background: #2d5f5d20;
  border-radius: 8px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  background: #2d5f5d;
  border: 4px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(45, 95, 93, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.slider:focus-visible::-webkit-slider-thumb {
  outline: 3px solid #2d5f5d;
  outline-offset: 2px;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 8px rgba(45, 95, 93, 0.4);
}

.slider::-webkit-slider-thumb:active {
  transform: scale(1.05);
}

/* Firefox */
.slider::-moz-range-track {
  width: 100%;
  height: 8px;
  background: #2d5f5d20;
  border-radius: 8px;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #2d5f5d;
  border: 4px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(45, 95, 93, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
}

.slider:focus-visible::-moz-range-thumb {
  outline: 3px solid #2d5f5d;
  outline-offset: 2px;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 8px rgba(45, 95, 93, 0.4);
}

.slider::-moz-range-thumb:active {
  transform: scale(1.05);
}

/* Edge/IE */
.slider::-ms-track {
  width: 100%;
  height: 8px;
  background: transparent;
  border-color: transparent;
  color: transparent;
}

.slider::-ms-fill-lower {
  background: #2d5f5d;
  border-radius: 8px;
}

.slider::-ms-fill-upper {
  background: #2d5f5d20;
  border-radius: 8px;
}

.slider::-ms-thumb {
  width: 20px;
  height: 20px;
  background: #2d5f5d;
  border: 4px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(45, 95, 93, 0.3);
  cursor: pointer;
}
</style>
