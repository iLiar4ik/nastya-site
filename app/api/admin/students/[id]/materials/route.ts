import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { studentMaterials, materials, materialsTags } from '@/db/schema'
import { eq, and } from 'drizzle-orm'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getSession()
    if (!user) {
      console.log('Admin materials GET: Unauthorized')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { id: idStr } = await params
    const studentId = parseInt(idStr, 10)
    if (isNaN(studentId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    console.log('Admin materials GET: Fetching for student', studentId)
    const studentMaterialsList = await db.query.studentMaterials.findMany({
      where: eq(studentMaterials.studentId, studentId),
    })
    console.log('Admin materials GET: Found', studentMaterialsList.length, 'material links')
    const materialIds = studentMaterialsList.map((sm) => sm.materialId)
    if (materialIds.length === 0) {
      console.log('Admin materials GET: No materials')
      return NextResponse.json([])
    }

    const materialsList = await Promise.all(
      materialIds.map(async (materialId) => {
        const material = await db.query.materials.findFirst({ where: eq(materials.id, materialId) })
        if (!material) return null
        const tags = await db.query.materialsTags.findMany({ where: eq(materialsTags.materialId, materialId) })
        return { ...material, tags: tags.map((t) => t.tag) }
      })
    )
    const filtered = materialsList.filter(Boolean)
    console.log('Admin materials GET: Returning', filtered.length, 'materials')
    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Admin materials GET: Error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id: idStr } = await params
  const studentId = parseInt(idStr, 10)
  if (isNaN(studentId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const { materialId } = await req.json()
  if (!materialId) return NextResponse.json({ error: 'materialId required' }, { status: 400 })

  const duplicate = await db.query.studentMaterials.findFirst({
    where: and(
      eq(studentMaterials.studentId, studentId),
      eq(studentMaterials.materialId, materialId)
    ),
  })
  if (duplicate) {
    return NextResponse.json({ error: 'Material already added' }, { status: 400 })
  }

  const [row] = await db
    .insert(studentMaterials)
    .values({ studentId, materialId })
    .returning()
  return NextResponse.json(row)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id: idStr } = await params
  const studentId = parseInt(idStr, 10)
  if (isNaN(studentId)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

  const { searchParams } = new URL(req.url)
  const materialId = searchParams.get('materialId')
  if (!materialId) return NextResponse.json({ error: 'materialId required' }, { status: 400 })

  await db
    .delete(studentMaterials)
    .where(and(
      eq(studentMaterials.studentId, studentId),
      eq(studentMaterials.materialId, parseInt(materialId, 10))
    ))
  return NextResponse.json({ ok: true })
}
