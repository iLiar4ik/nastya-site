import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { materialFolders } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await db.query.materialFolders.findMany({ orderBy: [asc(materialFolders.name)] })
  return NextResponse.json(rows)
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const raw = await db.insert(materialFolders).values({
    parentId: body.parentId ?? null,
    name: body.name ?? 'Новая папка',
  }).returning()
  const rows = Array.isArray(raw) ? raw : (raw as { rows?: unknown[] }).rows ?? []
  const row = rows[0]
  return NextResponse.json(row)
}
