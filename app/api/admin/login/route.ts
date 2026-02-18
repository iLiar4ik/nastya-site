import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { verifyPassword, createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 })
    }
    const user = await db.query.users.findFirst({ where: eq(users.email, String(email).trim().toLowerCase()) })
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 })
    }
    const ok = await verifyPassword(String(password), user.passwordHash)
    if (!ok) {
      return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 })
    }
    await createSession(user.id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Login error:', e)
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('ConnectionFailed') || msg.includes('SQLITE_')) {
      return NextResponse.json({ error: 'Нет доступа к базе данных. Проверьте, что создан админ: в контейнере выполните cd /app && node scripts/create-admin.mjs' }, { status: 503 })
    }
    return NextResponse.json({ error: 'Ошибка входа' }, { status: 500 })
  }
}
