import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createLessonSchema = z.object({
  studentId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  startTime: z.string().or(z.date()),
  endTime: z.string().or(z.date()),
})

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const studentOnly = searchParams.get("student") === "true"

  try {
    if (studentOnly && session.user.role === "student") {
      const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
        include: { user: true },
      })

      if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 })
      }

      const lessons = await prisma.lesson.findMany({
        where: { studentId: student.id },
        include: {
          student: { include: { user: true } },
          teacher: { include: { user: true } },
        },
        orderBy: { startTime: "asc" },
      })

      return NextResponse.json(lessons)
    } else if (session.user.role === "teacher") {
      const lessons = await prisma.lesson.findMany({
        where: { teacherId: session.user.id },
        include: {
          student: { include: { user: true } },
          teacher: { include: { user: true } },
        },
        orderBy: { startTime: "asc" },
      })

      return NextResponse.json(lessons)
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  } catch (error) {
    console.error("Error fetching lessons:", error)
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
    const validated = createLessonSchema.parse(body)

    const lesson = await prisma.lesson.create({
      data: {
        teacherId: session.user.id,
        studentId: validated.studentId,
        title: validated.title,
        description: validated.description,
        startTime: new Date(validated.startTime),
        endTime: new Date(validated.endTime),
      },
      include: {
        student: { include: { user: true } },
        teacher: { include: { user: true } },
      },
    })

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating lesson:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

