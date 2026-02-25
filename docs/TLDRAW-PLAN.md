# План внедрения tldraw в урок

Цель: заменить Excalidraw на tldraw в комнате урока — одна доска на урок (учитель + ученик), синхронизация в реальном времени.

---

## Этап 1. Локальная доска (без синхронизации)

**Цель:** встроить tldraw в страницу урока и проверить внешний вид и базовый функционал.

1. **Зависимости**
   - Установить: `tldraw` (и при необходимости `@tldraw/assets` для self-host assets).
   - Версии: совместимы с React 19 и Next 15.

2. **Компонент доски**
   - Создать `components/lesson/TldrawBoard.tsx` (client component).
   - Рендерить `<Tldraw />` в контейнере с фиксированной высотой/шириной (как в [Installation](https://tldraw.dev/installation)).
   - Импорт: `import 'tldraw/tldraw.css'`.
   - Обернуть в `dynamic(..., { ssr: false })` или держать в `'use client'`, чтобы избежать `window is not defined` при SSR.

3. **Страница урока**
   - В `LiveKitLessonRoom.tsx` (или отдельной секции) добавить блок с `TldrawBoard`: основная область — доска, поверх справа — виджет LiveKit (как было с Excalidraw).
   - Пока без передачи `roomId` — одна локальная доска на вкладку.

4. **Результат этапа**
   - В уроке отображается tldraw, можно рисовать. Синхронизации между учителем и учеником ещё нет.

---

## Этап 2. Выбор варианта синхронизации

Коллаборация в tldraw делается через **tldraw sync**: клиент подключается по WebSocket к бэкенду, бэкенд держит комнаты (одна комната = один документ).

Варианты:

| Вариант | Плюсы | Минусы |
|--------|--------|--------|
| **A. Cloudflare template** | Официальный, один room = один Durable Object, persistence в R2/SQLite | Нужен аккаунт Cloudflare, деплой Workers + Durable Objects |
| **B. Свой сервер (Node/Bun)** | Полный контроль, деплой на свой VPS/Docker рядом с Dokploy | Нужно поднять отдельный сервис, WebSocket, хранилище (SQLite/файлы) |
| **C. Liveblocks (SaaS)** | Быстрый старт, не нужен свой бэкенд | Внешний сервис, лимиты бесплатного плана |

Рекомендация для self-host в твоём стеке (Dokploy, один сервер): **вариант B** — отдельный контейнер/сервис по [simple-server-example](https://github.com/tldraw/tldraw/tree/main/templates/simple-server-example) (Node или Bun + WebSocket + SQLite). Либо позже рассмотреть Cloudflare (вариант A), если готов использовать их инфраструктуру.

---

## Этап 3. Бэкенд sync (вариант B — свой сервер)

1. **Стек**
   - Репозиторий: [tldraw/tldraw](https://github.com/tldraw/tldraw), папка `templates/simple-server-example`.
   - Сервер: Node или Bun, WebSocket, `@tldraw/sync-core`: `TLSocketRoom` + `SQLiteSyncStorage` (или `InMemorySyncStorage` для прототипа).
   - Один глобальный экземпляр комнаты на `roomId` (как в [документации sync](https://tldraw.dev/docs/sync)).

2. **Деплой**
   - Вынести simple-server-example в отдельный репозиторий/папку или скопировать код.
   - Docker-образ: Node/Bun + установка зависимостей + запуск WebSocket-сервера (порт, например 8787).
   - В Dokploy: новое приложение (Docker Compose или Dockerfile), один сервис `tldraw-sync`, порт 8787, при необходимости nginx/traefik для wss.

3. **Переменные**
   - `TLDRAW_SYNC_URL` или `NEXT_PUBLIC_TLDRAW_SYNC_WS_URL` — например `wss://tldraw-sync.math-nastya.ru` (или путь в том же домене).

4. **Persistence**
   - Для продакшена: `SQLiteSyncStorage` + одна БД или отдельный файл на комнату (см. [sync docs](https://tldraw.dev/docs/sync)).
   - Для теста: `InMemorySyncStorage` — данные теряются при рестарте.

---

## Этап 4. Интеграция sync в nastya-site

1. **API комнаты**
   - В `app/api/lesson/livekit-token/route.ts` (или отдельный endpoint) возвращать идентификатор комнаты доски: `tldrawRoomId` = `nastya-lesson-{studentId}-{YYYYMMDD}` (одна комната на ученика на день, по аналогии с Excalidraw).

2. **Клиент**
   - Установить `@tldraw/sync` в nastya-site.
   - В `TldrawBoard.tsx` использовать `useSync` из `@tldraw/sync`:
     - `uri: \`wss://...\${tldrawRoomId}\``
     - `store` из `useSync` передавать в `<Tldraw store={store} />`.
   - Assets: по умолчанию можно использовать CDN tldraw; при желании — self-host через `getAssetUrlsByMetaUrl` и т.д.

3. **Права доступа**
   - Урок доступен только авторизованному ученику и учителю (уже есть проверка в livekit-token). Бэкенд tldraw-sync при необходимости может проверять токен/заголовки при подключении WebSocket (опционально, позже).

---

## Этап 5. UI и полировка

- Подпись в интерфейсе: «Доска (tldraw)», комната: `{tldrawRoomId}`.
- В `.env.example` добавить: `NEXT_PUBLIC_TLDRAW_SYNC_WS_URL=wss://tldraw-sync.ваш-домен.ru`.
- Сообщения об ошибках: если sync не настроен — показывать локальную доску или заглушку с текстом «Синхронизация не настроена».

---

## Порядок работ (кратко)

1. **Сейчас:** Этап 1 — поставить `tldraw`, добавить `TldrawBoard` в урок, проверить локально.
2. **Дальше:** Этап 2 — зафиксировать выбор (B: свой сервер).
3. **Затем:** Этап 3 — развернуть tldraw-sync (Docker, SQLite или in-memory).
4. **После:** Этап 4 — в API вернуть `tldrawRoomId`, в клиенте подключить `useSync` и подставить URL из env.
5. **В конце:** Этап 5 — подписи, env.example, обработка ошибок.

---

## Ссылки

- [tldraw Installation](https://tldraw.dev/installation)
- [tldraw sync](https://tldraw.dev/docs/sync)
- [TLSocketRoom](https://tldraw.dev/reference/sync-core/TLSocketRoom)
- [simple-server-example](https://github.com/tldraw/tldraw/tree/main/templates/simple-server-example)
- [tldraw-sync-cloudflare](https://github.com/tldraw/tldraw-sync-cloudflare) (альтернатива на Cloudflare)
