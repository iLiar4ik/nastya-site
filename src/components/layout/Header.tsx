"use client"

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogIn, LogOut } from "lucide-react"

export function Header() {
  const { data: session } = useSession()

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            Репетитор по математике
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/tariffs" className="text-sm hover:text-primary transition-colors">
              Тарифы
            </Link>
            <Link href="/about" className="text-sm hover:text-primary transition-colors">
              Обо мне
            </Link>
            <Link href="/lessons" className="text-sm hover:text-primary transition-colors">
              Как проходят занятия
            </Link>
            <Link href="/contacts" className="text-sm hover:text-primary transition-colors">
              Контакты
            </Link>
            {session ? (
              <div className="flex items-center gap-4">
                <Link href={session.user.role === "teacher" ? "/teacher" : "/student"}>
                  <Button variant="outline" size="sm">
                    Панель управления
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Выход
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Вход
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

