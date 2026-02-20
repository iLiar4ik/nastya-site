import { NextRequest, NextResponse } from 'next/server'
import { getStudentSession } from '@/lib/student-auth'
import { db } from '@/db'
import { homework } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const student = await getStudentSession()
  if (!student) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = parseInt((await params).id, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const body = await req.json().catch(() => ({}))
  const hw = await db.query.homework.findFirst({
    where: and(eq(homework.id, id), eq(homework.studentId, student.id)),
  })
  if (!hw) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (hw.status !== 'active' && hw.status !== 'overdue') {
    return NextResponse.json({ error: 'Задание уже сдано или закрыто' }, { status: 400 })
  }
  const now = new Date().toISOString()
  await db.update(homework).set({
    submissionContent: body.submissionContent ?? hw.submissionContent ?? null,
    submissionFileId: body.submissionFileId ?? hw.submissionFileId ?? null,
    submittedDate: now.slice(0, 10),
    status: 'review',
    updatedAt: now,
  }).where(eq(homework.id, id))
  const row = await db.query.homework.findFirst({ where: eq(homework.id, id) })
  return NextResponse.json(row)
}
