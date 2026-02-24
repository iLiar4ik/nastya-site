'use client'

import { useEffect, useState } from 'react'
import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import '@livekit/components-styles'

type Props = { studentId: number; returnHref: string }

const ROOM_PREFIX = 'nastya-lesson'

export function LiveKitLessonRoom({ studentId, returnHref }: Props) {
  const [tokenData, setTokenData] = useState<{ token: string; serverUrl: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/lesson/livekit-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    })
      .then((r) => {
        if (r.ok) return r.json()
        if (r.status === 503) {
          setError('LiveKit не настроен (LIVEKIT_* в Environment)')
          return null
        }
        setError('Ошибка доступа к комнате')
        return null
      })
      .then(setTokenData)
      .catch(() => setError('Ошибка сети'))
  }, [studentId])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-2 p-4">
        <p className="text-destructive">{error}</p>
        <p className="text-sm text-muted-foreground">Проверьте переменные LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET в Dokploy.</p>
      </div>
    )
  }

  if (!tokenData) {
    return (
      <div className="flex items-center justify-center flex-1">
        <p className="text-muted-foreground">Получение доступа к комнате...</p>
      </div>
    )
  }

  const roomName = `${ROOM_PREFIX}-${studentId}`
  const excalidrawBase = process.env.NEXT_PUBLIC_EXCALIDRAW_URL || ''
  const excalidrawUrl = excalidrawBase
    ? `${excalidrawBase.replace(/\/$/, '')}#room=${encodeURIComponent(roomName)}`
    : ''

  return (
    <div className="flex-1 flex flex-col min-h-0 p-2 relative">
      {/* Основная область — доска Excalidraw */}
      {excalidrawUrl ? (
        <section className="flex-1 min-h-0 flex flex-col rounded-lg border bg-card overflow-hidden">
          <div className="px-3 py-1.5 border-b bg-muted/50 text-sm font-medium shrink-0 flex items-center justify-between gap-2">
            <span>Доска (Excalidraw)</span>
            <span className="text-xs font-normal text-muted-foreground">комната: {roomName}</span>
          </div>
          <div className="flex-1 min-h-0 relative">
            <iframe
              title="Доска Excalidraw"
              src={excalidrawUrl}
              className="absolute inset-0 w-full h-full border-0 rounded-b-lg"
            />
          </div>
          <p className="px-3 py-1 text-[11px] text-muted-foreground border-t bg-muted/20 shrink-0">
            У учителя и ученика одна комната ({roomName}). Если доски выглядят по-разному или не синхронизируются — у обоих очистите кэш и данные сайта Excalidraw (Application → Service Workers → Unregister и Clear site data).
          </p>
        </section>
      ) : (
        <section className="flex-1 min-h-[280px] flex flex-col rounded-lg border border-dashed bg-muted/20 items-center justify-center p-4">
          <p className="text-sm text-muted-foreground text-center">
            Задайте <code className="text-xs bg-muted px-1 rounded">NEXT_PUBLIC_EXCALIDRAW_URL</code> в Environment для доски.
          </p>
        </section>
      )}

      {/* Видеозвонок — справа сверху поверх доски */}
      <section className="absolute top-4 right-4 w-[280px] sm:w-[320px] rounded-lg border bg-card overflow-hidden shadow-lg z-10 flex flex-col max-h-[220px] sm:max-h-[260px]">
        <div className="px-2 py-1 border-b bg-muted/50 text-xs font-medium shrink-0">
          Видеозвонок (LiveKit)
        </div>
        <div className="flex-1 min-h-[160px] relative">
          <LiveKitRoom
            serverUrl={tokenData.serverUrl}
            token={tokenData.token}
            video
            audio
            connect
            className="h-full"
          >
            <VideoConference />
          </LiveKitRoom>
        </div>
      </section>
    </div>
  )
}
