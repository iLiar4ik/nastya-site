'use client'

import { useEffect, useState } from 'react'
import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import '@livekit/components-styles'

type Props = { studentId: number; returnHref: string }

export function LiveKitLessonRoom({ studentId, returnHref }: Props) {
  const [tokenData, setTokenData] = useState<{
    token: string
    serverUrl: string
  } | null>(null)
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
        if (r.status === 403) {
          setError('Доступ к комнате только для вошедшего ученика или учителя. Ученику нужно сначала войти по коду (страница входа ученика), затем перейти по ссылке урока.')
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

  return (
    <div className="flex-1 flex flex-col min-h-0 p-2">
      <section className="flex-1 min-h-0 flex flex-col rounded-lg border bg-card overflow-hidden">
        <div className="px-2 py-1 border-b bg-muted/50 text-xs font-medium shrink-0">
          Видеозвонок (LiveKit)
        </div>
        <div className="flex-1 min-h-[280px] relative">
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
