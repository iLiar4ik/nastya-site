import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateHomeworkSchema = z.object({
  completed: z.boolean().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "student") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const validated = updateHomeworkSchema.parse(body)

    const student = await prisma.student.findUnique({
      where: { userId: session.user.id },
    })

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 })
    }

    const homework = await prisma.homework.update({
      where: { id: params.id },
      data: validated,
    })

    return NextResponse.json(homework)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error("Error updating homework:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

