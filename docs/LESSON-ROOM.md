# Комната урока: LiveKit + Excalidraw

Уроки идут через **LiveKit** (видео/звук) и **Excalidraw** (доска). В **Environment** приложения nastya-site задайте:

| Переменная | Описание |
|------------|----------|
| `LIVEKIT_URL` | URL сервера LiveKit, например `wss://livekit.ваш-домен.ru` |
| `LIVEKIT_API_KEY` | API Key из настроек LiveKit |
| `LIVEKIT_API_SECRET` | API Secret из настроек LiveKit |
| `NEXT_PUBLIC_EXCALIDRAW_URL` | Публичный URL Excalidraw, например `https://excalidraw.ваш-домен.ru` |

Комната одна на ученика: имя `nastya-lesson-{id}` — для LiveKit и для комнаты в Excalidraw (`#room=...`). После **Redeploy** кнопка «Войти в урок» откроет видеозвонок (LiveKit) и доску (Excalidraw).

---

## Сервер комнат Excalidraw (синхронизация доски между устройствами)

В Dokploy нет шаблона для **сервера комнат**. Есть два пути: **готовый Docker Compose** (всё в одном, свои комнаты из коробки) или только room вручную.

### Вариант A: Готовый Docker Compose для Dokploy (рекомендуется)

**Файлы:** `deploy/excalidraw/docker-compose.yml`, `deploy/excalidraw/env.example`.

1. **Новое приложение** → тип **Docker Compose**. Источник — репозиторий nastya-site. **Путь к compose:** укажите именно **`deploy/excalidraw/docker-compose.yml`** (с `deploy` без точки в начале). Если указать `.deploy/excalidraw/...`, папки в репо нет и деплой упадёт с «no such file or directory».
2. **Environment:** `EXCALIDRAW_ROOM_WS_URL=wss://excalidraw-room.ваш-домен.ru`, `EXCALIDRAW_STORAGE_URL=https://excalidraw-api.ваш-домен.ru`.
3. **Domains:** excalidraw → 80, excalidraw-room → 80, excalidraw-storage-backend → 8080; redis не открывать.
4. **DNS (Beget):** A-записи для `excalidraw`, `excalidraw-room`, `excalidraw-api` на IP сервера. Включите SSL, Deploy.

В nastya-site задайте `NEXT_PUBLIC_EXCALIDRAW_URL=https://excalidraw.ваш-домен.ru`.

**Если WebSocket комнаты не появляется (в DevTools → Network → WS пусто):** откройте в браузере `https://excalidraw.ваш-домен.ru/env.json`. В ответе должен быть `socketServerUrl` с вашим `wss://excalidraw-room...`. Если там пусто или другой адрес — переменные не попали в контейнер. В compose уже прописаны значения по умолчанию для math-nastya.ru; после пуша и нового деплоя они подхватятся даже без Environment в Dokploy. Если используете другой домен — задайте в Dokploy переменные `EXCALIDRAW_ROOM_WS_URL` и `EXCALIDRAW_STORAGE_URL` и убедитесь, что при деплое создаётся `.env` в корне клона (или добавьте в репо файл `deploy/excalidraw/.env` с этими переменными и добавьте `.env` в `.gitignore`, чтобы не светить секреты).

### Вариант B: Только сервер комнат (уже есть фронтенд Excalidraw)

1. **Docker Image** → `excalidraw/excalidraw-room:latest`, порт **80**, домен `excalidraw-room.ваш-домен.ru`, SSL.
2. В настройках текущего Excalidraw — переменная **`SOCKET_SERVER_URL`** (или `REACT_APP_WS_SERVER_URL`): `wss://excalidraw-room.ваш-домен.ru`, Redeploy. Если переменной нет, используйте вариант A (образ [kiliandeca/excalidraw](https://hub.docker.com/r/kiliandeca/excalidraw) с настройкой через env).

---

## Доска Excalidraw: изображения и PDF

На доске можно вставлять **изображения**: Ctrl+V (Cmd+V) или меню «добавить изображение». **PDF** — конвертируйте страницы в картинки (PNG/JPEG) и вставьте на доску или добавьте файлом через меню.
