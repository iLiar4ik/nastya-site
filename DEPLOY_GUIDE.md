# Пошаговая инструкция по деплою в Dokploy

## Шаг 1: Подготовка GitHub репозитория

1. Убедитесь, что весь код загружен в GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

## Шаг 2: Создание проекта в Dokploy

1. Откройте панель Dokploy (обычно `http://ваш-сервер:3000`)
2. Войдите в систему
3. Нажмите **"New Project"** или **"Создать проект"**
4. Заполните:
   - **Name**: `nastya-site`
   - **Type**: выберите **"Docker Compose"** (рекомендуется) или **"Dockerfile"**

## Шаг 3: Настройка Git репозитория

1. В настройках проекта найдите раздел **"Git"** или **"Repository"**
2. Вставьте URL вашего GitHub репозитория
3. Выберите ветку: `main` (или `master`)
4. Включите **"Auto Deploy"** (автоматический деплой при пуше)

## Шаг 4: Настройка переменных окружения

В разделе **"Environment Variables"** или **"Переменные окружения"** добавьте:

### Обязательные переменные:

```env
# База данных (если используете встроенную PostgreSQL из docker-compose)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=ваш_безопасный_пароль_здесь
POSTGRES_DB=nastya_site

# Next.js и NextAuth
DATABASE_URL=postgresql://postgres:ваш_безопасный_пароль_здесь@postgres:5432/nastya_site?schema=public
NEXTAUTH_URL=https://ваш-домен.com
NEXTAUTH_SECRET=сгенерируйте_через_openssl_rand_-base64_32
NODE_ENV=production
```

### Как сгенерировать NEXTAUTH_SECRET:

Выполните на вашем компьютере или сервере:
```bash
openssl rand -base64 32
```

Скопируйте результат и вставьте в `NEXTAUTH_SECRET`.

## Шаг 5: Первый деплой

1. Нажмите кнопку **"Deploy"** или **"Деплой"**
2. Дождитесь завершения сборки (может занять 5-10 минут)
3. Следите за логами в реальном времени

## Шаг 6: Инициализация базы данных

После успешного деплоя нужно выполнить миграции Prisma.

### Вариант 1: Через терминал Dokploy

1. В панели Dokploy найдите ваш проект
2. Откройте раздел **"Terminal"** или **"Консоль"**
3. Выполните:
```bash
docker exec -it nastya-site-app sh
npx prisma migrate deploy
# или
npx prisma db push
exit
```

### Вариант 2: Через SSH на сервере

Если у вас есть SSH доступ:
```bash
ssh ваш-сервер
docker exec -it nastya-site-app sh
npx prisma migrate deploy
exit
```

## Шаг 7: Проверка работы

1. Откройте ваш домен в браузере
2. Должна открыться главная страница лендинга
3. Попробуйте:
   - Зарегистрировать нового пользователя
   - Войти в систему
   - Проверить работу личных кабинетов

## Шаг 8: Настройка домена (если нужно)

Если вы используете Cloudflare Tunnel или другой прокси:

1. **Cloudflare Tunnel:**
```bash
# На сервере
cloudflared tunnel create nastya-site
# Настройте в Cloudflare Dashboard:
# Public Hostname: ваш-домен.com -> http://localhost:8000
cloudflared tunnel run nastya-site
```

2. **Nginx (альтернатива):**
Создайте конфиг для проксирования на `localhost:8000`

## Возможные проблемы и решения

### Проблема: "Cannot connect to database"

**Решение:**
1. Проверьте, что PostgreSQL контейнер запущен: `docker ps`
2. Убедитесь, что `DATABASE_URL` правильный
3. Проверьте логи: `docker logs nastya-site-db`

### Проблема: "Prisma migrate failed"

**Решение:**
1. Подключитесь к контейнеру: `docker exec -it nastya-site-app sh`
2. Выполните вручную: `npx prisma migrate deploy`
3. Или используйте: `npx prisma db push`

### Проблема: "File upload not working"

**Решение:**
1. Проверьте права на папку uploads в docker-compose.yml
2. Убедитесь, что volume смонтирован
3. Проверьте логи: `docker logs nastya-site-app`

### Проблема: "NextAuth error"

**Решение:**
1. Убедитесь, что `NEXTAUTH_URL` указывает на правильный домен
2. Проверьте, что `NEXTAUTH_SECRET` установлен
3. Перезапустите контейнер после изменения переменных

## Обновление приложения

После каждого пуша в `main` ветку Dokploy автоматически:
1. Получит изменения из GitHub
2. Пересоберет образ
3. Перезапустит контейнеры

Вы также можете запустить деплой вручную через кнопку "Deploy" в панели.

## Мониторинг

- **Логи**: Просматривайте в реальном времени в панели Dokploy
- **Статус**: Проверяйте статус контейнеров
- **Метрики**: Используйте встроенные метрики Dokploy

## Резервное копирование

### База данных:
```bash
docker exec nastya-site-db pg_dump -U postgres nastya_site > backup-$(date +%Y%m%d).sql
```

### Файлы:
```bash
docker exec nastya-site-app tar -czf /tmp/uploads-backup.tar.gz /app/uploads
docker cp nastya-site-app:/tmp/uploads-backup.tar.gz ./uploads-backup.tar.gz
```

## Полезные команды

```bash
# Просмотр логов приложения
docker logs -f nastya-site-app

# Просмотр логов базы данных
docker logs -f nastya-site-db

# Перезапуск контейнеров
docker-compose restart

# Остановка
docker-compose down

# Запуск
docker-compose up -d
```

