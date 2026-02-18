import { NextResponse } from 'next/server'
import { clearStudentSession, STUDENT_SESSION_COOKIE } from '@/lib/student-auth'

export async function POST() {
  await clearStudentSession()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(STUDENT_SESSION_COOKIE, '', { maxAge: 0, path: '/' })
  return res
}
