import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ogeTestSchema = z.object({
  studentId: z.string(),
  testDate: z.string().transform((str) => new Date(str)),
  score: z.number().int().min(0),
  maxScore: z.number().int().positive().default(100),
  results: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "teacher") {
      const tests = await prisma.oGETest.findMany({
        include: {
          student: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          testDate: "desc",
        },
      });
      return NextResponse.json(tests);
    } else {
      const student = await prisma.student.findUnique({
        where: { userId: session.user.id },
      });

      if (!student) {
        return NextResponse.json({ error: "Student not found" }, { status: 404 });
      }

      const tests = await prisma.oGETest.findMany({
        where: { studentId: student.id },
        orderBy: {
          testDate: "desc",
        },
      });
      return NextResponse.json(tests);
    }
  } catch (error) {
    console.error("Error fetching OGE tests:", error);
    return NextResponse.json(
      { error: "Ошибка при получении тестов" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = ogeTestSchema.parse(body);

    const test = await prisma.oGETest.create({
      data: {
        studentId: validatedData.studentId,
        teacherId: session.user.id,
        testDate: validatedData.testDate,
        score: validatedData.score,
        maxScore: validatedData.maxScore,
        results: validatedData.results,
        notes: validatedData.notes,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(test, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Неверные данные", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating OGE test:", error);
    return NextResponse.json(
      { error: "Ошибка при создании теста" },
      { status: 500 }
    );
  }
}

