# Исправление проблемы с деплоем в Dokploy

## Проблема

При деплое возникла ошибка:
```
Error: Bind for 0.0.0.0:3000 failed: port is already allocated
```

Это происходит потому, что Dokploy пытается использовать `docker-compose.yml`, который пытается занять порт 3000, но он уже занят.

## Решение

Для Next.js приложений в Dokploy **НЕ нужно использовать docker-compose**. Dokploy сам управляет контейнерами.

### Вариант 1: Удалить docker-compose.yml из репозитория (рекомендуется)

Dokploy будет использовать обычный Dockerfile и настройки из `dokploy.json`.

**Шаги:**

1. Удалите или переименуйте `docker-compose.yml` (чтобы Dokploy его не использовал):
   ```bash
   git mv docker-compose.yml docker-compose.yml.local
   git commit -m "Переместил docker-compose.yml для локального использования"
   git push
   ```

2. В Dokploy:
   - Убедитесь, что используется **Dockerfile**, а не docker-compose
   - В настройках проекта выберите тип: **"Docker"** или **"Application"** (не Compose)

3. Настройте переменные окружения в Dokploy (см. ниже)

### Вариант 2: Настроить Dokploy правильно

Если Dokploy все равно пытается использовать docker-compose:

1. В настройках проекта Dokploy:
   - **Source Type:** выберите `docker` или `github` (не `docker-compose`)
   - **Build Type:** `Dockerfile` (не `docker-compose`)

2. Убедитесь, что в настройках указан правильный **Dockerfile**

## Правильные настройки в Dokploy

### Build Settings:

- **Build Command:**
  ```
  npm install && npm run db:generate && npx prisma db push --accept-data-loss && npm run build
  ```

- **Start Command:**
  ```
  npm start
  ```

- **Node Version:** `18` или `20`

- **Port:** `3000` (или оставьте пустым, Dokploy определит автоматически)

### Environment Variables:

Добавьте все переменные из `.env.example`:

```
DATABASE_URL=postgresql://nastya_user:ваш_пароль@localhost:5432/nastya_site?schema=public
NEXTAUTH_URL=https://ваш-домен.com
NEXTAUTH_SECRET=ваш_сгенерированный_ключ
NODE_ENV=production
```

**Важно:** 
- Если PostgreSQL на том же сервере: используйте `localhost`
- Если PostgreSQL в отдельном контейнере: используйте имя сервиса или IP
- Если через Cloudflare Tunnel: используйте адрес туннеля

## Исправление репозитория

Также заметил, что Dokploy клонирует `nastya-tutor` вместо `nastya-site`.

**Исправьте URL репозитория в Dokploy:**
- Должно быть: `https://github.com/iLiar4ik/nastya-site.git`
- Не: `https://github.com/iLiar4ik/nastya-tutor.git`

## После исправления

1. Сохраните настройки в Dokploy
2. Нажмите "Redeploy" или "Deploy"
3. Следите за логами - теперь должно работать

## Если порт все еще занят

Если после исправления порт все еще занят:

1. Найдите, что использует порт 3000:
   ```bash
   sudo lsof -i :3000
   # или
   sudo netstat -tulpn | grep 3000
   ```

2. Остановите процесс или измените порт в настройках Dokploy

3. Или используйте другой порт в настройках Dokploy (например, 3001)

## Docker Compose для локальной разработки

`docker-compose.yml` можно оставить для локальной разработки, но переименуйте его:

```bash
git mv docker-compose.yml docker-compose.local.yml
```

И используйте локально:
```bash
docker-compose -f docker-compose.local.yml up -d
```

