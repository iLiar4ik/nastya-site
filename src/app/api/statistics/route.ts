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
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [totalStudents, lessonsThisMonth, payments] = await Promise.all([
      prisma.student.count(),
      prisma.lesson.count({
        where: {
          teacherId: session.user.id,
          startTime: {
            gte: startOfMonth,
          },
        },
      }),
      prisma.payment.findMany({
        where: {
          userId: session.user.id,
          status: "pending",
        },
      }),
    ])

    // Calculate average attendance (simplified)
    const allLessons = await prisma.lesson.findMany({
      where: {
        teacherId: session.user.id,
      },
    })
    const completedLessons = allLessons.filter(l => l.status === "completed").length
    const avgAttendance = allLessons.length > 0
      ? Math.round((completedLessons / allLessons.length) * 100)
      : 0

    return NextResponse.json({
      totalStudents,
      lessonsThisMonth,
      avgAttendance,
      pendingPayments: payments.length,
    })
  } catch (error) {
    console.error("Error fetching statistics:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

