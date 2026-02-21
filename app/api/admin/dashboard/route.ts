import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import {
  schedule,
  students,
  homework,
  payments,
  messages,
} from '@/db/schema'
import { eq, asc, gte, and, sql, inArray, or } from 'drizzle-orm'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString().slice(0, 19)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10)
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10)

  // Ближайшее занятие: первое с scheduledAt >= сейчас, не отменённое, с именем ученика
  const nextLessonRows = await db
    .select({
      id: schedule.id,
      scheduledAt: schedule.scheduledAt,
      subject: schedule.subject,
      durationMinutes: schedule.durationMinutes,
      notes: schedule.notes,
      studentId: schedule.studentId,
      studentName: students.name,
    })
    .from(schedule)
    .leftJoin(students, eq(schedule.studentId, students.id))
    .where(
      and(
        gte(schedule.scheduledAt, todayStart),
        or(eq(schedule.status, 'scheduled'), sql`${schedule.status} IS NULL`)
      )
    )
    .orderBy(asc(schedule.scheduledAt))
    .limit(1)

  const nextLesson = nextLessonRows[0]
    ? {
        id: nextLessonRows[0].id,
        scheduledAt: nextLessonRows[0].scheduledAt,
        subject: nextLessonRows[0].subject,
        durationMinutes: nextLessonRows[0].durationMinutes ?? 60,
        studentName: nextLessonRows[0].studentName ?? 'Свободное окно',
        studentId: nextLessonRows[0].studentId,
        meetingLink: nextLessonRows[0].notes?.trim() || null,
      }
    : null

  // Задачи: ДЗ на проверке (status = review) по ученикам
  const homeworkReview = await db
    .select({
      id: homework.id,
      title: homework.title,
      studentId: homework.studentId,
      studentName: students.name,
    })
    .from(homework)
    .leftJoin(students, eq(homework.studentId, students.id))
    .where(eq(homework.status, 'review'))

  const uniqueStudentsForReview = [...new Set(homeworkReview.map((h) => h.studentId).filter(Boolean))]
  const todayTasks = {
    homeworkToReview: homeworkReview.length,
    studentsToReview: uniqueStudentsForReview.length,
    items: homeworkReview.map((h) => ({
      id: h.id,
      title: h.title,
      studentName: h.studentName ?? '—',
      studentId: h.studentId,
    })),
  }

  // Финансы: неоплаченные (pending/overdue), доход за месяц (paid с paidDate в текущем месяце)
  const [unpaidRes, incomeMonthRes] = await Promise.all([
    db
      .select({
        count: sql<number>`count(*)`,
        sum: sql<number>`coalesce(sum(${payments.amount}), 0)`,
      })
      .from(payments)
      .where(inArray(payments.status, ['pending', 'overdue'])),
    db
      .select({
        sum: sql<number>`coalesce(sum(${payments.amount}), 0)`,
      })
      .from(payments)
      .where(
        and(
          eq(payments.status, 'paid'),
          sql`date(${payments.paidDate}) >= ${monthStart}`,
          sql`date(${payments.paidDate}) <= ${monthEnd}`
        )
      ),
  ])

  const unpaidCount = Number(unpaidRes[0]?.count ?? 0)
  const unpaidSum = Number(unpaidRes[0]?.sum ?? 0)
  const incomeMonth = Number(incomeMonthRes[0]?.sum ?? 0)

  // Уведомления: непрочитанные сообщения (isRead = 0) и отменённые занятия
  const [unreadMessages, cancelledLessons] = await Promise.all([
    db
      .select({
        id: messages.id,
        content: messages.content,
        createdAt: messages.createdAt,
        toStudentId: messages.toStudentId,
        studentName: students.name,
      })
      .from(messages)
      .leftJoin(students, eq(messages.toStudentId, students.id))
      .where(eq(messages.isRead, 0))
      .orderBy(asc(messages.createdAt))
      .limit(20),
    db
      .select({
        id: schedule.id,
        scheduledAt: schedule.scheduledAt,
        subject: schedule.subject,
        studentName: students.name,
        studentId: schedule.studentId,
      })
      .from(schedule)
      .leftJoin(students, eq(schedule.studentId, students.id))
      .where(
        and(
          eq(schedule.status, 'cancelled'),
          gte(schedule.scheduledAt, todayStart)
        )
      )
      .orderBy(asc(schedule.scheduledAt)),
  ])

  const notifications = [
    ...unreadMessages.map((m) => ({
      id: m.id,
      type: 'message' as const,
      text: `Новое сообщение от ${m.studentName ?? 'родителя/ученика'}`,
      studentId: m.toStudentId,
      createdAt: m.createdAt,
    })),
    ...cancelledLessons.map((l) => ({
      id: 1000000 + l.id,
      type: 'cancellation' as const,
      text: `Отменено занятие: ${l.subject} у ${l.studentName ?? 'Свободное окно'} ${format(new Date(l.scheduledAt), 'HH:mm', { locale: ru })}`,
      studentId: l.studentId,
      createdAt: l.scheduledAt,
    })),
  ].sort(
    (a, b) =>
      new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
  )

  return NextResponse.json({
    nextLesson,
    todayTasks,
    finance: {
      unpaidCount,
      unpaidSum,
      incomeMonth,
    },
    notifications,
  })
}
