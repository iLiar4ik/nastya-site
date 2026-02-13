# Быстрый старт деплоя в Dokploy

## ✅ Репозиторий готов
- **URL**: https://github.com/iLiar4ik/nastya-site
- **Ветка**: main

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

### 3. Переменные окружения (обязательно)

В Dokploy откройте проект → **Environment Variables** и добавьте:

| Переменная | Значение | Описание |
|------------|----------|----------|
| `NODE_ENV` | `production` | Режим production |
| `PAYLOAD_SECRET` | Секретный ключ 32+ символов | Для сессий Payload (придумайте свой) |
| `DATABASE_URL` | `file:/app/data/payload.db` | Путь к БД SQLite (в volume) |
| `PAYLOAD_UPLOAD_DIR` | `/app/data/media` | Папка для загрузок (в volume) |
| `NEXT_PUBLIC_SERVER_URL` | `https://ваш-домен.ru` | **Ваш реальный домен** (например `https://nastya.ru`) |

Пример для `PAYLOAD_SECRET`: сгенерируйте случайную строку 32+ символов.

### 4. Настройка Cloudflare Tunnel (или аналог)

- **Service**: `http://localhost:8000`
- **Public Hostname**: ваш домен

### 5. Запустите деплой
1. Нажмите **"Deploy"**
2. Дождитесь сборки (5–10 минут)

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
