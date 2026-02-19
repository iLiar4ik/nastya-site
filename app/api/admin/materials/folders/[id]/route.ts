import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { materialFolders } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = parseInt((await params).id, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  const body = await req.json()
  if (body.name != null) {
    await db.update(materialFolders).set({ name: String(body.name) }).where(eq(materialFolders.id, id))
  }
  if (body.parentId !== undefined) {
    await db.update(materialFolders).set({ parentId: body.parentId === null ? null : Number(body.parentId) }).where(eq(materialFolders.id, id))
  }
  const row = await db.query.materialFolders.findFirst({ where: eq(materialFolders.id, id) })
  return NextResponse.json(row)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = parseInt((await params).id, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  await db.delete(materialFolders).where(eq(materialFolders.id, id))
  return NextResponse.json({ ok: true })
}
