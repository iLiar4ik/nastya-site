import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { schedule, scheduleTemplates } from '@/db/schema'
import { addDays, setHours, setMinutes, parse } from 'date-fns'

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const weekStartStr = body.weekStart as string // yyyy-MM-dd, понедельник
  if (!weekStartStr || !/^\d{4}-\d{2}-\d{2}$/.test(weekStartStr)) {
    return NextResponse.json({ error: 'Invalid weekStart' }, { status: 400 })
  }
  const weekStart = parse(weekStartStr, 'yyyy-MM-dd', new Date())
  const templates = await db.select().from(scheduleTemplates)
  for (const t of templates) {
    // dayOfWeek 1 = Пн, 7 = Вс
    const dayDate = addDays(weekStart, t.dayOfWeek - 1)
    const [h, m] = t.time.split(':').map(Number)
    const scheduledAt = setMinutes(setHours(dayDate, h || 0), m || 0)
    await db.insert(schedule).values({
      studentId: t.studentId ?? undefined,
      subject: t.subject,
      scheduledAt: scheduledAt.toISOString().slice(0, 19),
      durationMinutes: t.durationMinutes ?? 60,
      notes: t.notes ?? null,
    })
  }
  return NextResponse.json({ ok: true, created: templates.length })
}
