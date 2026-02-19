import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { messages } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSession()
    if (!user) {
      console.log('Admin messages GET: Unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id: idStr } = await params
    const studentId = parseInt(idStr, 10)
    if (isNaN(studentId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    console.log('Admin messages GET: Fetching for student', studentId)
    const msgs = await db.query.messages.findMany({
      where: eq(messages.toStudentId, studentId),
      orderBy: [desc(messages.createdAt)],
    })
    console.log('Admin messages GET: Found', msgs.length, 'messages')
    // Normalize createdAt: SQLite may return literal "(datetime('now'))" instead of actual date
    const normalized = msgs.map((m) => {
      let createdAt = m.createdAt
      if (typeof createdAt !== 'string' || createdAt.startsWith('(datetime') || !/^\d{4}-\d{2}-\d{2}/.test(createdAt)) {
        createdAt = new Date().toISOString()
      }
      return { ...m, createdAt }
    })
    return NextResponse.json(normalized)
  } catch (error) {
    console.error('Admin messages GET: Error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSession()
    if (!user) {
      console.log('Admin messages POST: Unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id: idStr } = await params
    const studentId = parseInt(idStr, 10)
    if (isNaN(studentId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    const { content } = await req.json()
    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'content required' }, { status: 400 })
    }

    console.log('Admin messages POST: Sending message from user', user.id, 'to student', studentId)
    const now = new Date().toISOString()
    const [row] = await db
      .insert(messages)
      .values({
        fromUserId: user.id,
        toStudentId: studentId,
        content: content.trim(),
        isRead: 0,
        createdAt: now,
      })
      .returning()
    console.log('Admin messages POST: Message created', row?.id)
    return NextResponse.json(row ? { ...row, createdAt: now } : row)
  } catch (error) {
    console.error('Admin messages POST: Error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
