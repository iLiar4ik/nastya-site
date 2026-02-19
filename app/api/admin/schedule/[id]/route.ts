import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { schedule } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const body = await req.json()
  const update: Record<string, unknown> = {}
  if (body.studentId !== undefined) update.studentId = body.studentId
  if (body.subject !== undefined) update.subject = body.subject
  if (body.scheduledAt !== undefined) update.scheduledAt = body.scheduledAt
  if (body.durationMinutes !== undefined) update.durationMinutes = body.durationMinutes
  if (body.notes !== undefined) update.notes = body.notes
  if (Object.keys(update).length) await db.update(schedule).set(update).where(eq(schedule.id, id))
  const row = await db.query.schedule.findFirst({ where: eq(schedule.id, id) })
  return NextResponse.json(row)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  await db.delete(schedule).where(eq(schedule.id, id))
  return NextResponse.json({ ok: true })
}
