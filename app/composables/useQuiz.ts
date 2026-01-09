import type { QuizQuestion, TermWithCategory } from '~/types'

export function useQuiz() {
  const questions = useState<QuizQuestion[]>('quiz-questions', () => [])
  const currentIndex = useState('quiz-current-index', () => 0)
  const answers = useState<boolean[]>('quiz-answers', () => [])
  const score = useState('quiz-score', () => 0)

  function generateQuestions(
    terms: TermWithCategory[],
    type: 'multiple-choice' | 'true-false' | 'mixed',
    count: number = 10
  ) {
    const shuffled = [...terms].sort(() => Math.random() - 0.5)
    const selectedTerms = shuffled.slice(0, Math.min(count, shuffled.length))

    questions.value = selectedTerms.map((term) => {
      const questionType
        = type === 'mixed' ? (Math.random() > 0.5 ? 'multiple-choice' : 'true-false') : type

      if (questionType === 'multiple-choice') {
        return generateMultipleChoiceQuestion(term, terms)
      }
      else {
        return generateTrueFalseQuestion(term, terms)
      }
    })

    currentIndex.value = 0
    answers.value = []
    score.value = 0
  }

  function generateMultipleChoiceQuestion(
    term: TermWithCategory,
    allTerms: TermWithCategory[]
  ): QuizQuestion {
    const wrongAnswers = allTerms
      .filter(t => t.id !== term.id && t.category_id === term.category_id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(t => t.meaning)

    const options = [term.meaning, ...wrongAnswers].sort(() => Math.random() - 0.5)

    return {
      term,
      type: 'multiple-choice',
      options,
      correctAnswer: term.meaning
    }
  }

  function generateTrueFalseQuestion(
    term: TermWithCategory,
    allTerms: TermWithCategory[]
  ): QuizQuestion {
    const isTrue = Math.random() > 0.5
    const sameCategoryTerms = allTerms.filter(
      t => t.id !== term.id && t.category_id === term.category_id
    )

    const statement = isTrue
      ? term.meaning
      : sameCategoryTerms.length > 0
        ? sameCategoryTerms[Math.floor(Math.random() * sameCategoryTerms.length)]!.meaning
        : term.meaning

    return {
      term,
      type: 'true-false',
      statement,
      correctAnswer: isTrue
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
    return ((currentIndex.value + 1) / questions.value.length) * 100
  })

  const isComplete = computed(() => {
    return (
      currentIndex.value === questions.value.length - 1
      && answers.value.length === questions.value.length
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
    resetQuiz
  }
}
