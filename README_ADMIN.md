# Админка (без Payload)

## Первый запуск

1. **Инициализация БД:**
   ```bash
   npm run db:init
   ```
   
   Администратор создается автоматически при инициализации БД.

2. **Настройка администратора через переменные окружения (опционально):**
   
   В Dokploy добавьте в Environment Variables:
   - `ADMIN_EMAIL` - email админа (по умолчанию: `admin@example.com`)
   - `ADMIN_PASSWORD` - пароль админа (по умолчанию: `admin123`)
   - `ADMIN_NAME` - имя админа (по умолчанию: `Администратор`)
   
   Если переменные не заданы, будут использованы значения по умолчанию.

3. **Ручное создание/обновление администратора (если нужно):**
   ```bash
   npm run db:create-admin email@example.com yourpassword "Имя"
   ```

4. Войти на `/admin` с указанным email и паролем.

**Важно:** Админ создается автоматически только если его еще нет в базе. Если админ уже существует, он не будет перезаписан.

## API

- `POST /api/admin/login` — вход
- `POST /api/admin/logout` — выход
- `GET/POST /api/admin/students` — ученики
- `GET/PATCH/DELETE /api/admin/students/[id]`
- `GET/POST /api/admin/materials` — материалы
- `GET/POST /api/admin/homework` — домашние задания
- `GET/POST /api/admin/tests` — тесты
- `GET/POST /api/admin/payments` — платежи
- `POST /api/admin/upload` — загрузка файлов

## Docker

В production `prestart` автоматически вызывает `db:init`. После первого деплоя зайдите в контейнер и создайте админа:

```bash
docker exec -it nastya-site-app node scripts/create-admin.mjs admin@example.com yourpassword
```
