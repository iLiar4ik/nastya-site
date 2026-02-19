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

**Важно:** Docker Compose читает переменные из файла `.env` в папке с `docker-compose.yml`. Dokploy может не передавать свои Environment Variables в контейнер.

**Создайте файл `.env`** на сервере в папке деплоя (рядом с docker-compose.yml), например:
```bash
# Подключитесь по SSH к серверу. Путь к проекту — в Dokploy в настройках приложения
# (Deploy → Source) или в логах деплоя. Обычно: /etc/dokploy/compose/ПРОЕКТ_ID/code
cd /etc/dokploy/compose/nastyarepetitor-site-vqulth/code   # замените на ваш путь
nano .env   # или: echo 'DATABASE_URI=...' >> .env
```

Содержимое `.env` (подставьте свои данные):

```
DATABASE_URI=postgresql://USER:PASSWORD@POSTGRES_HOST:5432/DBNAME
PAYLOAD_SECRET=ваш-секрет-32-символа
NEXT_PUBLIC_SERVER_URL=https://ваш-домен.ru
PAYLOAD_UPLOAD_DIR=/app/data/media
```

`POSTGRES_HOST` — Internal Hostname PostgreSQL из настроек Dokploy (например `nastyarepetitor-postgres-7kltmw`).

После создания `.env` выполните **Redeploy** приложения.

### 4a. Настройка Cloudflare Tunnel (или аналог)

- **Service**: `http://localhost:8000`
- **Public Hostname**: ваш домен

### 5. Запустите деплой
1. Убедитесь, что GitHub Actions завершил сборку (см. вкладку Actions в репозитории)
2. Нажмите **"Deploy"** в Dokploy
3. Образ будет загружен из GHCR (не собран на сервере)

### 6. Настройка постоянного хранилища (ОБЯЗАТЕЛЬНО!)

**Важно:** Без настройки volume база данных будет теряться при каждом деплое!

1. **В настройках приложения Dokploy найдите раздел "Storage" или "Volumes"**
2. **Добавьте volume:**
   - **Mount Path**: `/app/data`
   - **Volume Name**: `nastya-site-data`
   - **Type**: `Volume`

3. **Сохраните и выполните Redeploy**

Подробная инструкция: см. `DOKPLOY_VOLUME_SETUP.md`

### 7. После деплоя
- Сайт: `https://ваш-домен.ru`
- Админка: `https://ваш-домен.ru/admin`
- Администратор создается автоматически (см. `README_ADMIN.md`)

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
