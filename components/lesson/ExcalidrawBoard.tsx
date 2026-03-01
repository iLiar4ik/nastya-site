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
// Синхронизируем только элементы — камеру (scroll/zoom) каждый пользователь держит сам
type SyncPayload =
  | { type: 'requestSync' }
  | { type: 'sync'; elements: readonly Record<string, unknown>[] }

const SYNC_THROTTLE_MS = 120
const SYNC_IDLE_MS = 350 // Отправить финальный sync после паузы рисования
const SAVE_DEBOUNCE_MS = 1500

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

/** Объединяет элементы по id, при конфликте берётся с большей version (чтобы не терять правки ни учителя, ни ученика) */
function mergeElements(
  local: readonly Record<string, unknown>[],
  remote: readonly Record<string, unknown>[]
): Record<string, unknown>[] {
  const byId = new Map<string, Record<string, unknown>>()
  for (const el of local) {
    const id = el.id as string
    if (id) byId.set(id, { ...el })
  }
  for (const el of remote) {
    const id = el.id as string
    if (!id) continue
    const cur = byId.get(id)
    const curVer = (cur?.version as number) ?? 0
    const newVer = (el.version as number) ?? 0
    if (!cur || newVer >= curVer) byId.set(id, { ...el })
  }
  // Сохраняем порядок: сначала все из local в их порядке, затем недостающие из remote
  const order = [...local].map((e) => e.id as string).filter(Boolean)
  const seen = new Set(order)
  for (const el of remote) {
    const id = el.id as string
    if (id && !seen.has(id)) {
      order.push(id)
      seen.add(id)
    }
  }
  return order.map((id) => byId.get(id)!).filter(Boolean)
}

/** API Excalidraw для updateScene / getSceneElements / getAppState */
type ExcalidrawAPIRef = {
  getSceneElements: () => readonly Record<string, unknown>[]
  getAppState: () => Record<string, unknown>
  updateScene: (scene: { elements?: readonly Record<string, unknown>[]; appState?: Record<string, unknown> }) => void
} | null

type BoardState = { elements?: readonly Record<string, unknown>[]; appState?: Record<string, unknown> } | null

type Props = { studentId: number; isTeacher?: boolean }

/**
 * Доска Excalidraw с синхронизацией через LiveKit Data Channel и сохранением по studentId.
 * Должна рендериться внутри LiveKitRoom.
 */
const STUDENT_UI_OPTIONS = {
  canvasActions: {
    changeViewBackgroundColor: false,
    clearCanvas: false,
    loadScene: false,
    saveToActiveFile: false,
    export: false,
    toggleTheme: false,
    saveAsImage: false,
  },
  /* инструмент «изображение» разрешён ученику */
} as const

export function ExcalidrawBoard({ studentId, isTeacher = true }: Props) {
  const apiRef = useRef<ExcalidrawAPIRef>(null)
  const lastSyncRef = useRef<number>(0)
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const idleSyncRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isRemoteUpdateRef = useRef(false)
  const lastLocalChangeRef = useRef<number>(0)
  const sendRef = useRef<(p: Uint8Array, o?: unknown) => Promise<void>>(() => Promise.resolve())

  const [initialData, setInitialData] = useState<BoardState>(null)
  const [savedStateLoaded, setSavedStateLoaded] = useState(false)

  // Обработка каждого входящего сообщения через callback (не пропускаем сообщения от учителя)
  const onDataMessage = useCallback((msg: { payload?: Uint8Array }) => {
    const raw = msg?.payload
    if (!raw) return
    const payload = decodePayload(raw)
    if (!payload) return
    if (payload.type === 'requestSync') {
      const api = apiRef.current
      if (api) {
        const elements = api.getSceneElements()
        sendRef.current(encodePayload({ type: 'sync', elements: [...elements] }), { reliable: true }).catch(() => {})
      }
      return
    }
    if (payload.type === 'sync' && Array.isArray(payload.elements)) {
      const api = apiRef.current
      isRemoteUpdateRef.current = true
      if (api) {
        const current = api.getSceneElements()
        const merged = mergeElements(current, payload.elements)
        api.updateScene({ elements: merged })
      } else {
        setInitialData((prev) => ({
          elements: mergeElements(prev?.elements ?? [], payload.elements),
          appState: prev?.appState,
        }))
      }
      setTimeout(() => { isRemoteUpdateRef.current = false }, 100)
    }
  }, [])

  const { send } = useDataChannel(BOARD_TOPIC, onDataMessage)
  sendRef.current = send as (p: Uint8Array, o?: unknown) => Promise<void>

  // Очистка таймеров при размонтировании
  useEffect(() => {
    return () => {
      if (throttleRef.current) clearTimeout(throttleRef.current)
      if (idleSyncRef.current) clearTimeout(idleSyncRef.current)
    }
  }, [])

  // Загрузка сохранённой доски при монтировании (для этого ученика); только после загрузки показываем доску
  useEffect(() => {
    let cancelled = false
    fetch(`/api/lesson/board?studentId=${encodeURIComponent(studentId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { state?: BoardState } | null) => {
        if (cancelled) return
        if (data?.state) {
          const state = data.state as BoardState
          if (state && (state.elements?.length || state.appState)) {
            setInitialData(state)
          }
        }
        setSavedStateLoaded(true)
      })
      .catch(() => setSavedStateLoaded(true))
    return () => { cancelled = true }
  }, [studentId])

  const sendSync = useCallback(
    (elements: readonly Record<string, unknown>[]) => {
      send(encodePayload({ type: 'sync', elements: [...elements] }), { reliable: true }).catch(() => {})
    },
    [send]
  )

  const saveToServer = useCallback(
    (elements: readonly Record<string, unknown>[], appState: Record<string, unknown>) => {
      const state = {
        elements: [...elements],
        appState: {
          viewBackgroundColor: appState.viewBackgroundColor,
          scrollX: appState.scrollX,
          scrollY: appState.scrollY,
          zoom: appState.zoom,
        },
      }
      fetch('/api/lesson/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, state }),
      }).catch(() => {})
    },
    [studentId]
  )

  const handleChange = useCallback(
    (elements: readonly Record<string, unknown>[], appState: Record<string, unknown>) => {
      lastLocalChangeRef.current = Date.now()
      // Сохранение на сервер (дебаунс)
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => {
        saveTimeoutRef.current = null
        saveToServer(elements, appState)
      }, SAVE_DEBOUNCE_MS)

      if (isRemoteUpdateRef.current) return
      const now = Date.now()
      // Троттл: не чаще чем раз в SYNC_THROTTLE_MS
      if (now - lastSyncRef.current < SYNC_THROTTLE_MS) {
        if (!throttleRef.current) {
          throttleRef.current = setTimeout(() => {
            throttleRef.current = null
            const api = apiRef.current
            if (api) {
              lastSyncRef.current = Date.now()
              sendSync(api.getSceneElements())
            }
          }, SYNC_THROTTLE_MS)
        }
      } else {
        lastSyncRef.current = now
        sendSync(elements)
      }
      // Финальный sync после паузы рисования — чтобы у второго участника элемент появился сразу, без ожидания следующего штриха
      if (idleSyncRef.current) clearTimeout(idleSyncRef.current)
      idleSyncRef.current = setTimeout(() => {
        idleSyncRef.current = null
        const api = apiRef.current
        if (api && !isRemoteUpdateRef.current) {
          lastSyncRef.current = Date.now()
          sendSync(api.getSceneElements())
        }
      }, SYNC_IDLE_MS)
    },
    [sendSync, saveToServer]
  )

  const requestSync = useCallback(() => {
    send(encodePayload({ type: 'requestSync' }), { reliable: true }).catch(() => {})
  }, [send])

  const handleApiReady = useCallback(
    (api: unknown) => {
      apiRef.current = api as ExcalidrawAPIRef
      if (api) requestSync()
    },
    [requestSync]
  )

  // При входе с другого устройства запросить актуальное состояние у участника в комнате
  useEffect(() => {
    if (!savedStateLoaded) return
    const t = setTimeout(requestSync, 800)
    return () => clearTimeout(t)
  }, [savedStateLoaded, requestSync])

  if (!savedStateLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        Загрузка доски…
      </div>
    )
  }

  return (
    <div className={`h-full w-full excalidraw-lesson-board ${!isTeacher ? 'excalidraw-student-view' : ''}`}>
      <Excalidraw
        excalidrawAPI={handleApiReady}
        initialData={initialData as ComponentProps<typeof Excalidraw>['initialData']}
        onChange={handleChange as unknown as ComponentProps<typeof Excalidraw>['onChange']}
        isCollaborating={true}
        UIOptions={!isTeacher ? STUDENT_UI_OPTIONS : undefined}
      />
    </div>
  )
}
