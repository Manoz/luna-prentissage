import { neon } from '@neondatabase/serverless'
import type { NeonQueryFunction } from '@neondatabase/serverless'

let db: NeonQueryFunction<false, false> | null = null

export function getDatabase() {
  const config = useRuntimeConfig()

  if (!db) {
    if (!config.databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set')
    }

    db = neon(config.databaseUrl)
  }

  return db
}
