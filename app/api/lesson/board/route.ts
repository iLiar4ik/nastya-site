import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getStudentSession } from '@/lib/student-auth'
import { db } from '@/db'
import { lessonBoards } from '@/db/schema'
import { eq } from 'drizzle-orm'

async function checkAccess(studentId: number) {
  const admin = await getSession()
  const student = await getStudentSession()
  const allowed = !!admin || (!!student && student.id === studentId)
  return allowed
}

/** GET — загрузить сохранённое состояние доски для ученика */
export async function GET(req: NextRequest) {
  const studentIdStr = req.nextUrl.searchParams.get('studentId')
  const studentId = studentIdStr ? parseInt(studentIdStr, 10) : null
  if (studentId == null || isNaN(studentId)) {
    return NextResponse.json({ error: 'studentId required' }, { status: 400 })
  }
  if (!(await checkAccess(studentId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const [row] = await db.select().from(lessonBoards).where(eq(lessonBoards.studentId, studentId)).limit(1)
  if (!row) {
    return NextResponse.json({ state: null })
  }
  let state: unknown = null
  try {
    state = JSON.parse(row.state) as unknown
  } catch {
    return NextResponse.json({ state: null })
  }
  return NextResponse.json({ state })
}

/** POST — сохранить состояние доски для ученика */
export async function POST(req: NextRequest) {
  let body: { studentId?: number; state?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  const studentId = body.studentId != null ? Number(body.studentId) : null
  if (studentId == null || isNaN(studentId)) {
    return NextResponse.json({ error: 'studentId required' }, { status: 400 })
  }
  if (!(await checkAccess(studentId))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  const stateStr = body.state != null ? JSON.stringify(body.state) : '{}'
  await db
    .insert(lessonBoards)
    .values({
      studentId,
      state: stateStr,
      updatedAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: lessonBoards.studentId,
      set: {
        state: stateStr,
        updatedAt: new Date().toISOString(),
      },
    })
  return NextResponse.json({ ok: true })
}
