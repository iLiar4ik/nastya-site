import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getStudentSession } from '@/lib/student-auth'
import { LessonBoardView } from './LessonBoardView'

/**
 * Отдельная страница только с доской tldraw.
 * Открывается в iframe из комнаты урока — изоляция от родительского React и стилей.
 */
export default async function LessonBoardPage() {
  const admin = await getSession()
  const student = await getStudentSession()
  if (!admin && !student) redirect('/')

  return <LessonBoardView />
}
