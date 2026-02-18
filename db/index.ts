import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import path from 'path'
import fs from 'fs'
import * as schema from './schema'

function getDatabaseUrl(): string {
  const defaultPath =
    process.env.NODE_ENV === 'production'
      ? '/app/data/payload.db'
      : path.join(process.cwd(), 'data', 'payload.db')
  const url = process.env.DATABASE_URL ?? `file:${defaultPath}`
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return 'file::memory:'
  }
  if (url.startsWith('file:')) {
    const dir = path.dirname(url.replace('file:', ''))
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true })
      } catch {
        return 'file::memory:'
      }
    }
  }
  return url
}

const client = createClient({ url: getDatabaseUrl() })
export const db = drizzle(client, { schema })
