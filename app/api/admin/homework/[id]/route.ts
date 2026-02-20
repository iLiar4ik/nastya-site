import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { homework } from '@/db/schema'
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
  if (body.studentId !== undefined) update.studentId = body.studentId
  if (body.materialId !== undefined) update.materialId = body.materialId
  if (body.status !== undefined) update.status = body.status
  if (body.dueDate !== undefined) update.dueDate = body.dueDate
  if (body.instructions !== undefined) update.instructions = body.instructions
  if (body.attachmentFileId !== undefined) update.attachmentFileId = body.attachmentFileId === null ? null : body.attachmentFileId
  if (body.grade !== undefined) update.grade = body.grade
  if (body.teacherComment !== undefined) update.teacherComment = body.teacherComment
  await db.update(homework).set(update).where(eq(homework.id, id))
  const row = await db.query.homework.findFirst({ where: eq(homework.id, id) })
  return NextResponse.json(row)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  await db.delete(homework).where(eq(homework.id, id))
  return NextResponse.json({ ok: true })
}
