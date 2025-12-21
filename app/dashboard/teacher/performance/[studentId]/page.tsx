import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { GradesTable } from "@/components/performance/GradesTable";
import { ProgressChart } from "@/components/performance/ProgressChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function StudentPerformancePage({
  params,
}: {
  params: { studentId: string };
}) {
  const session = await getServerSession();
  if (!session || session.user.role !== "teacher") {
    redirect("/auth/login");
  }

  const student = await prisma.student.findUnique({
    where: {
      id: params.studentId,
    },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!student) {
    notFound();
  }

  // For now, we'll use homework submissions as grades
  // In a real implementation, you'd have a separate Grade model
  const homeworkSubmissions = await prisma.homeworkSubmission.findMany({
    where: {
      homework: {
        studentId: student.id,
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

  const grades = homeworkSubmissions.map((submission) => ({
    id: submission.id,
    topic: submission.homework.title,
    grade: submission.grade || 0,
    maxGrade: 5, // Default max grade
    date: submission.submittedAt,
    notes: submission.feedback || undefined,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Успеваемость: {student.user.name || student.user.email}
          </h1>
          <p className="text-muted-foreground">Статистика и оценки</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/teacher/performance">Назад</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>График прогресса</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressChart grades={grades} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Таблица оценок</CardTitle>
        </CardHeader>
        <CardContent>
          <GradesTable grades={grades} />
        </CardContent>
      </Card>
    </div>
  );
}

