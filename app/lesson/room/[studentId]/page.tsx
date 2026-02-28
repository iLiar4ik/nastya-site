import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getStudentSession } from '@/lib/student-auth'
import { LessonRoomClient } from '@/components/lesson/LessonRoomClient'

type Props = { params: Promise<{ studentId: string }> }

export default async function LessonRoomPage({ params }: Props) {
  const { studentId: studentIdStr } = await params
  const studentId = parseInt(studentIdStr, 10)
  if (isNaN(studentId)) redirect('/')

  const admin = await getSession()
  const student = await getStudentSession()

  const allowed =
    !!admin ||
    (!!student && student.id === studentId)

  if (!allowed) {
    redirect('/')
  }

  const returnHref = admin ? '/admin' : '/student/dashboard'

  return (
    <div className="fixed inset-0 flex flex-col bg-background">
      <LessonRoomClient studentId={studentId} returnHref={returnHref} isTeacher={!!admin} />
    </div>
  )
}
