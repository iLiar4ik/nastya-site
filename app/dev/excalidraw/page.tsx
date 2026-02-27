import { redirect } from 'next/navigation'
import { LessonBoardView } from '@/app/lesson/board/LessonBoardView'

/**
 * Тестовая страница: только Excalidraw, без авторизации.
 * Для проверки «работает ли доска отдельно». В production отдаём 404.
 */
export default function DevExcalidrawPage() {
  if (process.env.NODE_ENV === 'production') {
    redirect('/')
  }
  return <LessonBoardView />
}
