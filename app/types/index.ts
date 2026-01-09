// Shared types for Luna-Prentissage

export interface Category {
  id: number
  name: string
  color: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Term {
  id: number
  root: string
  meaning: string
  category_id: number
  created_at: string
  updated_at: string
}

export interface TermWithCategory extends Term {
  category_name: string
  category_color: string
}

export interface QuizQuestion {
  term: TermWithCategory
  type: 'multiple-choice' | 'true-false'
  options?: readonly string[] | string[]
  statement?: string
  correctAnswer: string | boolean
}

export interface AdminSession {
  authenticated: boolean
  username?: string
}
