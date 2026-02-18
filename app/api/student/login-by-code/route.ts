import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { students } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { setStudentSession, STUDENT_SESSION_COOKIE, getStudentSessionCookieOptions } from '@/lib/student-auth'

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json()
    const trimmed = typeof code === 'string' ? code.trim() : ''
    if (!trimmed) {
      return NextResponse.json({ error: 'Введите код доступа' }, { status: 400 })
    }
    const student = await db.query.students.findFirst({
      where: eq(students.accessCode, trimmed),
      columns: { id: true, name: true },
    })
    if (!student) {
      return NextResponse.json({ error: 'Неверный код доступа' }, { status: 401 })
    }
    const res = NextResponse.json({ ok: true })
    res.cookies.set(STUDENT_SESSION_COOKIE, String(student.id), getStudentSessionCookieOptions())
    return res
  } catch (e) {
    console.error('Student login-by-code error:', e)
    return NextResponse.json({ error: 'Ошибка входа' }, { status: 500 })
  }
}
