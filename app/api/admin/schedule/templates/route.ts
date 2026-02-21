import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { scheduleTemplates } from '@/db/schema'
import { asc } from 'drizzle-orm'

function toTemplateRow(r: Record<string, unknown>) {
  return {
    id: r.id,
    dayOfWeek: (r.dayOfWeek ?? r.day_of_week) as number,
    time: r.time as string,
    subject: r.subject as string,
    durationMinutes: r.durationMinutes ?? r.duration_minutes ?? 60,
    studentId: r.studentId ?? r.student_id ?? null,
    notes: r.notes ?? null,
  }
}

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const rows = await db.select().from(scheduleTemplates).orderBy(
      asc(scheduleTemplates.dayOfWeek),
      asc(scheduleTemplates.time),
    )
    return NextResponse.json(rows.map((r) => toTemplateRow(r as Record<string, unknown>)))
  } catch (e) {
    console.error('GET /api/admin/schedule/templates:', e)
    return NextResponse.json([])
  }
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const studentId = body.studentId == null || body.studentId === '' ? null : Number(body.studentId)
  const [row] = await db.insert(scheduleTemplates).values({
    dayOfWeek: Number(body.dayOfWeek),
    time: String(body.time).slice(0, 5),
    subject: body.subject,
    durationMinutes: body.durationMinutes ?? 60,
    studentId: studentId ?? undefined,
    notes: body.notes ?? null,
  }).returning()
  return NextResponse.json(row)
}
