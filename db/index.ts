import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import path from 'path'
import * as schema from './schema'

const url = process.env.DATABASE_URL ?? `file:${path.join(process.cwd(), 'data', 'payload.db')}`
const client = createClient({ url })
export const db = drizzle(client, { schema })
