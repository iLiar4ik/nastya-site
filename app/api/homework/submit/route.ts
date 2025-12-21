import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
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

    const formData = await request.formData();
    const homeworkId = formData.get("homeworkId") as string;
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "File is required" },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), "uploads", "homework", "submissions");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `homework/submissions/${fileName}`;

    await writeFile(join(uploadDir, fileName), buffer);

    const submission = await prisma.homeworkSubmission.create({
      data: {
        homeworkId,
        filePath,
      },
    });

    // Update homework status
    await prisma.homework.update({
      where: { id: homeworkId },
      data: { status: "submitted" },
    });

    return NextResponse.json(submission, { status: 201 });
  } catch (error) {
    console.error("Error submitting homework:", error);
    return NextResponse.json(
      { error: "Ошибка при загрузке решения" },
      { status: 500 }
    );
  }
}

