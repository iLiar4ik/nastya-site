'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const JITSI_DOMAIN = 'meet.jit.si'
const ROOM_PREFIX = 'nastya-lesson'

function getRoomName(studentId: number) {
  return `${ROOM_PREFIX}-${studentId}`
}

// Параметры для встраивания: видео включено по умолчанию, без страницы предварительного входа
function buildJitsiUrl(roomName: string) {
  const base = `https://${JITSI_DOMAIN}/${roomName}`
  const params = [
    'config.startWithVideoMuted=false',
    'config.startWithAudioMuted=false',
    'config.prejoinConfig.enabled=false',
    'interfaceConfig.SHOW_JITSI_WATERMARK=false',
  ].join('&')
  return `${base}#${params}`
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

      {/* Один экран: видео и доска рядом, равные по размеру */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-2 p-2 min-h-0">
        <section className="min-h-[240px] lg:min-h-0 flex flex-col rounded-lg border bg-card overflow-hidden">
          <div className="px-3 py-1.5 border-b bg-muted/50 text-sm font-medium shrink-0">
            Видеозвонок (Jitsi)
          </div>
          <div className="flex-1 min-h-0 relative">
            <iframe
              title="Видеозвонок"
              src={jitsiUrl}
              className="absolute inset-0 w-full h-full border-0"
              allow="camera; microphone; fullscreen; display-capture; autoplay"
            />
          </div>
        </section>
        <section className="min-h-[240px] lg:min-h-0 flex flex-col rounded-lg border bg-card overflow-hidden">
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
      </div>
    </>
  )
}
