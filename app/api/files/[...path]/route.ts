import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params;
    const filePath = resolvedParams.path.join("/");
    const fullPath = join(process.cwd(), "uploads", filePath);

    // Security check - prevent directory traversal
    if (!fullPath.startsWith(join(process.cwd(), "uploads"))) {
      return NextResponse.json({ error: "Invalid path" }, { status: 400 });
    }

    if (!existsSync(fullPath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const file = await readFile(fullPath);
    const ext = filePath.split(".").pop()?.toLowerCase();

    const contentType =
      ext === "pdf"
        ? "application/pdf"
        : ext === "doc" || ext === "docx"
        ? "application/msword"
        : ext === "xls" || ext === "xlsx"
        ? "application/vnd.ms-excel"
        : ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : ext === "png"
        ? "image/png"
        : "application/octet-stream";

    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filePath.split("/").pop()}"`,
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return NextResponse.json(
      { error: "Ошибка при загрузке файла" },
      { status: 500 }
    );
  }
}

