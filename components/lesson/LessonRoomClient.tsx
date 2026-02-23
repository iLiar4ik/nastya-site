'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Link2, Check } from 'lucide-react'
import { LiveKitLessonRoom } from './LiveKitLessonRoom'

const ROOM_PREFIX = 'nastya-lesson'

function getRoomName(studentId: number) {
  return `${ROOM_PREFIX}-${studentId}`
}

export function LessonRoomClient({ studentId, returnHref = '/admin' }: { studentId: number; returnHref?: string }) {
  const [mounted, setMounted] = useState(false)
  const [useLiveKit, setUseLiveKit] = useState<boolean | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)
  const roomName = getRoomName(studentId)

  const roomUrl = mounted && typeof window !== 'undefined' ? `${window.location.origin}/lesson/room/${studentId}` : ''

  const copyRoomLink = () => {
    if (!roomUrl) return
    navigator.clipboard.writeText(roomUrl).then(() => {
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    })
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    fetch('/api/lesson/livekit-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    })
      .then((r) => {
        if (r.ok) {
          setUseLiveKit(true)
          return
        }
        setUseLiveKit(false)
      })
      .catch(() => setUseLiveKit(false))
  }, [mounted, studentId])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center flex-1">
        <p className="text-muted-foreground">Загрузка комнаты...</p>
      </div>
    )
  }

  const showLiveKit = useLiveKit === true
  const pending = useLiveKit === null

  return (
    <>
      <header className="flex items-center justify-between gap-2 px-4 py-2 border-b bg-card shrink-0 flex-wrap">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href={returnHref} className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Выйти из урока
            </Link>
          </Button>
          {showLiveKit && roomUrl && (
            <Button variant="outline" size="sm" onClick={copyRoomLink} className="gap-1 shrink-0">
              {linkCopied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
              {linkCopied ? 'Ссылка скопирована' : 'Скопировать ссылку'}
            </Button>
          )}
        </div>
        <span className="text-sm text-muted-foreground truncate">
          Комната: {roomName}
          {showLiveKit && ' (LiveKit + Excalidraw)'}
        </span>
      </header>
      {pending ? (
        <div className="flex items-center justify-center flex-1">
          <p className="text-muted-foreground">Проверка доступа к комнате...</p>
        </div>
      ) : showLiveKit ? (
        <>
          <p className="px-4 py-1.5 text-xs text-muted-foreground bg-muted/30 border-b shrink-0">
            Видео — LiveKit, доска — ваш Excalidraw. На доске можно добавлять изображения и (через конвертацию в картинки) PDF.
          </p>
          <LiveKitLessonRoom studentId={studentId} returnHref={returnHref} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-1 gap-3 p-6 text-center">
          <p className="text-muted-foreground">
            Комната урока недоступна: не настроены LiveKit и Excalidraw.
          </p>
          <p className="text-sm text-muted-foreground max-w-md">
            Задайте в Environment приложения переменные LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET и NEXT_PUBLIC_EXCALIDRAW_URL, затем сделайте Redeploy. Подробнее — в docs/LESSON-ROOM.md.
          </p>
        </div>
      )}
    </>
  )
}
