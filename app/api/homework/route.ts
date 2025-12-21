import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role === "teacher") {
      const homeworks = await prisma.homework.findMany({
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
          createdAt: "desc",
        },
      });
      return NextResponse.json(homeworks);
    } else {
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
    }
  } catch (error) {
    console.error("Error fetching homework:", error);
    return NextResponse.json(
      { error: "Ошибка при получении домашних заданий" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const studentId = formData.get("studentId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dueDate = formData.get("dueDate") as string;
    const file = formData.get("file") as File | null;

    let filePath: string | undefined;

    if (file) {
      const uploadDir = join(process.cwd(), "uploads", "homework");
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = `${Date.now()}-${file.name}`;
      filePath = `homework/${fileName}`;

      await writeFile(join(uploadDir, fileName), buffer);
    }

    const homework = await prisma.homework.create({
      data: {
        studentId,
        title,
        description: description || undefined,
        filePath: filePath || undefined,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        status: "assigned",
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

    return NextResponse.json(homework, { status: 201 });
  } catch (error) {
    console.error("Error creating homework:", error);
    return NextResponse.json(
      { error: "Ошибка при создании домашнего задания" },
      { status: 500 }
    );
  }
}

