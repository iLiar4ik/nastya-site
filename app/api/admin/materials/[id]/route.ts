import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { materials, materialsTags, studentMaterials, homework } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const id = parseInt((await params).id, 10)
  if (isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
  await db.delete(materialsTags).where(eq(materialsTags.materialId, id))
  await db.delete(studentMaterials).where(eq(studentMaterials.materialId, id))
  await db.update(homework).set({ materialId: null }).where(eq(homework.materialId, id))
  await db.delete(materials).where(eq(materials.id, id))
  return NextResponse.json({ ok: true })
}
