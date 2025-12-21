import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { userId: session.user.id },
    });

    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    const homeworks = await prisma.homework.findMany({
      where: { studentId: student.id },
      include: {
        submissions: {
          orderBy: {
            submittedAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(homeworks);
  } catch (error) {
    console.error("Error fetching student homework:", error);
    return NextResponse.json(
      { error: "Ошибка при получении домашних заданий" },
      { status: 500 }
    );
  }
}

