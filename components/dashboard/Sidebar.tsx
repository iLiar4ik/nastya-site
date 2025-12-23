"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  TrendingUp,
  GraduationCap,
  CreditCard,
  BarChart3,
  BookOpen,
  FolderOpen,
  FileText,
  LogOut,
  Home,
} from "lucide-react";

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface SidebarProps {
  role: "teacher" | "student";
}

const teacherItems: SidebarItem[] = [
  { title: "Главная", href: "/dashboard/teacher", icon: Home },
  { title: "Расписание", href: "/dashboard/teacher/schedule", icon: Calendar },
  { title: "Ученики", href: "/dashboard/teacher/students", icon: Users },
  { title: "Успеваемость", href: "/dashboard/teacher/performance", icon: TrendingUp },
  { title: "ОГЭ", href: "/dashboard/teacher/oge", icon: GraduationCap },
  { title: "Оплата", href: "/dashboard/teacher/payments", icon: CreditCard },
  { title: "Статистика", href: "/dashboard/teacher/statistics", icon: BarChart3 },
];

const studentItems: SidebarItem[] = [
  { title: "Главная", href: "/dashboard/student", icon: Home },
  { title: "Расписание", href: "/dashboard/student/schedule", icon: Calendar },
  { title: "Домашние задания", href: "/dashboard/student/homework", icon: BookOpen },
  { title: "Материалы", href: "/dashboard/student/materials", icon: FolderOpen },
  { title: "ОГЭ", href: "/dashboard/student/oge", icon: GraduationCap },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = role === "teacher" ? teacherItems : studentItems;

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-muted/40">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="text-lg font-semibold">
          Личный кабинет
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Выйти
        </Button>
      </div>
    </div>
  );
}


