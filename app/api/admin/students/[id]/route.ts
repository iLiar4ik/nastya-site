import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { students, studentsSubjects } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const row = await db.query.students.findFirst({ where: eq(students.id, id) })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const subs = await db.query.studentsSubjects.findMany({ where: eq(studentsSubjects.studentId, id) })
  return NextResponse.json({ ...row, subjects: subs.map(x => x.subject) })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const body = await req.json()
  const firstName = (body.firstName ?? '').trim()
  const lastName = (body.lastName ?? '').trim()
  const name = [firstName, lastName].filter(Boolean).join(' ') || 'Ученик'
  await db.update(students).set({
    name,
    firstName: firstName || null,
    lastName: lastName || null,
    class: body.class ?? null,
    attendance: body.attendance,
    avgTestScore: body.avgTestScore,
    courseProgress: body.courseProgress,
    notes: (body.notes ?? '').trim() || null,
    updatedAt: new Date().toISOString(),
  }).where(eq(students.id, id))
  if (body.subjects !== undefined) {
    await db.delete(studentsSubjects).where(eq(studentsSubjects.studentId, id))
    if (body.subjects?.length) {
      await db.insert(studentsSubjects).values(
        body.subjects.map((subject: string) => ({ studentId: id, subject }))
      )
    }
  }
  const row = await db.query.students.findFirst({ where: eq(students.id, id) })
  return NextResponse.json(row)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  await db.delete(students).where(eq(students.id, id))
  return NextResponse.json({ ok: true })
}
