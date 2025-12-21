import { getServerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { StudentDetails } from "@/components/students/StudentDetails";
import { notFound } from "next/navigation";

export default async function StudentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession();
  if (!session || session.user.role !== "teacher") {
    redirect("/auth/login");
  }

  const student = await prisma.student.findUnique({
    where: {
      id: params.id,
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

  return <StudentDetails student={student} />;
}

