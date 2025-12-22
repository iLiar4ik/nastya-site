import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const paymentSchema = z.object({
  studentId: z.string(),
  amount: z.number().positive(),
  status: z.enum(["pending", "paid", "overdue"]),
  dueDate: z.string().transform((str) => new Date(str)),
  paidAt: z.string().transform((str) => new Date(str)).nullable().optional(),
  notes: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const body = await request.json();
    const validatedData = paymentSchema.parse(body);

    const payment = await prisma.payment.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: resolvedParams.id },
      data: {
        studentId: validatedData.studentId,
        amount: validatedData.amount,
        status: validatedData.status,
        dueDate: validatedData.dueDate,
        paidAt: validatedData.paidAt || undefined,
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

    return NextResponse.json(updatedPayment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Неверные данные", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating payment:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении платежа" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const payment = await prisma.payment.findUnique({
      where: { id: resolvedParams.id },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    await prisma.payment.delete({
      where: { id: resolvedParams.id },
    });

    return NextResponse.json({ message: "Payment deleted" });
  } catch (error) {
    console.error("Error deleting payment:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении платежа" },
      { status: 500 }
    );
  }
}

