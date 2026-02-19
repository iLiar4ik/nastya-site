import { NextRequest, NextResponse } from 'next/server'
import { getStudentSession } from '@/lib/student-auth'
import { db } from '@/db'
import { messages } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  try {
    const student = await getStudentSession()
    if (!student) {
      console.log('Student messages: Unauthorized - no session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Student messages: Fetching for student', student.id)
    const msgs = await db.query.messages.findMany({
      where: eq(messages.toStudentId, student.id),
      orderBy: [desc(messages.createdAt)],
    })
    console.log('Student messages: Found', msgs.length, 'messages')
    // Normalize createdAt: SQLite may return literal "(datetime('now'))" instead of actual date
    const normalized = msgs.map((m) => {
      let createdAt = m.createdAt
      if (typeof createdAt !== 'string' || createdAt.startsWith('(datetime') || !/^\d{4}-\d{2}-\d{2}/.test(createdAt)) {
        createdAt = new Date().toISOString()
      }
      return { ...m, createdAt }
    })
    return NextResponse.json(normalized.reverse()) // Show oldest first
  } catch (error) {
    console.error('Student messages: Error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const student = await getStudentSession()
    if (!student) {
      console.log('Student messages POST: Unauthorized - no session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { content } = await req.json()
    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'content required' }, { status: 400 })
    }

    console.log('Student messages POST: Sending message from student', student.id)
    const now = new Date().toISOString()
    // Student messages have fromUserId = null
    const [row] = await db
      .insert(messages)
      .values({
        fromUserId: null,
        toStudentId: student.id,
        content: content.trim(),
        isRead: 0,
        createdAt: now,
      })
      .returning()
    console.log('Student messages POST: Message created', row?.id)
    return NextResponse.json(row ? { ...row, createdAt: now } : row)
  } catch (error) {
    console.error('Student messages POST: Error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
