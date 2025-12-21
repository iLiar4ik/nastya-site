# Быстрый старт деплоя в Dokploy

## ✅ Репозиторий готов
- **URL**: https://github.com/iLiar4ik/nastya-site
- **Статус**: Приватный репозиторий
- **Ветка**: main

## Шаги деплоя в Dokploy

### 1. Создайте проект в Dokploy
1. Откройте панель Dokploy
2. Нажмите **"New Project"**
3. Выберите тип: **"Docker Compose"**

### 2. Настройте Git репозиторий
- **Repository URL**: `https://github.com/iLiar4ik/nastya-site.git`
- **Branch**: `main`
- **Compose File**: `docker-compose.yml` (оставьте по умолчанию)
- Включите **"Auto Deploy"**

### 3. Добавьте переменные окружения

В разделе **"Environment Variables"** добавьте:

```env
# База данных
POSTGRES_USER=postgres
POSTGRES_PASSWORD=сгенерируйте_надежный_пароль
POSTGRES_DB=nastya_site

# Next.js
DATABASE_URL=postgresql://postgres:сгенерируйте_надежный_пароль@postgres:5432/nastya_site?schema=public
NEXTAUTH_URL=https://ваш-домен.com
NEXTAUTH_SECRET=сгенерируйте_через_openssl_rand_-base64_32
NODE_ENV=production
```

**Важно**: 
- Замените `сгенерируйте_надежный_пароль` на реальный пароль
- Сгенерируйте `NEXTAUTH_SECRET` командой: `openssl rand -base64 32`
- Укажите реальный домен в `NEXTAUTH_URL`

### 4. Запустите деплой
1. Нажмите **"Deploy"**
2. Дождитесь завершения сборки (5-10 минут)

### 5. Инициализируйте базу данных

После успешного деплоя выполните в терминале Dokploy:

```bash
docker exec -it nastya-site-app sh
npx prisma db push
exit
```

### 6. Проверьте работу
Откройте ваш домен в браузере и проверьте:
- ✅ Главная страница открывается
- ✅ Можно зарегистрироваться
- ✅ Можно войти в систему
- ✅ Личные кабинеты работают

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
- Подключение к базе данных

