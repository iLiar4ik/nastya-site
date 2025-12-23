import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { format, subMonths } from "date-fns";
import { ru } from "date-fns/locale";

export default async function StatisticsPage() {
  const session = await getServerSession();
  if (!session || session.user.role !== "teacher") {
    redirect("/auth/login");
  }

  // Get statistics for the last 6 months
  const sixMonthsAgo = subMonths(new Date(), 6);

  const [revenueData, lessonsData, studentsData] = await Promise.all([
    prisma.payment.findMany({
      where: {
        status: "paid",
        paidAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        amount: true,
        paidAt: true,
      },
    }),
    prisma.lesson.findMany({
      where: {
        teacherId: session.user.id,
        startTime: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        startTime: true,
        status: true,
      },
    }),
    prisma.student.findMany({
      where: {
        createdAt: {
          gte: sixMonthsAgo,
        },
      },
      select: {
        createdAt: true,
      },
    }),
  ]);

  // Process revenue data
  const revenueByMonth = revenueData.reduce((acc, payment) => {
    const month = format(new Date(payment.paidAt!), "MMM yyyy", { locale: ru });
    acc[month] = (acc[month] || 0) + payment.amount;
    return acc;
  }, {} as Record<string, number>);

  const revenueChartData = Object.entries(revenueByMonth).map(([month, amount]) => ({
    month,
    amount: Math.round(amount),
  }));

  // Process lessons data
  const lessonsByMonth = lessonsData.reduce((acc, lesson) => {
    const month = format(new Date(lesson.startTime), "MMM yyyy", { locale: ru });
    if (!acc[month]) {
      acc[month] = { scheduled: 0, completed: 0, cancelled: 0 };
    }
    acc[month][lesson.status as keyof typeof acc[string]]++;
    return acc;
  }, {} as Record<string, { scheduled: number; completed: number; cancelled: number }>);

  const lessonsChartData = Object.entries(lessonsByMonth).map(([month, data]) => ({
    month,
    ...data,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Статистика</h1>
        <p className="text-muted-foreground">
          Аналитика за последние 6 месяцев
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Доход по месяцам</CardTitle>
            <CardDescription>Общая сумма оплаченных платежей</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#8884d8" name="Доход (₽)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Уроки по месяцам</CardTitle>
            <CardDescription>Распределение уроков по статусам</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={lessonsChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="scheduled" fill="#8884d8" name="Запланировано" />
                <Bar dataKey="completed" fill="#82ca9d" name="Завершено" />
                <Bar dataKey="cancelled" fill="#ffc658" name="Отменено" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


