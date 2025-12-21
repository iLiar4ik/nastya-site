"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, FolderOpen, FileText, BookOpen } from "lucide-react"

const navigation = [
  { href: "/student/schedule", label: "Расписание", icon: Calendar },
  { href: "/student/homework", label: "Папка д/з", icon: FolderOpen },
  { href: "/student/materials", label: "Папка материалы", icon: FileText },
  { href: "/student/oge", label: "ОГЭ", icon: BookOpen },
]

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  if (!session || session.user.role !== "student") {
    router.push("/login")
    return null
  }

  const currentTab = navigation.find(nav => pathname.startsWith(nav.href))?.href || "/student/schedule"

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Панель ученика</h1>
        <p className="text-muted-foreground">Ваши занятия и материалы</p>
      </div>
      
      <Tabs value={currentTab} onValueChange={(value) => router.push(value)}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
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

