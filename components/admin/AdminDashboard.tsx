'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  ClipboardCheck,
  DollarSign,
  Bell,
  Video,
  ArrowRight,
  FileText,
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

type DashboardData = {
  nextLesson: {
    id: number
    scheduledAt: string
    subject: string
    durationMinutes: number
    studentName: string
    studentId: number | null
    meetingLink: string | null
  } | null
  todayTasks: {
    homeworkToReview: number
    studentsToReview: number
    items: Array<{ id: number; title: string; studentName: string; studentId: number | null }>
  }
  finance: {
    unpaidCount: number
    unpaidSum: number
    incomeMonth: number
  }
  notifications: Array<{
    id: number
    type: 'message' | 'cancellation'
    text: string
    studentId: number | null
    createdAt: string | null
  }>
}

export function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
  }, [])

  if (data === null) {
    return (
      <div className="flex items-center justify-center min-h-[280px]">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    )
  }

  const { nextLesson, todayTasks, finance, notifications } = data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Главная (Dashboard / Сводка)</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Это «пульт управления». Здесь не должно быть лишних деталей, только самое важное на сегодня.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Ближайшее занятие */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Ближайшее занятие
            </CardTitle>
          </CardHeader>
          <CardContent>
            {nextLesson ? (
              <div className="space-y-2">
                <p className="font-medium">
                  {nextLesson.studentName} · {nextLesson.subject}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(nextLesson.scheduledAt), 'EEEE, d MMMM, HH:mm', { locale: ru })}
                  {nextLesson.durationMinutes !== 60 && ` · ${nextLesson.durationMinutes} мин`}
                </p>
                {nextLesson.studentId != null && (
                  <Button asChild size="sm" className="mt-2">
                    <Link href={`/lesson/room/${nextLesson.studentId}`} className="gap-1">
                      <Video className="h-4 w-4" />
                      Войти в урок (видео + доска)
                    </Link>
                  </Button>
                )}
                {nextLesson.meetingLink && (
                  <div className="flex items-center gap-2 pt-1">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <a
                      href={nextLesson.meetingLink.startsWith('http') ? nextLesson.meetingLink : `https://${nextLesson.meetingLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline truncate max-w-full"
                    >
                      Zoom / Skype (запасная ссылка)
                    </a>
                  </div>
                )}
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <Link href="/admin/schedule">Расписание</Link>
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Нет запланированных занятий</p>
            )}
          </CardContent>
        </Card>

        {/* Задачи на сегодня */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Задачи на сегодня
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1.5 text-sm">
              {todayTasks.homeworkToReview > 0 && (
                <li>
                  <Link
                    href="/admin/homework"
                    className="text-primary hover:underline font-medium"
                  >
                    Проверить ДЗ у {todayTasks.studentsToReview} {todayTasks.studentsToReview === 1 ? 'ученика' : 'учеников'}
                  </Link>
                  {todayTasks.items.length > 0 && (
                    <ul className="mt-1 ml-3 text-muted-foreground space-y-0.5">
                      {todayTasks.items.slice(0, 5).map((h) => (
                        <li key={h.id}>
                          {h.studentName}: {h.title}
                        </li>
                      ))}
                      {todayTasks.items.length > 5 && (
                        <li>…ещё {todayTasks.items.length - 5}</li>
                      )}
                    </ul>
                  )}
                </li>
              )}
              <li>
                <Link
                  href="/admin/tests"
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Подготовить тест
                </Link>
              </li>
              {todayTasks.homeworkToReview === 0 && (
                <li className="text-muted-foreground">Нет ДЗ на проверке</li>
              )}
            </ul>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link href="/admin/homework">Домашние задания</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Финансы */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Финансы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              {finance.unpaidCount > 0 ? (
                <p>
                  <span className="text-muted-foreground">Неоплаченные занятия:</span>{' '}
                  <span className="font-medium">
                    {finance.unpaidCount} на {Math.round(finance.unpaidSum).toLocaleString('ru-RU')} ₽
                  </span>
                </p>
              ) : (
                <p className="text-muted-foreground">Неоплаченных нет</p>
              )}
              <p>
                <span className="text-muted-foreground">Доход за месяц:</span>{' '}
                <span className="font-semibold">
                  {Math.round(finance.incomeMonth).toLocaleString('ru-RU')} ₽
                </span>
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="mt-2">
              <Link href="/admin/payments">Платежи</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Уведомления */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Уведомления
            </CardTitle>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {notifications.slice(0, 5).map((n) => (
                  <li key={n.id}>
                    <Link
                      href={n.studentId ? `/admin/students/${n.studentId}` : '/admin/students'}
                      className="text-primary hover:underline"
                    >
                      {n.text}
                    </Link>
                  </li>
                ))}
                {notifications.length > 5 && (
                  <li className="text-muted-foreground">…ещё {notifications.length - 5}</li>
                )}
              </ul>
            ) : (
              <p className="text-muted-foreground text-sm">Нет новых уведомлений</p>
            )}
            <Button asChild variant="outline" size="sm" className="mt-2">
              <Link href="/admin/students">Ученики</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-2 pt-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/schedule" className="gap-1">
            Расписание <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/students" className="gap-1">
            Ученики <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/homework" className="gap-1">
            ДЗ <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link href="/admin/payments" className="gap-1">
            Платежи <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
