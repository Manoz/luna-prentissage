import { neon } from '@neondatabase/serverless'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config()

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is required')
}

const sql = neon(DATABASE_URL)

interface CategoryData {
  name: string
  color: string
  description: string
}

interface TermData {
  root: string
  meaning: string
  category: string
}

async function migrate() {
  console.log('Starting migration...')

  try {
    // 1. Create tables
    console.log('Creating tables...')

    await sql`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        color VARCHAR(7) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`CREATE INDEX IF NOT EXISTS idx_categories_name ON categories(name)`

    await sql`
      CREATE TABLE IF NOT EXISTS terms (
        id SERIAL PRIMARY KEY,
        root VARCHAR(255) NOT NULL,
        meaning VARCHAR(500) NOT NULL,
        category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    await sql`CREATE INDEX IF NOT EXISTS idx_terms_category_id ON terms(category_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_terms_root ON terms(root)`

    console.log('Tables created successfully')

    // 2. Load JSON data
    const categoriesPath = path.join(process.cwd(), 'docs', 'categories.json')
    const termsPath = path.join(process.cwd(), 'docs', 'terms.json')

    const categoriesData: CategoryData[] = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'))
    const termsData: TermData[] = JSON.parse(fs.readFileSync(termsPath, 'utf-8'))

    // 3. Insert categories
    console.log('Inserting categories...')
    const categoryMap = new Map<string, number>()

    for (const category of categoriesData) {
      const result = await sql.query(
        `INSERT INTO categories (name, color, description)
         VALUES ($1, $2, $3)
         ON CONFLICT (name) DO UPDATE SET color = $2, description = $3
         RETURNING id`,
        [category.name, category.color, category.description]
      )
      categoryMap.set(category.name, result[0].id as number)
      console.log(`Inserted category: ${category.name}`)
    }

    console.log(`${categoriesData.length} categories inserted`)

    // 4. Insert terms
    console.log('Inserting terms...')
    let termCount = 0

    for (const term of termsData) {
      const categoryId = categoryMap.get(term.category)

      if (!categoryId) {
        console.warn(`Category not found for term: ${term.root} (${term.category})`)
        continue
      }

      await sql.query('INSERT INTO terms (root, meaning, category_id) VALUES ($1, $2, $3)', [
        term.root,
        term.meaning,
        categoryId
      ])
      termCount++

      if (termCount % 50 === 0) {
        console.log(`Inserted ${termCount} terms...`)
      }
    }

    console.log(`${termCount} terms inserted`)
    console.log('Migration completed successfully!')

    // 5. Display statistics
    const categoryCountResult = await sql`SELECT COUNT(*) FROM categories`
    const termCountResult = await sql`SELECT COUNT(*) FROM terms`

    console.log('\nDatabase statistics:')
    console.log(`Total categories: ${categoryCountResult[0].count}`)
    console.log(`Total terms: ${termCountResult[0].count}`)

  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

migrate()
