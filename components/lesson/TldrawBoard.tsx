'use client'

import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import 'tldraw/tldraw.css'

const PERSISTENCE_KEY = 'nastya-lesson-board'
const tldrawLicenseKey =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY : undefined

/**
 * Доска tldraw, смонтированная в отдельном React-корне.
 * Так ре-рендеры родителя (LiveKit и т.д.) не могут размонтировать доску.
 */
export function TldrawBoard() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<ReturnType<typeof createRoot> | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cancelled = false
    const components = { Minimap: null } as const

    Promise.all([
      import('react-dom/client'),
      import('tldraw').then((m) => m.Tldraw),
    ]).then(([{ createRoot }, Tldraw]) => {
      if (cancelled || !containerRef.current) return
      const root = createRoot(el)
      rootRef.current = root
      root.render(
        <div className="tl-theme__light h-full w-full overflow-visible">
          <Tldraw
            licenseKey={tldrawLicenseKey}
            persistenceKey={PERSISTENCE_KEY}
            components={components}
            onMount={(editor) => { editor.focus() }}
          />
        </div>
      )
    })

    return () => {
      cancelled = true
      if (rootRef.current) {
        rootRef.current.unmount()
        rootRef.current = null
      }
    }
  }, [])

  return <div ref={containerRef} className="h-full w-full" />
}
