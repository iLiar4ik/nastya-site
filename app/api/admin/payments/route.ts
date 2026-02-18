import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { payments } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await db.query.payments.findMany({ orderBy: [desc(payments.createdAt)] })
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const [row] = await db.insert(payments).values({
    studentId: body.studentId,
    tariff: body.tariff,
    amount: body.amount,
    status: body.status ?? 'pending',
    dueDate: body.dueDate ?? null,
    paidDate: body.paidDate ?? null,
    notes: body.notes ?? null,
  }).returning()
  return NextResponse.json(row)
}
