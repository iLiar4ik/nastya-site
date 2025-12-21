import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/auth/login");
  }

  if (session.user.role !== "teacher") {
    redirect("/dashboard/student");
  }

  return (
    <div className="flex h-screen">
      <Sidebar role="teacher" />
      <main className="flex-1 overflow-y-auto">
        <div className="container py-8">{children}</div>
      </main>
    </div>
  );
}

