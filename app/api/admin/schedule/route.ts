import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { schedule } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await db.query.schedule.findMany({ orderBy: [desc(schedule.scheduledAt)] })
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const studentId = body.studentId == null || body.studentId === '' ? null : Number(body.studentId)
  const [row] = await db.insert(schedule).values({
    studentId,
    subject: body.subject,
    scheduledAt: body.scheduledAt,
    durationMinutes: body.durationMinutes ?? 60,
    notes: body.notes ?? null,
  }).returning()
  return NextResponse.json(row)
}
