import { createClient } from '@libsql/client'
import bcrypt from 'bcryptjs'
import path from 'path'

const url = process.env.DATABASE_URL ?? `file:${path.join(process.cwd(), 'data', 'payload.db')}`
const client = createClient({ url })

const email = (process.argv[2] ?? 'admin@example.com').trim().toLowerCase()
const password = process.argv[3] ?? 'admin123'
const name = process.argv[4] ?? 'Администратор'

const hash = await bcrypt.hash(password, 10)
try {
  await client.execute({
    sql: 'INSERT INTO users (email, name, password_hash) VALUES (?, ?, ?)',
    args: [email, name, hash],
  })
} catch (e) {
  if (e.message?.includes('UNIQUE')) {
    await client.execute({
      sql: 'UPDATE users SET name = ?, password_hash = ? WHERE email = ?',
      args: [name, hash, email],
    })
    console.log('Admin user updated:', email)
    process.exit(0)
  }
  throw e
}
console.log('Admin user created:', email)
