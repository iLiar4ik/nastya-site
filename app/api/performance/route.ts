import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // Get grades from homework submissions
    const submissions = await prisma.homeworkSubmission.findMany({
      where: {
        homework: {
          studentId: studentId,
        },
        grade: {
          not: null,
        },
      },
      include: {
        homework: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    });

    const grades = submissions.map((submission) => ({
      id: submission.id,
      topic: submission.homework.title,
      grade: submission.grade || 0,
      maxGrade: 5,
      date: submission.submittedAt,
      notes: submission.feedback || undefined,
    }));

    return NextResponse.json(grades);
  } catch (error) {
    console.error("Error fetching performance:", error);
    return NextResponse.json(
      { error: "Ошибка при получении успеваемости" },
      { status: 500 }
    );
  }
}

