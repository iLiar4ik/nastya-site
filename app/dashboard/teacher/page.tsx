import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, CreditCard, TrendingUp } from "lucide-react";

export default async function TeacherDashboard() {
  const session = await getServerSession();
  if (!session) return null;

  // Get statistics
  const [totalStudents, totalLessons, totalPayments, totalRevenue] = await Promise.all([
    prisma.student.count(),
    prisma.lesson.count({
      where: {
        teacherId: session.user.id,
        status: "scheduled",
      },
    }),
    prisma.payment.count({
      where: {
        status: "pending",
      },
    }),
    prisma.payment.aggregate({
      where: {
        status: "paid",
      },
      _sum: {
        amount: true,
      },
    }),
  ]);

  const stats = [
    {
      title: "Всего учеников",
      value: totalStudents,
      icon: Users,
      description: "Активных учеников",
    },
    {
      title: "Запланировано уроков",
      value: totalLessons,
      icon: Calendar,
      description: "Предстоящих занятий",
    },
    {
      title: "Ожидается оплат",
      value: totalPayments,
      icon: CreditCard,
      description: "Неоплаченных платежей",
    },
    {
      title: "Доход",
      value: `${Math.round(totalRevenue._sum.amount || 0)}₽`,
      icon: TrendingUp,
      description: "Общая сумма оплат",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="text-muted-foreground">
          Добро пожаловать, {session.user.name || session.user.email}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

