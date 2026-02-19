import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { tests } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const body = await req.json()
  const update: Record<string, unknown> = {}
  if (body.title !== undefined) update.title = body.title
  if (body.description !== undefined) update.description = body.description
  if (body.subject !== undefined) update.subject = body.subject
  if (body.topic !== undefined) update.topic = body.topic
  if (body.timeLimitMinutes !== undefined) update.timeLimitMinutes = body.timeLimitMinutes
  if (body.passThreshold !== undefined) update.passThreshold = body.passThreshold
  if (body.questions !== undefined) update.questions = JSON.stringify(body.questions)
  await db.update(tests).set(update).where(eq(tests.id, id))
  const row = await db.query.tests.findFirst({ where: eq(tests.id, id) })
  return NextResponse.json(row)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  await db.delete(tests).where(eq(tests.id, id))
  return NextResponse.json({ ok: true })
}
