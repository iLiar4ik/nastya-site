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
    // Return in desc order (newest first) - component will reverse to show oldest first
    return NextResponse.json(msgs)
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
    const [msg] = await db
      .insert(messages)
      .values({
        fromUserId: user.id,
        toStudentId: studentId,
        content: content.trim(),
        isRead: 0,
      })
      .returning()
    console.log('Admin messages POST: Message created', msg.id)
    return NextResponse.json(msg)
  } catch (error) {
    console.error('Admin messages POST: Error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
