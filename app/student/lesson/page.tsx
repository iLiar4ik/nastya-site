import { redirect } from 'next/navigation'
import { getStudentSession } from '@/lib/student-auth'

export default async function StudentLessonPage() {
  const student = await getStudentSession()
  if (!student) {
    redirect('/login')
  }
  redirect(`/lesson/room/${student.id}`)
}
