import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")

    const where: any = { userId: session.user.id }
    if (status && status !== "all") {
      where.status = status
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        student: { include: { user: true } },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(payments)
  } catch (error) {
    console.error("Error fetching payments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

