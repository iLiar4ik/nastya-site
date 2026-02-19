import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { homework } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id: idStr } = await params
  const studentId = parseInt(idStr, 10)
  if (isNaN(studentId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const rows = await db.query.homework.findMany({
    where: eq(homework.studentId, studentId),
    orderBy: [desc(homework.createdAt)],
  })
  return NextResponse.json(rows)
}
