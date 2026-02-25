'use client'

import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

const tldrawLicenseKey =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY : undefined

/**
 * Локальная доска tldraw (этап 1: без синхронизации).
 * Родитель должен задать размер контейнера и overflow-visible, чтобы панель инструментов не обрезалась.
 */
export function TldrawBoard() {
  return (
    <div className="tl-theme__light h-full w-full overflow-visible">
      <Tldraw licenseKey={tldrawLicenseKey} />
    </div>
  )
}
