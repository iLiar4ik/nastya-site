import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export default async function PerformancePage() {
  const session = await getServerSession();
  if (!session || session.user.role !== "teacher") {
    redirect("/auth/login");
  }

  const students = await prisma.student.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Успеваемость</h1>
        <p className="text-muted-foreground">
          Выберите ученика для просмотра успеваемости
        </p>
      </div>

      {students.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <Card key={student.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {student.user.name || student.user.email}
                </CardTitle>
                <CardDescription>{student.user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/dashboard/teacher/performance/${student.id}`}>
                    Просмотреть успеваемость
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Нет учеников</p>
        </div>
      )}
    </div>
  );
}

