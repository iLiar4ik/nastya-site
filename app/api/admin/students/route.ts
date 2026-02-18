import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { students, studentsSubjects } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await db.query.students.findMany({ orderBy: [desc(students.createdAt)] })
  const withSubjects = await Promise.all(rows.map(async (s) => {
    const subs = await db.query.studentsSubjects.findMany({
      where: eq(studentsSubjects.studentId, s.id),
    })
    return { ...s, subjects: subs.map(x => x.subject) }
  }))
  return NextResponse.json(withSubjects)
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const [row] = await db.insert(students).values({
    name: body.name,
    class: body.class ?? null,
    email: body.email ?? null,
    phone: body.phone ?? null,
    attendance: body.attendance ?? 100,
    avgTestScore: body.avgTestScore ?? null,
    courseProgress: body.courseProgress ?? 0,
    notes: body.notes ?? null,
  }).returning()
  if (body.subjects?.length) {
    await db.insert(studentsSubjects).values(
      body.subjects.map((subject: string) => ({ studentId: row.id, subject }))
    )
  }
  return NextResponse.json(row)
}
