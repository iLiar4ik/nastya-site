'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

/** Обновляется раз в секунду — если виден и время идёт, контейнер доски не размонтирован. */
function BoardDiagnostic() {
  const [t, setT] = useState(() => new Date().toLocaleTimeString('ru-RU'))
  useEffect(() => {
    const id = setInterval(() => setT(new Date().toLocaleTimeString('ru-RU')), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="absolute bottom-2 left-2 z-[100] rounded bg-black/70 px-2 py-1 text-xs text-white">
      Доска активна · {t}
    </div>
  )
}
import { LiveKitRoom, VideoConference } from '@livekit/components-react'
import '@livekit/components-styles'

const ExcalidrawBoard = dynamic(
  () => import('./ExcalidrawBoard').then((m) => m.ExcalidrawBoard),
  { ssr: false, loading: () => <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">Загрузка доски…</div> }
)

type Props = { studentId: number; returnHref: string }

export function LiveKitLessonRoom({ studentId, returnHref }: Props) {
  const [tokenData, setTokenData] = useState<{
    token: string
    serverUrl: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)
  // Подключение только по клику — Chrome требует user gesture для AudioContext
  const [startCall, setStartCall] = useState(false)

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

  // Подключаемся к комнате сразу (для синхронизации доски по Data Channel); медиа — по клику «Включить видео»
  return (
    <LiveKitRoom
      serverUrl={tokenData.serverUrl}
      token={tokenData.token}
      connect
      audio={startCall}
      video={startCall}
      className="flex-1 flex flex-col min-h-0 p-2 relative"
    >
      {/* Доска с синхронизацией через LiveKit Data Channel */}
      <section className="flex-1 min-h-0 flex flex-col rounded-lg border bg-card overflow-hidden">
        <div className="px-3 py-1.5 border-b bg-muted/50 text-sm font-medium shrink-0">
          Доска (Excalidraw) · синхронизация в реальном времени
        </div>
        <div className="flex-1 min-h-[280px] relative min-w-0 overflow-hidden">
          <div className="absolute inset-0">
            <ExcalidrawBoard studentId={studentId} />
            <BoardDiagnostic />
          </div>
        </div>
      </section>

      {/* Видеозвонок — справа сверху поверх доски */}
      <section className="absolute top-4 right-4 w-[280px] sm:w-[320px] rounded-lg border bg-card overflow-hidden shadow-lg z-10 flex flex-col max-h-[220px] sm:max-h-[260px]">
        <div className="px-2 py-1 border-b bg-muted/50 text-xs font-medium shrink-0">
          Видеозвонок (LiveKit)
        </div>
        <div className="flex-1 min-h-[160px] relative">
          {!startCall ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-3 bg-muted/20">
              <p className="text-xs text-center text-muted-foreground">
                Включите камеру и микрофон для звонка
              </p>
              <button
                type="button"
                onClick={() => setStartCall(true)}
                className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Включить видео и звук
              </button>
            </div>
          ) : (
            <VideoConference />
          )}
        </div>
      </section>
    </LiveKitRoom>
  )
}
