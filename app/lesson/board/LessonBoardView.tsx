'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import '@excalidraw/excalidraw/index.css'

const Excalidraw = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  { ssr: false }
)

/**
 * Полноэкранная доска Excalidraw. Якорь «Загружено в …» — если он пропал, размонтировалась вся страница.
 */
export function LessonBoardView() {
  const [mounted, setMounted] = useState(false)
  const [mountTime, setMountTime] = useState('')

  useEffect(() => {
    setMounted(true)
    setMountTime(new Date().toLocaleTimeString('ru-RU'))
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-muted/20 text-sm text-muted-foreground">
        Загрузка…
      </div>
    )
  }

  return (
    <div className="relative h-screen w-screen" style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <Excalidraw />
      <div className="absolute bottom-2 left-2 z-[100] flex items-center gap-2">
        <span
          className="rounded border bg-white/90 px-2 py-1 text-xs text-muted-foreground shadow"
          title="Если эта надпись пропала — перезагрузилась вся страница доски"
        >
          Загружено в {mountTime}
        </span>
      </div>
    </div>
  )
}
