import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { unlink } from "fs/promises";
import { join } from "path";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const material = await prisma.material.findUnique({
      where: { id: params.id },
    });

    if (!material || material.teacherId !== session.user.id) {
      return NextResponse.json({ error: "Material not found" }, { status: 404 });
    }

    // Delete file
    try {
      const filePath = join(process.cwd(), "uploads", material.filePath);
      await unlink(filePath);
    } catch (error) {
      console.error("Error deleting file:", error);
    }

    await prisma.material.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Material deleted" });
  } catch (error) {
    console.error("Error deleting material:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении материала" },
      { status: 500 }
    );
  }
}

