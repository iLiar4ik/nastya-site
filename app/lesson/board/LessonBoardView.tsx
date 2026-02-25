'use client'

import dynamic from 'next/dynamic'
import 'tldraw/tldraw.css'

const Tldraw = dynamic(
  () => import('tldraw').then((m) => m.Tldraw),
  { ssr: false }
)

const tldrawLicenseKey =
  typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY : undefined

/**
 * Полноэкранная доска для встраивания в iframe. Свой документ — нет влияния родителя.
 */
export function LessonBoardView() {
  return (
    <div className="tl-theme__light h-screen w-screen">
      <Tldraw licenseKey={tldrawLicenseKey} />
    </div>
  )
}
