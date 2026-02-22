'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ExternalLink } from 'lucide-react'

const JITSI_DOMAIN = 'meet.jit.si'
const ROOM_PREFIX = 'nastya-lesson'

function getRoomName(studentId: number) {
  return `${ROOM_PREFIX}-${studentId}`
}

function buildJitsiUrl(roomName: string) {
  return `https://${JITSI_DOMAIN}/${roomName}`
}

export function LessonRoomClient({ studentId, returnHref = '/admin' }: { studentId: number; returnHref?: string }) {
  const [mounted, setMounted] = useState(false)
  const roomName = getRoomName(studentId)
  const jitsiUrl = buildJitsiUrl(roomName)
  const excalidrawUrl = 'https://excalidraw.com'

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center flex-1">
        <p className="text-muted-foreground">Загрузка комнаты...</p>
      </div>
    )
  }

  return (
    <>
      <header className="flex items-center justify-between gap-2 px-4 py-2 border-b bg-card shrink-0">
        <Button variant="ghost" size="sm" asChild>
          <Link href={returnHref} className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Выйти из урока
          </Link>
        </Button>
        <span className="text-sm text-muted-foreground truncate">
          Комната: {roomName}
        </span>
      </header>

      {/* Основная область — белая доска на весь экран */}
      <div className="flex-1 flex flex-col min-h-0 p-2 relative">
        <section className="flex-1 min-h-0 flex flex-col rounded-lg border bg-card overflow-hidden">
          <div className="px-3 py-1.5 border-b bg-muted/50 text-sm font-medium shrink-0">
            Белая доска (Excalidraw)
          </div>
          <div className="flex-1 min-h-0 relative">
            <iframe
              title="Белая доска"
              src={excalidrawUrl}
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
        </section>

        {/* Видео — маленький экран справа сверху */}
        <div className="absolute top-4 right-4 z-10 w-[280px] sm:w-[320px] rounded-lg border-2 border-border bg-card shadow-lg overflow-hidden">
          <div className="px-2 py-1 bg-muted/70 text-xs font-medium flex items-center justify-between">
            <span>Видеозвонок</span>
            <a
              href={jitsiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-0.5"
              title="Открыть в отдельной вкладке (если видео не работает во встроенном окне)"
            >
              <ExternalLink className="h-3 w-3" />
              В новой вкладке
            </a>
          </div>
          <div className="relative w-full aspect-video bg-muted">
            <iframe
              title="Видеозвонок"
              src={jitsiUrl}
              className="absolute inset-0 w-full h-full border-0"
              allow="camera; microphone; fullscreen; display-capture"
            />
          </div>
          <p className="px-2 py-1 text-[10px] text-muted-foreground bg-muted/50">
            Нужны HTTPS и разрешение камеры/микрофона. Если пишет «нет WebRTC» — нажмите «В новой вкладке».
          </p>
        </div>
      </div>
    </>
  )
}
