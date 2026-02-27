# Установка Excalidraw в nastya-site

## Зачем переходим с tldraw на Excalidraw

- Excalidraw — открытый проект, не требует лицензионного ключа для продакшена.
- Совместим с React 19 (начиная с версии 0.18.0).
- Официальная поддержка Next.js через dynamic import с `ssr: false`.
- Нет известных проблем с двойным монтированием (React Strict Mode), в отличие от tldraw.

---

## 1. Зависимости

### Установка

```bash
npm uninstall tldraw
npm install @excalidraw/excalidraw
```

- В проекте уже есть `react` и `react-dom` (React 19). Excalidraw 0.18+ с ними совместим.
- Пакет `@excalidraw/excalidraw` — единственная дополнительная зависимость для доски.

### Версии

- **@excalidraw/excalidraw**: использовать актуальную стабильную (например `^0.18.0` или `latest`). Для экспериментальных фич — `@excalidraw/excalidraw@next`.
- React 19 поддерживается с 0.18.0.

---

## 2. Next.js (App Router)

### SSR отключён

Excalidraw не поддерживает серверный рендеринг. Компонент нужно подключать только на клиенте.

**Вариант A — только компонент `Excalidraw` (рекомендуется для простого встраивания):**

```tsx
"use client";

import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { ssr: false }
);

export default function Board() {
  return (
    <div style={{ height: "100%", width: "100%" }}>
      <Excalidraw />
    </div>
  );
}
```

**Вариант B — если нужны утилиты/константы из пакета:**  
Сделать отдельный клиентский компонент-обёртку, который импортирует `Excalidraw` и нужные утилиты, и загружать эту обёртку через `dynamic(..., { ssr: false })`.

### Директория `"use client"`

Файлы, которые импортируют `@excalidraw/excalidraw`, должны быть клиентскими: в начале файла указать `"use client"`.

---

## 3. Стили

Обязательно подключить стили Excalidraw один раз (например в компоненте доски или в layout страницы с доской):

```ts
import "@excalidraw/excalidraw/index.css";
```

Путь может быть и таким (в зависимости от версии пакета):  
`@excalidraw/excalidraw/index.css` — в документации указан именно он.

---

## 4. Размеры контейнера

Из официальной документации: Excalidraw занимает 100% ширины и высоты **родительского контейнера**. У контейнера должны быть ненулевые размеры.

Примеры:

- Контейнер с явными размерами: `style={{ height: "500px", width: "100%" }}` или `className="h-full w-full"` при условии, что родитель задаёт высоту.
- В нашем случае: секция доски в `LiveKitLessonRoom` уже имеет `min-h-[280px]` и `flex-1`, внутренний `div` — `absolute inset-0`, так что высота и ширина заданы.

---

## 5. Шрифты (опционально)

По умолчанию Excalidraw может подгружать шрифты с CDN. Для self-host:

1. Скопировать содержимое `node_modules/@excalidraw/excalidraw/dist/prod/fonts` в каталог, отдаваемый статикой (например `public/fonts/excalidraw`).
2. Указать базовый путь до загрузки Excalidraw:

```ts
window.EXCALIDRAW_ASSET_PATH = "/";  // если шрифты в корне public
// или
window.EXCALIDRAW_ASSET_PATH = "/fonts/excalidraw/";
```

В Next.js можно задать это один раз через `next/script` с `strategy="beforeInteractive"` в layout или на странице доски.

Для начала можно не трогать — работать будет и с CDN.

---

## 6. React Strict Mode

Для tldraw в проекте был отключён `reactStrictMode` из-за двойного монтирования. Excalidraw с этим не связывают в документации. После перехода на Excalidraw можно попробовать включить обратно `reactStrictMode: true` в `next.config.mjs` и проверить, что доска не пропадает и не дублируется.

---

## 7. Где у нас используется доска

| Место | Назначение |
|-------|------------|
| `components/lesson/LiveKitLessonRoom.tsx` | Доска внутри комнаты урока (вместе с LiveKit). |
| `app/lesson/board/LessonBoardView.tsx` | Полноэкранная страница доски (и в iframe). |
| `app/lesson/board/page.tsx` | Страница маршрута только с доской. |
| `app/dev/tldraw/page.tsx` | Тестовая страница доски без авторизации (dev). |

Во всех этих местах вместо tldraw подключается Excalidraw через общий компонент доски (например `ExcalidrawBoard` и полноэкранный `LessonBoardView` на базе Excalidraw).

---

## 8. Обработка ошибок и перезагрузка

В `app/chunk-error-handler.tsx` отключён `window.location.reload()` при ChunkLoadError, чтобы не сбрасывать страницу с доской. Это остаётся актуальным и для Excalidraw: при ошибке загрузки чанка не перезагружаем страницу.

---

## 9. Итоговый чеклист установки

- [ ] Удалить пакет `tldraw`.
- [ ] Установить `@excalidraw/excalidraw`.
- [ ] Добавить компонент доски (например `ExcalidrawBoard`) с `dynamic(..., { ssr: false })` и импортом `@excalidraw/excalidraw/index.css`.
- [ ] Убедиться, что контейнер доски имеет ненулевые width/height.
- [ ] Подключить эту доску в `LiveKitLessonRoom` и в `LessonBoardView`.
- [ ] Обновить тексты интерфейса («Доска (Excalidraw)» и т.п.).
- [ ] Переименовать/адаптировать dev-страницу с доской (например с `/dev/tldraw` на `/dev/excalidraw`).
- [ ] При желании включить обратно `reactStrictMode` и проверить работу доски.
- [ ] Удалить `TldrawBoard.tsx` и ссылки на tldraw в конфиге и .env.example.

После этого Excalidraw будет единственной доской в уроке и на странице только доски, и установка будет соответствовать официальной документации и Next.js App Router.
