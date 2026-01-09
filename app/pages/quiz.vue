<template>
  <div class="min-h-screen bg-warmCream">
    <div class="fixed inset-0 opacity-[0.03] pointer-events-none" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;200&quot; height=&quot;200&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cfilter id=&quot;noise&quot;%3E%3CfeTurbulence type=&quot;fractalNoise&quot; baseFrequency=&quot;0.9&quot; numOctaves=&quot;4&quot; /%3E%3C/filter%3E%3Crect width=&quot;100%25&quot; height=&quot;100%25&quot; filter=&quot;url(%23noise)&quot; /%3E%3C/svg%3E')" />

    <div class="relative">
      <!-- Header -->
      <header class="border-b border-deepTeal/10">
        <div class="container mx-auto px-6 py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <NuxtLink to="/" class="text-deepTeal/60 hover:text-deepTeal transition-colors">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </NuxtLink>
              <h1 class="text-2xl font-serif font-bold text-deepTeal">
                Mode Quiz
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div class="container mx-auto px-6 py-12">
        <!-- Setup Screen -->
        <div v-if="quizState === 'setup'" class="max-w-2xl mx-auto">
          <div class="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h2 class="text-3xl font-serif font-bold text-deepTeal mb-2">
              Configurer votre quiz
            </h2>
            <p class="text-deepTeal/60 mb-8">
              Choisissez les paramètres pour personnaliser votre session de quiz.
            </p>

            <div class="space-y-8">
              <!-- Category Selection -->
              <div>
                <label class="block text-sm font-semibold text-deepTeal mb-3">
                  Catégorie
                </label>
                <select
                  v-model="selectedCategoryId"
                  class="w-full px-4 py-3 border-2 border-deepTeal/20 rounded-lg focus:border-deepTeal focus:outline-none"
                >
                  <option :value="null">Toutes les catégories</option>
                  <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <!-- Quiz Type -->
              <div>
                <label class="block text-sm font-semibold text-deepTeal mb-3">
                  Type de questions
                </label>
                <div class="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    class="p-4 rounded-lg border-2 transition-all cursor-pointer"
                    :class="{
                      'border-terracotta text-terracotta': quizType === 'multiple-choice',
                      'border-deepTeal/20 text-deepTeal/60 hover:border-deepTeal/40': quizType !== 'multiple-choice'
                    }"
                    @click="quizType = 'multiple-choice'"
                  >
                    <div class="flex items-center justify-center gap-2">
                      <div class="text-sm font-medium">QCM</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    class="p-4 rounded-lg border-2 transition-all cursor-pointer"
                    :class="{
                      'border-terracotta text-terracotta': quizType === 'true-false',
                      'border-deepTeal/20 text-deepTeal/60 hover:border-deepTeal/40': quizType !== 'true-false'
                    }"
                    @click="quizType = 'true-false'"
                  >
                    <div class="flex items-center justify-center gap-2">
                      <div class="text-sm font-medium">Vrai/Faux</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    class="p-4 rounded-lg border-2 transition-all cursor-pointer"
                    :class="{
                      'border-terracotta text-terracotta': quizType === 'mixed',
                      'border-deepTeal/40 text-deepTeal/60 hover:border-deepTeal/40': quizType !== 'mixed'
                    }"
                    @click="quizType = 'mixed'"
                  >
                    <div class="flex items-center justify-center gap-2">
                      <div class="text-sm font-medium">Mixte</div>
                    </div>
                  </button>
                </div>
              </div>

              <!-- Number of Questions -->
              <div>
                <label class="block text-sm font-semibold text-deepTeal mb-3">
                  Nombre de questions
                </label>
                <div class="py-4">
                  <input
                    v-model.number="questionCount"
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    class="slider w-full"
                  >
                </div>
                <div class="flex justify-between text-sm text-deepTeal/60 mt-2">
                  <span>5</span>
                  <span class="text-lg font-semibold text-deepTeal">{{ questionCount }}</span>
                  <span>50</span>
                </div>
              </div>

              <!-- Start Button -->
              <button
                type="button"
                :disabled="availableTerms.length === 0"
                class="w-full py-4 bg-deepTeal text-white font-semibold rounded-full hover:bg-deepTeal/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                @click="startQuiz"
              >
                Commencer le quiz
              </button>

              <p v-if="availableTerms.length === 0" class="text-center text-terracotta text-sm">
                Aucun terme disponible pour cette catégorie
              </p>
            </div>
          </div>
        </div>

        <!-- Quiz Screen -->
        <div v-else-if="quizState === 'quiz' && currentQuestion" class="max-w-4xl mx-auto">
          <QuizQuestion
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
              type="button"
              :disabled="!hasAnswered"
              class="px-8 py-3 bg-deepTeal text-white font-semibold rounded-full hover:bg-deepTeal/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              @click="nextQuestion"
            >
              Question suivante
            </button>
            <button
              v-else
              type="button"
              :disabled="!hasAnswered"
              class="px-8 py-3 bg-terracotta text-warmCream font-semibold rounded-full hover:bg-terracotta/90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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
                  'bg-green-100 text-green-600': percentage >= 70,
                  'bg-yellow-100 text-yellow-600': percentage >= 50 && percentage < 70,
                  'bg-red-100 text-red-600': percentage < 50
                }"
              >
                {{ percentage }}%
              </div>

              <h2 class="text-4xl font-serif font-bold text-deepTeal mb-2">
                {{ getResultTitle() }}
              </h2>

              <p class="text-xl text-deepTeal/70">
                Vous avez obtenu <span class="font-semibold text-deepTeal">{{ score }}/{{ questions.length }}</span> bonnes réponses
              </p>
            </div>

            <div class="grid grid-cols-2 gap-6 mb-8">
              <div class="p-6 bg-deepTeal/5 rounded-xl">
                <div class="text-3xl font-serif font-bold text-deepTeal mb-1">
                  {{ score }}
                </div>
                <div class="text-sm text-deepTeal/60">Bonnes réponses</div>
              </div>

              <div class="p-6 bg-terracotta/5 rounded-xl">
                <div class="text-3xl font-serif font-bold text-terracotta mb-1">
                  {{ questions.length - score }}
                </div>
                <div class="text-sm text-deepTeal/60">Erreurs</div>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                type="button"
                class="flex-1 px-6 py-3 bg-deepTeal text-white font-semibold rounded-full hover:bg-deepTeal/90 transition-all"
                @click="resetQuiz"
              >
                Recommencer
              </button>
              <NuxtLink
                to="/"
                class="flex-1 px-6 py-3 border-2 border-deepTeal/20 text-deepTeal font-semibold rounded-full hover:bg-deepTeal/5 transition-all inline-block"
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
const { terms, fetchTerms, loading } = useTerms()
const {
  questions,
  currentIndex,
  score,
  progress,
  isComplete,
  generateQuestions,
  submitAnswer,
  nextQuestion: quizNextQuestion,
  resetQuiz: quizReset
} = useQuiz()

const quizState = ref<'setup' | 'quiz' | 'results'>('setup')
const selectedCategoryId = ref<number | null>(null)
const quizType = ref<'multiple-choice' | 'true-false' | 'mixed'>('mixed')
const questionCount = ref(10)
const hasAnswered = ref(false)

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
  await Promise.all([
    fetchCategories(),
    fetchTerms()
  ])
})

function startQuiz() {
  if (availableTerms.value.length === 0) return

  generateQuestions([...availableTerms.value], quizType.value, questionCount.value)
  quizState.value = 'quiz'
  hasAnswered.value = false
}

function handleAnswer(answer: string | boolean) {
  submitAnswer(answer)
  hasAnswered.value = true
}

function nextQuestion() {
  quizNextQuestion()
  hasAnswered.value = false
}

function finishQuiz() {
  quizState.value = 'results'
  // Trigger confetti animation after a small delay
  setTimeout(() => {
    triggerConfetti(percentage.value)
  }, 300)
}

function resetQuiz() {
  quizReset()
  quizState.value = 'setup'
  hasAnswered.value = false
}

function getResultTitle() {
  if (percentage.value >= 90) return 'Excellent !'
  if (percentage.value >= 70) return 'Très bien !'
  if (percentage.value >= 50) return 'Pas mal !'
  return 'Continuez à vous entraîner !'
}

function triggerConfetti(percentage: number) {
  if (percentage >= 90) {
    // Excellent: Multiple colorful confetti bursts
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 9999
    }

    function fire(particleRatio: number, opts: any) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      })
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55
    })
    fire(0.2, {
      spread: 60
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45
    })
  }
  else if (percentage >= 70) {
    // Bon résultat: Stars and emojis
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
      zIndex: 9999
    })
  }
  else if (percentage >= 50) {
    // Résultat moyen: Thumbs up and OK emojis
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
      zIndex: 9999
    })
  }
  else {
    // Mauvais résultat: Poop emoji
    const scalar = 2.5
    const poop = confetti.shapeFromText({ text: '💩', scalar })
    const sad = confetti.shapeFromText({ text: '😅', scalar })

    confetti({
      shapes: [poop, sad],
      scalar,
      spread: 60,
      particleCount: 20,
      origin: { y: 0.6 },
      zIndex: 9999,
      colors: ['#8B4513', '#A0522D']
    })
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700;900&family=DM+Sans:wght@400;500;600;700&display=swap');

* {
  font-family: 'DM Sans', sans-serif;
}

.font-serif {
  font-family: 'Crimson Pro', serif;
}

.bg-warmCream {
  background-color: #FAF9F6;
}

.text-deepTeal {
  color: #2D5F5D;
}

.bg-deepTeal {
  background-color: #2D5F5D;
}

.text-terracotta {
  color: #C1666B;
}

.bg-terracotta {
  background-color: #C1666B;
}

/* Custom range input styling */
.slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 8px;
  background: #2D5F5D20;
  border-radius: 8px;
  outline: none;
  cursor: pointer;
}

/* WebKit (Chrome, Safari, Edge) */
.slider::-webkit-slider-track {
  width: 100%;
  height: 8px;
  background: #2D5F5D20;
  border-radius: 8px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  background: #2D5F5D;
  border: 4px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(45, 95, 93, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
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
  background: #2D5F5D20;
  border-radius: 8px;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #2D5F5D;
  border: 4px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(45, 95, 93, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
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
  background: #2D5F5D;
  border-radius: 8px;
}

.slider::-ms-fill-upper {
  background: #2D5F5D20;
  border-radius: 8px;
}

.slider::-ms-thumb {
  width: 20px;
  height: 20px;
  background: #2D5F5D;
  border: 4px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(45, 95, 93, 0.3);
  cursor: pointer;
}
</style>
