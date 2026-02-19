import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { messages } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id: idStr } = await params
  const studentId = parseInt(idStr, 10)
  if (isNaN(studentId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const msgs = await db.query.messages.findMany({
    where: eq(messages.toStudentId, studentId),
    orderBy: [desc(messages.createdAt)],
  })
  return NextResponse.json(msgs)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id: idStr } = await params
  const studentId = parseInt(idStr, 10)
  if (isNaN(studentId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const { content } = await req.json()
  if (!content || !content.trim()) {
    return NextResponse.json({ error: 'content required' }, { status: 400 })
  }

  const [msg] = await db
    .insert(messages)
    .values({
      fromUserId: user.id,
      toStudentId: studentId,
      content: content.trim(),
      isRead: 0,
    })
    .returning()
  return NextResponse.json(msg)
}
