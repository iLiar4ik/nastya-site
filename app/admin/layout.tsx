import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import Link from 'next/link'
import { Users, Library, ClipboardCheck, FileText, DollarSign, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

const nav = [
  { href: '/admin/students', label: 'Ученики', icon: Users },
  { href: '/admin/materials', label: 'Материалы', icon: Library },
  { href: '/admin/homework', label: 'Домашние задания', icon: ClipboardCheck },
  { href: '/admin/tests', label: 'Тесты', icon: FileText },
  { href: '/admin/payments', label: 'Платежи', icon: DollarSign },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession()
  // Allow unauthenticated for login page - it renders children which may be login
  const isLoginPage = false // We check in page
  return (
    <div className="min-h-screen flex">
      {user && (
        <aside className="w-56 border-r bg-card p-4 flex flex-col">
          <p className="text-sm text-muted-foreground mb-4">{user.email}</p>
          <nav className="flex-1 space-y-1">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <Button variant="ghost" className="w-full justify-start gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </Button>
              </Link>
            ))}
          </nav>
          <form action="/admin/logout" method="POST">
            <Button type="submit" variant="outline" className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              Выйти
            </Button>
          </form>
        </aside>
      )}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}
