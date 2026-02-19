import { NextResponse } from 'next/server'
import { getStudentSession } from '@/lib/student-auth'
import { db } from '@/db'
import { studentMaterials, materials, materialsTags } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const student = await getStudentSession()
    if (!student) {
      console.log('Student materials: Unauthorized - no session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('Student materials: Fetching for student', student.id)
    const studentMaterialsList = await db.query.studentMaterials.findMany({
      where: eq(studentMaterials.studentId, student.id),
    })
    console.log('Student materials: Found', studentMaterialsList.length, 'material links')
    
    const materialIds = studentMaterialsList.map((sm) => sm.materialId)
    if (materialIds.length === 0) {
      console.log('Student materials: No materials found')
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
    console.log('Student materials: Returning', filtered.length, 'materials')
    return NextResponse.json(filtered)
  } catch (error) {
    console.error('Student materials: Error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
