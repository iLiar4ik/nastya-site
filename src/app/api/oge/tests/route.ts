import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createTestSchema = z.object({
  studentId: z.string(),
  testDate: z.string().or(z.date()),
  score: z.number().nullable().optional(),
  maxScore: z.number().default(100),
  subject: z.string().optional(),
  notes: z.string().optional(),
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

      const tests = await prisma.oGETest.findMany({
        where: { studentId: student.id },
        include: {
          student: { include: { user: true } },
          teacher: { include: { user: true } },
        },
        orderBy: { testDate: "desc" },
      })

      return NextResponse.json(tests)
    } else if (session.user.role === "teacher") {
      const tests = await prisma.oGETest.findMany({
        where: { teacherId: session.user.id },
        include: {
          student: { include: { user: true } },
          teacher: { include: { user: true } },
        },
        orderBy: { testDate: "desc" },
      })

      return NextResponse.json(tests)
    }

    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  } catch (error) {
    console.error("Error fetching tests:", error)
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
    const validated = createTestSchema.parse(body)

    const test = await prisma.oGETest.create({
      data: {
        teacherId: session.user.id,
        studentId: validated.studentId,
        testDate: new Date(validated.testDate),
        score: validated.score,
        maxScore: validated.maxScore,
        subject: validated.subject,
        notes: validated.notes,
      },
      include: {
        student: { include: { user: true } },
        teacher: { include: { user: true } },
      },
    })

    return NextResponse.json(test, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error creating test:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

