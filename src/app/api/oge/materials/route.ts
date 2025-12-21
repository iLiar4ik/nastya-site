import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createMaterialSchema = z.object({
  studentId: z.string().optional(),
  title: z.string(),
  description: z.string().optional(),
  fileUrl: z.string().url(),
  isPublic: z.boolean().default(false),
})

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const studentOnly = searchParams.get("student") === "true"

    if (studentOnly && session.user.role === "student") {
      const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
      })

      if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 })
      }

      const materials = await prisma.oGEMaterial.findMany({
        where: {
          OR: [
            { studentId: student.id },
            { isPublic: true },
          ],
        },
        include: {
          teacher: { include: { user: true } },
          student: { include: { user: true } },
        },
        orderBy: { createdAt: "desc" },
      })

      return NextResponse.json(materials)
    } else if (session.user.role === "teacher") {
      const materials = await prisma.oGEMaterial.findMany({
        where: { teacherId: session.user.id },
        include: {
          teacher: { include: { user: true } },
          student: { include: { user: true } },
        },
        orderBy: { createdAt: "desc" },
      })

      return NextResponse.json(materials)
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  } catch (error) {
    console.error("Error fetching materials:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validated = createMaterialSchema.parse(body)

    const material = await prisma.oGEMaterial.create({
      data: {
        teacherId: session.user.id,
        studentId: validated.studentId || null,
        title: validated.title,
        description: validated.description,
        fileUrl: validated.fileUrl,
        isPublic: validated.isPublic,
      },
      include: {
        teacher: { include: { user: true } },
        student: { include: { user: true } },
      },
    })

    return NextResponse.json(material, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating material:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

