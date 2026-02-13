// app/student/layout.tsx
import { ReactNode } from 'react';
import Link from 'next/link';
import { Home, LayoutDashboard, Calendar, BookOpen, ClipboardCheck, MessageSquare, BarChart2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockStudentData } from '@/lib/mock-data/student-view';

const studentNavItems = [
  { href: '/student/dashboard', label: 'Главная', icon: LayoutDashboard },
  { href: '/student/schedule', label: 'Расписание', icon: Calendar },
  { href: '/student/homework', label: 'Домашка', icon: ClipboardCheck },
  { href: '/student/materials', label: 'Материалы', icon: BookOpen },
  { href: '/student/progress', label: 'Мой прогресс', icon: BarChart2 },
  { href: '/student/chat', label: 'Чат', icon: MessageSquare },
];

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-muted/40">
      {/* Sidebar */}
      <div className="hidden border-r bg-background md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Home className="h-6 w-6" />
              <span>На сайт</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              {studentNavItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4">
             <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src="/image/Ykazka.png" alt={mockStudentData.name} />
                    <AvatarFallback>{mockStudentData.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{mockStudentData.name}</p>
                    <p className="text-xs text-muted-foreground">{mockStudentData.class}</p>
                </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
