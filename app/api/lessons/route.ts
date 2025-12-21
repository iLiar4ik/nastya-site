import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const lessonSchema = z.object({
  studentId: z.string(),
  startTime: z.string().transform((str) => new Date(str)),
  endTime: z.string().transform((str) => new Date(str)),
  status: z.enum(["scheduled", "completed", "cancelled"]),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lessons = await prisma.lesson.findMany({
      where: {
        teacherId: session.user.id,
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
      orderBy: {
        startTime: "asc",
      },
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Ошибка при получении уроков" },
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
    const validatedData = lessonSchema.parse(body);

    const lesson = await prisma.lesson.create({
      data: {
        teacherId: session.user.id,
        studentId: validatedData.studentId,
        startTime: validatedData.startTime,
        endTime: validatedData.endTime,
        status: validatedData.status,
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

    return NextResponse.json(lesson, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Неверные данные", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating lesson:", error);
    return NextResponse.json(
      { error: "Ошибка при создании урока" },
      { status: 500 }
    );
  }
}

