# Админка (без Payload)

## Первый запуск

1. **Инициализация БД:**
   ```bash
   npm run db:init
   ```

2. **Создание администратора:**
   ```bash
   npm run db:create-admin email@example.com yourpassword "Имя"
   ```

3. Войти на `/admin` с указанным email и паролем.

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
