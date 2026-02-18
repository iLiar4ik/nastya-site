import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { homework } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await db.query.homework.findMany({ orderBy: [desc(homework.createdAt)] })
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const [row] = await db.insert(homework).values({
    title: body.title,
    studentId: body.studentId,
    materialId: body.materialId ?? null,
    status: body.status ?? 'active',
    dueDate: body.dueDate,
    instructions: body.instructions ?? null,
  }).returning()
  return NextResponse.json(row)
}
