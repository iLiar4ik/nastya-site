'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Home, LayoutDashboard, Calendar, BookOpen, ClipboardCheck, MessageSquare, BarChart2, LogOut, Video } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

type Student = { id: number; name: string; class: string | null }

const studentNavItems = [
  { href: '/student/dashboard', label: 'Главная', icon: LayoutDashboard },
  { href: '/student/lesson', label: 'Войти в урок', icon: Video, highlight: true },
  { href: '/student/schedule', label: 'Расписание', icon: Calendar },
  { href: '/student/homework', label: 'Домашка', icon: ClipboardCheck },
  { href: '/student/materials', label: 'Материалы', icon: BookOpen },
  { href: '/student/progress', label: 'Мой прогресс', icon: BarChart2 },
  { href: '/student/chat', label: 'Чат', icon: MessageSquare },
]

export function StudentLayoutClient({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let cancelled = false
    fetch('/api/student/me')
      .then((res) => {
        if (cancelled) return
        if (res.ok) return res.json()
        if (res.status === 401 && pathname !== '/auth') {
          router.replace('/auth?from=student')
          return null
        }
        return null
      })
      .then((data) => {
        if (!cancelled && data) setStudent(data)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [router, pathname])

  async function handleLogout() {
    await fetch('/api/student/logout', { method: 'POST' })
    window.location.href = '/auth'
  }

  if (loading) {
    return (
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-muted/40">
        <div className="hidden border-r bg-background md:block">
          <div className="flex h-14 items-center border-b px-4 lg:px-6">
            <div className="h-6 w-24 bg-muted animate-pulse rounded" />
          </div>
          <div className="flex-1 p-4 space-y-2">
            {studentNavItems.map((item) => (
              <div key={item.href} className="h-10 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </div>
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="animate-pulse text-muted-foreground">Загрузка...</div>
        </main>
      </div>
    )
  }

  if (!student) {
    return <main className="min-h-screen flex items-center justify-center p-6">Перенаправление...</main>
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-muted/40">
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
              {studentNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    'highlight' in item && item.highlight
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4 space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{student.name}</p>
                {student.class && <p className="text-xs text-muted-foreground">{student.class}</p>}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Выйти
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
