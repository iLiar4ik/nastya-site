'use client'

import dynamic from 'next/dynamic'
import '@excalidraw/excalidraw/index.css'

const Excalidraw = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  { ssr: false, loading: () => <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">Загрузка доски…</div> }
)

/**
 * Доска Excalidraw для комнаты урока. Рендерится только на клиенте.
 */
export function ExcalidrawBoard() {
  return (
    <div className="h-full w-full">
      <Excalidraw />
    </div>
  )
}
