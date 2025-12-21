import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createHomeworkSchema = z.object({
  studentId: z.string(),
  title: z.string(),
  description: z.string().optional(),
  fileUrl: z.string().url().optional(),
  dueDate: z.string().or(z.date()).optional(),
})

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    if (session.user.role === "student") {
      const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
      })

      if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 })
      }

      const homework = await prisma.homework.findMany({
        where: { studentId: student.id },
        include: {
          teacher: { include: { user: true } },
          student: { include: { user: true } },
        },
        orderBy: { createdAt: "desc" },
      })

      return NextResponse.json(homework)
    } else if (session.user.role === "teacher") {
      const homework = await prisma.homework.findMany({
        where: { teacherId: session.user.id },
        include: {
          teacher: { include: { user: true } },
          student: { include: { user: true } },
        },
        orderBy: { createdAt: "desc" },
      })

      return NextResponse.json(homework)
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  } catch (error) {
    console.error("Error fetching homework:", error)
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
    const validated = createHomeworkSchema.parse(body)

    const homework = await prisma.homework.create({
      data: {
        teacherId: session.user.id,
        studentId: validated.studentId,
        title: validated.title,
        description: validated.description,
        fileUrl: validated.fileUrl,
        dueDate: validated.dueDate ? new Date(validated.dueDate) : null,
      },
      include: {
        teacher: { include: { user: true } },
        student: { include: { user: true } },
      },
    })

    return NextResponse.json(homework, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating homework:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

