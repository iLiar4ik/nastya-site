"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CreditCard, BarChart3, Users, TrendingUp, BookOpen } from "lucide-react"

const navigation = [
  { href: "/teacher/schedule", label: "Расписание", icon: Calendar },
  { href: "/teacher/payment", label: "Оплата", icon: CreditCard },
  { href: "/teacher/statistics", label: "Статистика", icon: BarChart3 },
  { href: "/teacher/students", label: "Ученики", icon: Users },
  { href: "/teacher/performance", label: "Успеваемость", icon: TrendingUp },
  { href: "/teacher/oge", label: "ОГЭ", icon: BookOpen },
]

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  if (!session || session.user.role !== "teacher") {
    router.push("/login")
    return null
  }

  const currentTab = navigation.find(nav => pathname.startsWith(nav.href))?.href || "/teacher/schedule"

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Панель учителя</h1>
        <p className="text-muted-foreground">Управление учениками и занятиями</p>
      </div>
      
      <Tabs value={currentTab} onValueChange={(value) => router.push(value)}>
        <TabsList className="grid w-full grid-cols-6 mb-6">
          {navigation.map((nav) => {
            const Icon = nav.icon
            return (
              <TabsTrigger key={nav.href} value={nav.href} asChild>
                <Link href={nav.href} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:inline">{nav.label}</span>
                </Link>
              </TabsTrigger>
            )
          })}
        </TabsList>
      </Tabs>

      {children}
    </div>
  )
}

