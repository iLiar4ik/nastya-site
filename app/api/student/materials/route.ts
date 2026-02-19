import { NextResponse } from 'next/server'
import { getStudentSession } from '@/lib/student-auth'
import { db } from '@/db'
import { studentMaterials, materials, materialsTags } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  const student = await getStudentSession()
  if (!student) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const studentMaterialsList = await db.query.studentMaterials.findMany({
    where: eq(studentMaterials.studentId, student.id),
  })
  const materialIds = studentMaterialsList.map((sm) => sm.materialId)
  if (materialIds.length === 0) return NextResponse.json([])

  const materialsList = await Promise.all(
    materialIds.map(async (materialId) => {
      const material = await db.query.materials.findFirst({ where: eq(materials.id, materialId) })
      if (!material) return null
      const tags = await db.query.materialsTags.findMany({ where: eq(materialsTags.materialId, materialId) })
      return { ...material, tags: tags.map((t) => t.tag) }
    })
  )
  return NextResponse.json(materialsList.filter(Boolean))
}
