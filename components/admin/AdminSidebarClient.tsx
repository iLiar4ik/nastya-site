'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Library, ClipboardCheck, FileText, DollarSign, LogOut, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'

const nav = [
  { href: '/admin/dashboard', label: 'Главная', icon: LayoutDashboard },
  { href: '/admin/schedule', label: 'Расписание', icon: Calendar },
  { href: '/admin/students', label: 'Ученики', icon: Users },
  { href: '/admin/materials', label: 'Материалы', icon: Library },
  { href: '/admin/homework', label: 'Домашние задания', icon: ClipboardCheck },
  { href: '/admin/tests', label: 'Тесты', icon: FileText },
  { href: '/admin/payments', label: 'Платежи', icon: DollarSign },
]

type User = { id: number; email: string; name: string }

export function AdminSidebarClient() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    let cancelled = false
    fetch('/api/admin/me')
      .then((res) => {
        if (cancelled) return
        if (res.ok) return res.json()
        if (res.status === 401 && pathname !== '/admin') {
          router.replace('/admin')
          return null
        }
        return null
      })
      .then((data) => {
        if (!cancelled && data) setUser(data)
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [router, pathname])

  if (loading) {
    return (
      <aside className="w-56 border-r bg-card p-4 flex flex-col shrink-0">
        <div className="h-5 w-32 bg-muted animate-pulse rounded mb-4" />
        <nav className="flex-1 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <div key={href} className="h-10 rounded-md bg-muted animate-pulse" />
          ))}
        </nav>
      </aside>
    )
  }

  if (!user) return null

  return (
    <aside className="w-56 border-r bg-card p-4 flex flex-col shrink-0">
      <p className="text-sm text-muted-foreground mb-4 truncate" title={user.email}>{user.email}</p>
      <nav className="flex-1 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Button>
          </Link>
        ))}
      </nav>
      <form action="/api/admin/logout" method="POST" className="mt-auto">
        <Button type="submit" variant="outline" className="w-full justify-start gap-2">
          <LogOut className="h-4 w-4" />
          Выйти
        </Button>
      </form>
    </aside>
  )
}
