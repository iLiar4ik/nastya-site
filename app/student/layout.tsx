import { redirect } from 'next/navigation'
import { getStudentSession } from '@/lib/student-auth'
import { StudentLayoutClient } from '@/components/student/StudentLayoutClient'

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const student = await getStudentSession()
  if (!student) redirect('/auth?from=student')
  return <StudentLayoutClient student={student}>{children}</StudentLayoutClient>
}
