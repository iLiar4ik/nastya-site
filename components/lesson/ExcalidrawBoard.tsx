'use client'

import dynamic from 'next/dynamic'
import type { ComponentProps } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDataChannel } from '@livekit/components-react'
import '@excalidraw/excalidraw/index.css'

const Excalidraw = dynamic(
  async () => (await import('@excalidraw/excalidraw')).Excalidraw,
  { ssr: false, loading: () => <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">Загрузка доски…</div> }
)

const BOARD_TOPIC = 'excalidraw'

// Минимальные типы для синхронизации (совместимы с Excalidraw)
type SyncPayload =
  | { type: 'requestSync' }
  | { type: 'sync'; elements: readonly Record<string, unknown>[]; appState: Record<string, unknown> }

const SYNC_THROTTLE_MS = 250

function encodePayload(payload: SyncPayload): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(payload))
}

function decodePayload(data: Uint8Array): SyncPayload | null {
  try {
    return JSON.parse(new TextDecoder().decode(data)) as SyncPayload
  } catch {
    return null
  }
}

/** API Excalidraw для updateScene / getSceneElements / getAppState */
type ExcalidrawAPIRef = {
  getSceneElements: () => readonly Record<string, unknown>[]
  getAppState: () => Record<string, unknown>
  updateScene: (scene: { elements?: readonly Record<string, unknown>[]; appState?: Record<string, unknown> }) => void
} | null

/**
 * Доска Excalidraw с синхронизацией через LiveKit Data Channel.
 * Должна рендериться внутри LiveKitRoom.
 */
export function ExcalidrawBoard() {
  const apiRef = useRef<ExcalidrawAPIRef>(null)
  const lastSyncRef = useRef<number>(0)
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isRemoteUpdateRef = useRef(false)
  const [initialData, setInitialData] = useState<{ elements?: readonly Record<string, unknown>[]; appState?: Record<string, unknown> } | null>(null)

  const { send, message } = useDataChannel(BOARD_TOPIC)

  // Обработка входящих сообщений (без циклической зависимости sendSync <-> useDataChannel)
  useEffect(() => {
    const raw = message?.payload
    if (!raw) return
    const payload = decodePayload(raw)
    if (!payload) return
    if (payload.type === 'requestSync') {
      const api = apiRef.current
      if (api) {
        const elements = api.getSceneElements()
        const appState = api.getAppState()
        const syncPayload: SyncPayload = {
          type: 'sync',
          elements: [...elements],
          appState: {
            viewBackgroundColor: appState.viewBackgroundColor,
            scrollX: appState.scrollX,
            scrollY: appState.scrollY,
            zoom: appState.zoom,
          },
        }
        send(encodePayload(syncPayload), { reliable: true })
      }
      return
    }
    if (payload.type === 'sync' && payload.elements && payload.appState != null) {
      const api = apiRef.current
      isRemoteUpdateRef.current = true
      if (api) {
        api.updateScene({
          elements: payload.elements,
          appState: payload.appState,
        })
      } else {
        setInitialData({
          elements: payload.elements,
          appState: payload.appState,
        })
      }
      setTimeout(() => { isRemoteUpdateRef.current = false }, 0)
    }
  }, [message, send])

  const sendSync = useCallback(
    (elements: readonly Record<string, unknown>[], appState: Record<string, unknown>) => {
      const payload: SyncPayload = {
        type: 'sync',
        elements: [...elements],
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          scrollX: appState.scrollX,
          scrollY: appState.scrollY,
          zoom: appState.zoom,
        },
      }
      send(encodePayload(payload), { reliable: true })
    },
    [send]
  )

  const handleChange = useCallback(
    (elements: readonly Record<string, unknown>[], appState: Record<string, unknown>) => {
      if (isRemoteUpdateRef.current) return
      const now = Date.now()
      if (now - lastSyncRef.current < SYNC_THROTTLE_MS) {
        if (!throttleRef.current) {
          throttleRef.current = setTimeout(() => {
            throttleRef.current = null
            const api = apiRef.current
            if (api) {
              lastSyncRef.current = Date.now()
              sendSync(api.getSceneElements(), api.getAppState())
            }
          }, SYNC_THROTTLE_MS)
        }
        return
      }
      lastSyncRef.current = now
      sendSync(elements, appState)
    },
    [sendSync]
  )

  const handleApiReady = useCallback((api: unknown) => {
    apiRef.current = api as ExcalidrawAPIRef
    if (api) {
      send(encodePayload({ type: 'requestSync' }), { reliable: true })
    }
  }, [send])

  return (
    <div className="h-full w-full">
      <Excalidraw
        excalidrawAPI={handleApiReady}
        initialData={initialData as ComponentProps<typeof Excalidraw>['initialData']}
        onChange={handleChange as unknown as ComponentProps<typeof Excalidraw>['onChange']}
        isCollaborating={true}
      />
    </div>
  )
}
