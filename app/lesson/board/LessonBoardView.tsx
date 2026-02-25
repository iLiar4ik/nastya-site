'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import 'tldraw/tldraw.css'

const Tldraw = dynamic(() => import('tldraw').then((m) => m.Tldraw), { ssr: false })

const tldrawLicenseKey =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY : undefined

const PERSISTENCE_KEY = 'nastya-lesson-board'

type EditorFocus = { focus: () => void }

/**
 * Полноэкранная доска для iframe. Монтируется только после client mount.
 * Кнопка «Фокус на доску» возвращает фокус в редактор, если инструменты пропали.
 */
export function LessonBoardView() {
  const [mounted, setMounted] = useState(false)
  const editorRef = useRef<EditorFocus | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-muted/20 text-sm text-muted-foreground">
        Загрузка…
      </div>
    )
  }

  return (
    <div className="tl-theme__light relative h-screen w-screen" style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <Tldraw
        licenseKey={tldrawLicenseKey}
        persistenceKey={PERSISTENCE_KEY}
        onMount={(editor) => {
          editorRef.current = editor
          editor.focus()
        }}
      />
      <button
        type="button"
        onClick={() => editorRef.current?.focus()}
        className="absolute bottom-2 left-2 z-[100] rounded border bg-white/90 px-2 py-1 text-xs shadow hover:bg-white"
        title="Вернуть фокус на доску (если пропали инструменты)"
      >
        Фокус на доску
      </button>
    </div>
  )
}
