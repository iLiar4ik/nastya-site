import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LessonList } from "@/components/schedule/LessonList";

export default async function StudentSchedulePage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/auth/login");
  }

  const student = await prisma.student.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!student) {
    return <div>Профиль ученика не найден</div>;
  }

  const lessons = await prisma.lesson.findMany({
    where: {
      studentId: student.id,
    },
    include: {
      teacher: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      startTime: "desc",
    },
  });

  return <LessonList lessons={lessons as any} />;
}


