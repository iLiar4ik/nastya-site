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

**Если WebSocket комнаты не появляется (в DevTools → Network → WS пусто или подключается к oss-collab.excalidraw.com):**
- В образе Excalidraw URL коллаборации часто **зашит в JS** при сборке, поэтому в `docker-compose.yml` при старте контейнера выполняется замена `oss-collab.excalidraw.com` на ваш `EXCALIDRAW_ROOM_WS_URL` в собранных `.js` файлах. После деплоя сделайте **жёсткое обновление** (Ctrl+Shift+R) или откройте доску в режиме инкогнито.
- Откройте в **режиме инкогнито** `https://excalidraw.ваш-домен.ru/env.json` — в ответе должен быть `SOCKET_SERVER_URL` с вашим `wss://excalidraw-room...`. Если конфиг верный, но wss всё равно нет: открывайте доску **с комнатой в URL**, например `https://excalidraw.ваш-домен.ru/#room=test` (без `#room=...` приложение не подключается к серверу комнат). Затем откройте DevTools → Console и посмотрите, нет ли ошибок при подключении к сокету; проверьте, что сервер комнат доступен (например, в браузере `https://excalidraw-room.ваш-домен.ru` — часто отдаёт «OK»).
- Если в env.json пусто или другой адрес — переменные не попали в контейнер. В compose прописаны значения по умолчанию для math-nastya.ru; после пуша и нового деплоя они подхватятся даже без Environment в Dokploy.

### Вариант B: Только сервер комнат (уже есть фронтенд Excalidraw)

1. **Docker Image** → `excalidraw/excalidraw-room:latest`, порт **80**, домен `excalidraw-room.ваш-домен.ru`, SSL.
2. В настройках текущего Excalidraw — переменная **`SOCKET_SERVER_URL`** (или `REACT_APP_WS_SERVER_URL`): `wss://excalidraw-room.ваш-домен.ru`, Redeploy. Если переменной нет, используйте вариант A (образ [kiliandeca/excalidraw](https://hub.docker.com/r/kiliandeca/excalidraw) с настройкой через env).

---

## Доска Excalidraw: изображения и PDF

На доске можно вставлять **изображения**: Ctrl+V (Cmd+V) или меню «добавить изображение». **PDF** — конвертируйте страницы в картинки (PNG/JPEG) и вставьте на доску или добавьте файлом через меню.
