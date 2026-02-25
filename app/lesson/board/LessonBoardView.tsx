'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import 'tldraw/tldraw.css'

const Tldraw = dynamic(() => import('tldraw').then((m) => m.Tldraw), { ssr: false })

const tldrawLicenseKey =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY : undefined

const PERSISTENCE_KEY = 'nastya-lesson-board'

type EditorFocus = { focus: () => void }

/** Отключаем мини-карту (WebGL) — из-за неё может теряться контекст и пропадать доска */
const tldrawComponents = { Minimap: null } as const

/**
 * Полноэкранная доска. Якорь «Загружено в …» — если он пропал, размонтировалась вся страница.
 */
export function LessonBoardView() {
  const [mounted, setMounted] = useState(false)
  const [mountTime, setMountTime] = useState('')
  const editorRef = useRef<EditorFocus | null>(null)

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
    <div className="tl-theme__light relative h-screen w-screen" style={{ minHeight: '100vh', minWidth: '100vw' }}>
      <Tldraw
        licenseKey={tldrawLicenseKey}
        persistenceKey={PERSISTENCE_KEY}
        components={tldrawComponents}
        onMount={(editor) => {
          editorRef.current = editor
          editor.focus()
        }}
      />
      <div className="absolute bottom-2 left-2 z-[100] flex items-center gap-2">
        <span className="rounded border bg-white/90 px-2 py-1 text-xs text-muted-foreground shadow" title="Если эта надпись пропала — перезагрузилась вся страница доски">
          Загружено в {mountTime}
        </span>
        <button
          type="button"
          onClick={() => editorRef.current?.focus()}
          className="rounded border bg-white/90 px-2 py-1 text-xs shadow hover:bg-white"
          title="Вернуть фокус на доску"
        >
          Фокус на доску
        </button>
      </div>
    </div>
  )
}
