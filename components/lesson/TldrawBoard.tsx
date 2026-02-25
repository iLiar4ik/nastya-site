'use client'

import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

const tldrawLicenseKey =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY : undefined

/**
 * Локальная доска tldraw (этап 1: без синхронизации).
 * Родитель должен задать размер контейнера (flex-1 min-h-0 и т.п.).
 * Для продакшена при необходимости задайте NEXT_PUBLIC_TLDRAW_LICENSE_KEY.
 */
export function TldrawBoard() {
  return (
    <div className="tl-theme__light h-full w-full">
      <Tldraw licenseKey={tldrawLicenseKey} />
    </div>
  )
}
