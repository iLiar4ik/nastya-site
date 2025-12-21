import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const studentId = searchParams.get("studentId")

    const where: any = { teacherId: session.user.id }
    if (studentId && studentId !== "all") {
      where.studentId = studentId
    }

    const performance = await prisma.performance.findMany({
      where,
      include: {
        student: { include: { user: true } },
        teacher: { include: { user: true } },
      },
      orderBy: { date: "desc" },
    })

    return NextResponse.json(performance)
  } catch (error) {
    console.error("Error fetching performance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

