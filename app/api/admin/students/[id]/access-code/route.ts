import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { students } from '@/db/schema'
import { eq } from 'drizzle-orm'

function randomCode(length = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < length; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return s
}

export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id: idStr } = await params
  const id = parseInt(idStr, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const student = await db.query.students.findFirst({ where: eq(students.id, id) })
  if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  let code = randomCode()
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await db.query.students.findFirst({ where: eq(students.accessCode, code) })
    if (!existing || existing.id === id) break
    code = randomCode()
  }
  await db.update(students).set({ accessCode: code, updatedAt: new Date().toISOString() }).where(eq(students.id, id))
  return NextResponse.json({ accessCode: code })
}
