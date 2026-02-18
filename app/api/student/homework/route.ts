import { NextResponse } from 'next/server'
import { getStudentSession } from '@/lib/student-auth'
import { db } from '@/db'
import { homework } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

const statusLabel: Record<string, string> = {
  active: 'Активные',
  review: 'На проверке',
  checked: 'Проверенные',
  overdue: 'Просроченные',
}

export async function GET() {
  const student = await getStudentSession()
  if (!student) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await db.query.homework.findMany({
    where: eq(homework.studentId, student.id),
    orderBy: [desc(homework.createdAt)],
  })
  const list = rows.map((h) => ({
    id: h.id,
    title: h.title,
    dueDate: h.dueDate,
    status: statusLabel[h.status] ?? h.status,
    grade: h.grade,
    teacherComment: h.teacherComment,
    instructions: h.instructions,
  }))
  return NextResponse.json(list)
}
