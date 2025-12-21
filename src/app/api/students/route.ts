import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import bcrypt from "bcryptjs"

const createStudentSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(6),
  phone: z.string().optional(),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
})

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== "teacher") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const students = await prisma.student.findMany({
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(students)
  } catch (error) {
    console.error("Error fetching students:", error)
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
    const validated = createStudentSchema.parse(body)

    const hashedPassword = await bcrypt.hash(validated.password, 10)

    const user = await prisma.user.create({
      data: {
        email: validated.email,
        name: validated.name,
        password: hashedPassword,
        role: "student",
        studentProfile: {
          create: {
            phone: validated.phone,
            parentName: validated.parentName,
            parentPhone: validated.parentPhone,
          },
        },
      },
      include: {
        studentProfile: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }
    console.error("Error creating student:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

