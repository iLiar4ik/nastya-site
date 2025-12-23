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

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session || session.user.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payments = await prisma.payment.findMany({
      include: {
        student: {
          select: {
            id: true,
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
        dueDate: "desc",
      },
    });

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Ошибка при получении платежей" },
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
    const validatedData = paymentSchema.parse(body);

    const payment = await prisma.payment.create({
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
          select: {
            id: true,
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

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Неверные данные", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: "Ошибка при создании платежа" },
      { status: 500 }
    );
  }
}


