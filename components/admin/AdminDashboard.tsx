'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Library, ClipboardCheck, FileText, DollarSign, ArrowRight } from 'lucide-react'

type Stats = {
  studentsCount: number
  materialsCount: number
  homeworkCount: number
  homeworkReviewCount: number
  testsCount: number
  paymentsTotal: number
  paymentsPendingCount: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => (r.ok ? r.json() : null))
      .then(setStats)
  }, [])

  if (stats === null) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  const cards = [
    {
      title: 'Ученики',
      value: stats.studentsCount,
      description: 'в базе',
      href: '/admin/students',
      icon: Users,
    },
    {
      title: 'Материалы',
      value: stats.materialsCount,
      description: 'файлов и записей',
      href: '/admin/materials',
      icon: Library,
    },
    {
      title: 'Домашние задания',
      value: stats.homeworkCount,
      description: stats.homeworkReviewCount > 0 ? `${stats.homeworkReviewCount} на проверке` : 'всего',
      href: '/admin/homework',
      icon: ClipboardCheck,
    },
    {
      title: 'Тесты',
      value: stats.testsCount,
      description: 'в системе',
      href: '/admin/tests',
      icon: FileText,
    },
    {
      title: 'Платежи',
      value: `${Math.round(stats.paymentsTotal).toLocaleString('ru-RU')} ₽`,
      description: stats.paymentsPendingCount > 0 ? `ожидают: ${stats.paymentsPendingCount}` : 'оплачено',
      href: '/admin/payments',
      icon: DollarSign,
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="text-muted-foreground mt-1">Обзор и быстрый доступ к разделам</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((item) => {
          const Icon = item.icon
          return (
            <Card key={item.href} className="hover:bg-muted/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                <Button asChild variant="link" className="mt-2 h-auto p-0 gap-1">
                  <Link href={item.href}>
                    Перейти <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
