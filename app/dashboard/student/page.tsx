import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, BookOpen, FileText } from "lucide-react";

export default async function StudentDashboard() {
  const session = await getServerSession();
  if (!session) return null;

  const student = await prisma.student.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!student) return null;

  // Get statistics
  const [upcomingLessons, pendingHomework, completedHomework] = await Promise.all([
    prisma.lesson.count({
      where: {
        studentId: student.id,
        status: "scheduled",
        startTime: {
          gte: new Date(),
        },
      },
    }),
    prisma.homework.count({
      where: {
        studentId: student.id,
        status: "assigned",
      },
    }),
    prisma.homework.count({
      where: {
        studentId: student.id,
        status: "graded",
      },
    }),
  ]);

  const stats = [
    {
      title: "Предстоящие уроки",
      value: upcomingLessons,
      icon: Calendar,
      description: "Запланированных занятий",
    },
    {
      title: "Домашние задания",
      value: pendingHomework,
      icon: BookOpen,
      description: "Требуют выполнения",
    },
    {
      title: "Выполнено ДЗ",
      value: completedHomework,
      icon: FileText,
      description: "Проверенных заданий",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Личный кабинет</h1>
        <p className="text-muted-foreground">
          Добро пожаловать, {session.user.name || session.user.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


