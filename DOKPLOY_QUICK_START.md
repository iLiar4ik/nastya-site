# Быстрый старт деплоя в Dokploy

## ✅ Репозиторий готов
- **URL**: https://github.com/iLiar4ik/nastya-site
- **Ветка**: main
- **Образ**: собирается в GitHub Actions → `ghcr.io/iliar4ik/nastya-site:latest` (не на сервере!)

## Важно: сборка в GitHub Actions

На Acer Aspire One и других старых CPU сборка даёт **SIGILL** (Next.js/SWC).  
Образ собирается в GitHub Actions при каждом push в `main` и пушится в GHCR.  
Dokploy **только загружает** готовый образ, сборка на сервере не выполняется.

### Порядок деплоя
1. Push в `main` → GitHub Actions собирает образ (5–10 мин)
2. Dokploy Deploy → загружает образ из GHCR (1–2 мин)

## Шаги деплоя в Dokploy

### 1. Создайте проект в Dokploy
1. Откройте панель Dokploy
2. Нажмите **"New Project"**
3. Выберите тип: **"Docker Compose"**

### 2. Настройте Git репозиторий
- **Repository URL**: `https://github.com/iLiar4ik/nastya-site.git`
- **Branch**: `main`
- **Compose File**: `docker-compose.yml`
- Включите **"Auto Deploy"**

### 3. PostgreSQL

Создайте сервис **PostgreSQL** в том же проекте Dokploy (если ещё нет).  
Запомните имя сервиса (обычно `postgres`), пользователя и пароль.

### 4. Переменные окружения (обязательно)

В Dokploy откройте проект → **Environment Variables** и добавьте:

| Переменная | Значение | Описание |
|------------|----------|----------|
| `PAYLOAD_SECRET` | Секретный ключ 32+ символов | Для сессий Payload |
| `DATABASE_URI` | `postgresql://postgres:ПАРОЛЬ@postgres:5432/postgres` | Подключение к PostgreSQL (host = имя сервиса) |
| `PAYLOAD_UPLOAD_DIR` | `/app/data/media` | Папка для загрузок (в volume) |
| `NEXT_PUBLIC_SERVER_URL` | `https://ваш-домен.ru` | **Ваш реальный домен** |

### 5. Настройка Cloudflare Tunnel (или аналог)

- **Service**: `http://localhost:8000`
- **Public Hostname**: ваш домен

### 6. Запустите деплой
1. Убедитесь, что GitHub Actions завершил сборку (см. вкладку Actions в репозитории)
2. Нажмите **"Deploy"** в Dokploy
3. Образ будет загружен из GHCR (не собран на сервере)

### 6. После деплоя
- Сайт: `https://ваш-домен.ru`
- Админка Payload: `https://ваш-домен.ru/admin` — при первом заходе создайте администратора (email и пароль)

## Полезные команды

```bash
# Просмотр логов
docker logs -f nastya-site-app

# Перезапуск
docker-compose restart

# Проверка статуса
docker ps
```

## Поддержка

Если возникнут проблемы, проверьте:
- Логи в панели Dokploy
- Переменные окружения
