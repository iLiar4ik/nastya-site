import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getStudentSession } from '@/lib/student-auth'

export async function GET(req: NextRequest) {
  const studentIdStr = req.nextUrl.searchParams.get('studentId')
  const studentId = studentIdStr ? parseInt(studentIdStr, 10) : null
  if (studentId == null || isNaN(studentId)) {
    return NextResponse.json({ allowed: false }, { status: 400 })
  }

  const admin = await getSession()
  if (admin) {
    return NextResponse.json({ allowed: true, role: 'admin' })
  }

  const student = await getStudentSession()
  if (student && student.id === studentId) {
    return NextResponse.json({ allowed: true, role: 'student' })
  }

  return NextResponse.json({ allowed: false }, { status: 403 })
}
