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

    const materials = await prisma.material.findMany({
      where: {
        OR: [
          { studentId: student.id },
          { studentId: null },
        ],
        teacherId: {
          not: null,
        },
      },
      include: {
        teacher: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(materials);
  } catch (error) {
    console.error("Error fetching student materials:", error);
    return NextResponse.json(
      { error: "Ошибка при получении материалов" },
      { status: 500 }
    );
  }
}

