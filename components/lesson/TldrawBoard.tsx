'use client'

import { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import 'tldraw/tldraw.css'

const tldrawLicenseKey =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY : undefined

/**
 * Доска tldraw в отдельном React-корне + стабильный store (createTLStore один раз).
 * Исключаем пересоздание store и внутренний teardown — канвас не должен пропадать.
 */
export function TldrawBoard() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<ReturnType<typeof createRoot> | null>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    let cancelled = false
    const components = { Minimap: null } as const

    import('tldraw').then((m) => {
      if (cancelled || !containerRef.current) return
      const { createTLStore, Tldraw, defaultShapeUtils, defaultBindingUtils } = m
      const store = createTLStore({
        shapeUtils: defaultShapeUtils,
        bindingUtils: defaultBindingUtils,
      })
      return import('react-dom/client').then(({ createRoot: createRootFn }) => {
        if (cancelled || !containerRef.current) return
        const root = createRootFn(el)
        rootRef.current = root
        root.render(
          <div className="tl-theme__light h-full w-full overflow-visible">
            <Tldraw
              store={store}
              licenseKey={tldrawLicenseKey}
              components={components}
              onMount={(editor) => { editor.focus() }}
            />
          </div>
        )
      })
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
