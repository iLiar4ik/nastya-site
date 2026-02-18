import { cookies } from 'next/headers'
import { db } from '@/db'
import { students } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const STUDENT_SESSION_COOKIE = 'student_session'
const STUDENT_SESSION_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

function getStudentCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax' as const,
    maxAge: STUDENT_SESSION_MAX_AGE,
    path: '/',
  }
}

export function getStudentSessionCookieOptions() {
  return getStudentCookieOptions()
}

export async function setStudentSession(studentId: number) {
  const cookieStore = await cookies()
  cookieStore.set(STUDENT_SESSION_COOKIE, String(studentId), getStudentCookieOptions())
}

export async function getStudentSession() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get(STUDENT_SESSION_COOKIE)
  if (!cookie?.value) return null
  try {
    const studentId = parseInt(cookie.value, 10)
    if (isNaN(studentId)) return null
    const student = await db.query.students.findFirst({
      where: eq(students.id, studentId),
      columns: { id: true, name: true, class: true },
    })
    return student ?? null
  } catch {
    return null
  }
}

export async function clearStudentSession() {
  const cookieStore = await cookies()
  cookieStore.delete(STUDENT_SESSION_COOKIE)
}
