import type { QuizQuestion, TermWithCategory } from '~/types'
import { shuffleArray } from '~/utils/shuffle'

export function useQuiz() {
  const questions = useState<QuizQuestion[]>('quiz-questions', () => [])
  const currentIndex = useState('quiz-current-index', () => 0)
  const answers = useState<boolean[]>('quiz-answers', () => [])
  const score = useState('quiz-score', () => 0)

  function generateQuestions(
    terms: TermWithCategory[],
    type: 'multiple-choice' | 'true-false' | 'mixed',
    count: number = 10,
  ) {
    const shuffled = shuffleArray(terms)
    const selectedTerms = shuffled.slice(0, Math.min(count, shuffled.length))

    questions.value = selectedTerms.map((term) => {
      const questionType =
        type === 'mixed' ? (Math.random() > 0.5 ? 'multiple-choice' : 'true-false') : type

      if (questionType === 'multiple-choice') {
        return generateMultipleChoiceQuestion(term, terms)
      } else {
        return generateTrueFalseQuestion(term, terms)
      }
    })

    currentIndex.value = 0
    answers.value = []
    score.value = 0
  }

  function generateMultipleChoiceQuestion(
    term: TermWithCategory,
    allTerms: TermWithCategory[],
  ): QuizQuestion {
    // Prioritize terms from the same category, then fill with others
    const sameCategoryTerms = shuffleArray(
      allTerms.filter((t) => t.id !== term.id && t.category_id === term.category_id),
    )

    const otherCategoryTerms = shuffleArray(
      allTerms.filter((t) => t.id !== term.id && t.category_id !== term.category_id),
    )

    const wrongAnswers = [...sameCategoryTerms, ...otherCategoryTerms]
      .slice(0, 3)
      .map((t) => t.meaning)

    const options = shuffleArray([term.meaning, ...wrongAnswers])

    return {
      term,
      type: 'multiple-choice',
      options,
      correctAnswer: term.meaning,
    }
  }

  function generateTrueFalseQuestion(
    term: TermWithCategory,
    allTerms: TermWithCategory[],
  ): QuizQuestion {
    const otherTerms = allTerms.filter((t) => t.id !== term.id)

    // If no other terms available, force a "true" question
    const isTrue = otherTerms.length === 0 ? true : Math.random() > 0.5

    const statement = isTrue
      ? term.meaning
      : otherTerms[Math.floor(Math.random() * otherTerms.length)]!.meaning

    return {
      term,
      type: 'true-false',
      statement,
      correctAnswer: isTrue,
    }
  }

  function submitAnswer(answer: string | boolean) {
    const currentQuestion = questions.value[currentIndex.value]
    if (!currentQuestion) return

    const isCorrect = answer === currentQuestion.correctAnswer

    answers.value.push(isCorrect)
    if (isCorrect) {
      score.value++
    }
  }

  function nextQuestion() {
    if (currentIndex.value < questions.value.length - 1) {
      currentIndex.value++
    }
  }

  function resetQuiz() {
    questions.value = []
    currentIndex.value = 0
    answers.value = []
    score.value = 0
  }

  const progress = computed(() => {
    if (questions.value.length === 0) return 0
    return ((currentIndex.value + 1) / questions.value.length) * 100
  })

  const isComplete = computed(() => {
    return (
      currentIndex.value === questions.value.length - 1 &&
      answers.value.length === questions.value.length
    )
  })

  return {
    questions: readonly(questions),
    currentIndex: readonly(currentIndex),
    answers: readonly(answers),
    score: readonly(score),
    progress,
    isComplete,
    generateQuestions,
    submitAnswer,
    nextQuestion,
    resetQuiz,
  }
}
