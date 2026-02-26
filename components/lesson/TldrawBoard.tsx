'use client'

import dynamic from 'next/dynamic'
import 'tldraw/tldraw.css'

const Tldraw = dynamic(() => import('tldraw').then((m) => m.Tldraw), { ssr: false })

const tldrawLicenseKey =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY : undefined

const PERSISTENCE_KEY = 'nastya-lesson-board'
const tldrawComponents = { Minimap: null } as const

/**
 * Доска tldraw для встраивания в страницу комнаты урока (без iframe).
 * Родитель должен задать размер (flex-1 min-h-0 и т.п.).
 */
export function TldrawBoard() {
  return (
    <div className="tl-theme__light h-full w-full overflow-visible">
      <Tldraw
        licenseKey={tldrawLicenseKey}
        persistenceKey={PERSISTENCE_KEY}
        components={tldrawComponents}
        onMount={(editor) => editor.focus()}
      />
    </div>
  )
}
