import { getDatabase } from './db'

export interface Category {
  id: number
  name: string
  color: string
  description: string | null
  created_at: Date
  updated_at: Date
}

export interface Term {
  id: number
  root: string
  meaning: string
  category_id: number
  created_at: Date
  updated_at: Date
}

export interface TermWithCategory extends Term {
  category_name: string
  category_color: string
}

// Category queries
export async function getAllCategories(): Promise<Category[]> {
  const db = getDatabase()
  const result = await db`SELECT * FROM categories ORDER BY name ASC`
  return result as Category[]
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const db = getDatabase()
  const result = await db.query('SELECT * FROM categories WHERE id = $1', [id])
  return (result[0] as Category) || null
}

export async function createCategory(data: {
  name: string
  color: string
  description?: string
}): Promise<Category> {
  const db = getDatabase()
  const result = await db.query(
    'INSERT INTO categories (name, color, description) VALUES ($1, $2, $3) RETURNING *',
    [data.name, data.color, data.description || null],
  )
  return result[0] as Category
}

export async function updateCategory(
  id: number,
  data: Partial<{ name: string; color: string; description: string }>,
): Promise<Category | null> {
  const db = getDatabase()
  const fields: string[] = []
  const values: unknown[] = []
  let paramIndex = 1

  if (data.name !== undefined) {
    fields.push(`name = $${paramIndex++}`)
    values.push(data.name)
  }
  if (data.color !== undefined) {
    fields.push(`color = $${paramIndex++}`)
    values.push(data.color)
  }
  if (data.description !== undefined) {
    fields.push(`description = $${paramIndex++}`)
    values.push(data.description)
  }

  if (fields.length === 0) {
    return getCategoryById(id)
  }

  values.push(id)
  const result = await db.query(
    `UPDATE categories SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values,
  )
  return (result[0] as Category) || null
}

export async function deleteCategory(id: number): Promise<void> {
  const db = getDatabase()
  await db.query('DELETE FROM categories WHERE id = $1', [id])
}

// Term queries
export async function getAllTerms(): Promise<TermWithCategory[]> {
  const db = getDatabase()
  const result = await db`
    SELECT t.*, c.name as category_name, c.color as category_color
    FROM terms t
    JOIN categories c ON t.category_id = c.id
    ORDER BY t.root ASC
  `
  return result as TermWithCategory[]
}

export async function getTermsByCategory(categoryId: number): Promise<TermWithCategory[]> {
  const db = getDatabase()
  const result = await db.query(
    `
    SELECT t.*, c.name as category_name, c.color as category_color
    FROM terms t
    JOIN categories c ON t.category_id = c.id
    WHERE t.category_id = $1
    ORDER BY t.root ASC
  `,
    [categoryId],
  )
  return result as TermWithCategory[]
}

export async function getTermById(id: number): Promise<TermWithCategory | null> {
  const db = getDatabase()
  const result = await db.query(
    `
    SELECT t.*, c.name as category_name, c.color as category_color
    FROM terms t
    JOIN categories c ON t.category_id = c.id
    WHERE t.id = $1
  `,
    [id],
  )
  return (result[0] as TermWithCategory) || null
}

export async function createTerm(data: {
  root: string
  meaning: string
  category_id: number
}): Promise<Term> {
  const db = getDatabase()
  const result = await db.query(
    'INSERT INTO terms (root, meaning, category_id) VALUES ($1, $2, $3) RETURNING *',
    [data.root, data.meaning, data.category_id],
  )
  return result[0] as Term
}

export async function updateTerm(
  id: number,
  data: Partial<{ root: string; meaning: string; category_id: number }>,
): Promise<Term | null> {
  const db = getDatabase()
  const fields: string[] = []
  const values: unknown[] = []
  let paramIndex = 1

  if (data.root !== undefined) {
    fields.push(`root = $${paramIndex++}`)
    values.push(data.root)
  }
  if (data.meaning !== undefined) {
    fields.push(`meaning = $${paramIndex++}`)
    values.push(data.meaning)
  }
  if (data.category_id !== undefined) {
    fields.push(`category_id = $${paramIndex++}`)
    values.push(data.category_id)
  }

  if (fields.length === 0) {
    const result = await db.query('SELECT * FROM terms WHERE id = $1', [id])
    return (result[0] as Term) || null
  }

  values.push(id)
  const result = await db.query(
    `UPDATE terms SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values,
  )
  return (result[0] as Term) || null
}

export async function deleteTerm(id: number): Promise<void> {
  const db = getDatabase()
  await db.query('DELETE FROM terms WHERE id = $1', [id])
}
