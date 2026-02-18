import { NextResponse } from 'next/server'
import { getStudentSession } from '@/lib/student-auth'

export async function GET() {
  const student = await getStudentSession()
  if (!student) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json(student)
}
