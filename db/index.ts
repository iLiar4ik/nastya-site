import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import path from 'path'
import fs from 'fs'
import * as schema from './schema'

// В production всегда один и тот же абсолютный путь, чтобы приложение и init-db использовали одну БД
// (при node .next/standalone/server.js cwd может быть другой и file:./data/... указывал бы не туда)
const PRODUCTION_DB_PATH = '/app/data/payload.db'

function getDatabaseUrl(): string {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return 'file::memory:'
  }
  const raw = process.env.DATABASE_URL
  let url: string
  if (raw) {
    url = raw
    if (process.env.NODE_ENV === 'production' && url.startsWith('file:')) {
      const p = url.replace(/^file:/, '')
      if (!path.isAbsolute(p)) {
        url = `file:${path.resolve('/app', p)}`
      }
    }
  } else {
    url =
      process.env.NODE_ENV === 'production'
        ? `file:${PRODUCTION_DB_PATH}`
        : `file:${path.join(process.cwd(), 'data', 'payload.db')}`
  }
  if (url.startsWith('file:')) {
    const dir = path.dirname(url.replace(/^file:/, ''))
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
