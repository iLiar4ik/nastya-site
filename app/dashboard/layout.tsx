import { ReactNode } from 'react';
import Link from 'next/link';
import { Home, Users, Library, BarChart, Settings, LayoutDashboard, ClipboardCheck, DollarSign, FileText, PanelRightOpen } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const teacherNavItems = [
  { href: '/dashboard', label: 'Главная', icon: LayoutDashboard },
  { href: '/dashboard/students', label: 'Ученики', icon: Users },
  { href: '/dashboard/materials', label: 'Материалы', icon: Library },
  { href: '/dashboard/homework', label: 'Управление ДЗ', icon: ClipboardCheck },
  { href: '/dashboard/tests', label: 'Тесты', icon: FileText },
  { href: '/dashboard/finances', label: 'Финансы', icon: DollarSign },
  { href: '/dashboard/analytics', label: 'Аналитика', icon: BarChart },
  { href: '/dashboard/settings', label: 'Настройки', icon: Settings },
  { href: '/admin', label: 'Админка (Payload)', icon: PanelRightOpen },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-muted/40">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Home className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">TutorApp</span>
          </Link>
          <TooltipProvider>
            {teacherNavItems.map((item) => (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </aside>
      
      {/* Main Content */}
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 w-full">
        <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
