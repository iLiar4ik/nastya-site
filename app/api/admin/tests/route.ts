import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { tests } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await db.query.tests.findMany({ orderBy: [desc(tests.createdAt)] })
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const [row] = await db.insert(tests).values({
    title: body.title,
    description: body.description ?? null,
    subject: body.subject,
    topic: body.topic ?? null,
    timeLimitMinutes: body.timeLimitMinutes ?? 0,
    passThreshold: body.passThreshold ?? 75,
    questions: JSON.stringify(body.questions ?? []),
  }).returning()
  return NextResponse.json(row)
}
