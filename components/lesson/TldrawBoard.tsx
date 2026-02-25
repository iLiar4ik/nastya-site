'use client'

import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'

/**
 * Локальная доска tldraw (этап 1: без синхронизации).
 * Родитель должен задать размер контейнера (flex-1 min-h-0 и т.п.).
 */
export function TldrawBoard() {
  return (
    <div className="tl-theme__light h-full w-full">
      <Tldraw />
    </div>
  )
}
