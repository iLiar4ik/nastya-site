import { NextRequest, NextResponse } from 'next/server'
import { getStudentSession } from '@/lib/student-auth'
import { db } from '@/db'
import { messages } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  const student = await getStudentSession()
  if (!student) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const msgs = await db.query.messages.findMany({
    where: eq(messages.toStudentId, student.id),
    orderBy: [desc(messages.createdAt)],
  })
  return NextResponse.json(msgs.reverse()) // Show oldest first
}

export async function POST(req: NextRequest) {
  const student = await getStudentSession()
  if (!student) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content } = await req.json()
  if (!content || !content.trim()) {
    return NextResponse.json({ error: 'content required' }, { status: 400 })
  }

  // Student messages have fromUserId = null
  const [msg] = await db
    .insert(messages)
    .values({
      fromUserId: null,
      toStudentId: student.id,
      content: content.trim(),
      isRead: 0,
    })
    .returning()
  return NextResponse.json(msg)
}
