import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StudentCard } from "@/components/students/StudentCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function StudentsPage() {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ученики</h1>
          <p className="text-muted-foreground">
            Список всех учеников ({students.length})
          </p>
        </div>
      </div>

      {students.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Пока нет учеников</p>
        </div>
      )}
    </div>
  );
}


