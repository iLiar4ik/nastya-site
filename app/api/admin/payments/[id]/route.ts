import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { payments } from '@/db/schema'
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
  if (body.tariff !== undefined) update.tariff = body.tariff
  if (body.amount !== undefined) update.amount = body.amount
  if (body.status !== undefined) update.status = body.status
  if (body.dueDate !== undefined) update.dueDate = body.dueDate
  if (body.paidDate !== undefined) update.paidDate = body.paidDate
  if (body.notes !== undefined) update.notes = body.notes
  await db.update(payments).set(update).where(eq(payments.id, id))
  const row = await db.query.payments.findFirst({ where: eq(payments.id, id) })
  return NextResponse.json(row)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  await db.delete(payments).where(eq(payments.id, id))
  return NextResponse.json({ ok: true })
}
