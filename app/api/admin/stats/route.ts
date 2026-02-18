import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { students, materials, homework, tests, payments } from '@/db/schema'
import { count, eq, sum } from 'drizzle-orm'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [
    studentsRes,
    materialsRes,
    homeworkRes,
    homeworkReviewRes,
    testsRes,
    paymentsPaidRes,
    paymentsPendingRes,
  ] = await Promise.all([
    db.select({ value: count() }).from(students),
    db.select({ value: count() }).from(materials),
    db.select({ value: count() }).from(homework),
    db.select({ value: count() }).from(homework).where(eq(homework.status, 'review')),
    db.select({ value: count() }).from(tests),
    db.select({ total: sum(payments.amount) }).from(payments).where(eq(payments.status, 'paid')),
    db.select({ value: count() }).from(payments).where(eq(payments.status, 'pending')),
  ])

  return NextResponse.json({
    studentsCount: studentsRes[0]?.value ?? 0,
    materialsCount: materialsRes[0]?.value ?? 0,
    homeworkCount: homeworkRes[0]?.value ?? 0,
    homeworkReviewCount: homeworkReviewRes[0]?.value ?? 0,
    testsCount: testsRes[0]?.value ?? 0,
    paymentsTotal: Number(paymentsPaidRes[0]?.total ?? 0),
    paymentsPendingCount: paymentsPendingRes[0]?.value ?? 0,
  })
}
