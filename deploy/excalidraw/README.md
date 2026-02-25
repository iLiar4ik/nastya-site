# Excalidraw (официальный образ + room + storage)

- **excalidraw** — фронтенд (образ `excalidraw/excalidraw`, build-args для WS и storage).
- **excalidraw-room-backend** + **excalidraw-room** (nginx-прокси) — сервер комнат (синхронизация доски).
- **excalidraw-storage-backend** + **redis** — сохранение сцен.

## Environment в Dokploy

```bash
EXCALIDRAW_ROOM_WS_URL=wss://excalidraw-room.math-nastya.ru
EXCALIDRAW_STORAGE_URL=https://excalidraw-api.math-nastya.ru
```

Либо скопируйте `env.example` в `.env` рядом с `docker-compose.yml`.

## Деплой

```bash
docker compose build excalidraw   # 3–5 минут первый раз
docker compose up -d
docker compose logs -f excalidraw-room-backend   # при необходимости проверить CORS
```

В Dokploy: приложение Docker Compose, путь к compose — `deploy/excalidraw/docker-compose.yml`, домены и Traefik-метки уже в compose (excalidraw.math-nastya.ru, excalidraw-room.math-nastya.ru, excalidraw-api.math-nastya.ru).
