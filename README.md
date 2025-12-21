# Сайт репетитора по математике

Полнофункциональный веб-сайт для репетитора по математике с панелью управления для учителя и учеников.

## Технологии

- **Next.js 14+** (App Router) с TypeScript
- **Prisma** для работы с PostgreSQL
- **NextAuth.js** для аутентификации
- **shadcn/ui** для UI компонентов
- **Tailwind CSS** для стилизации
- **Zod** для валидации
- **Docker** для контейнеризации

## Быстрый старт с Docker Compose

### 1. Клонируйте репозиторий

```bash
git clone <repository-url>
cd nastya-site
```

### 2. Настройте переменные окружения

```bash
cp .env.example .env
```

Откройте `.env` и замените:
- `POSTGRES_PASSWORD` - придумайте надежный пароль для базы данных
- `NEXTAUTH_SECRET` - сгенерируйте случайный ключ (см. ниже)
- `NEXTAUTH_URL` - укажите ваш домен или оставьте `http://localhost:3000` для локальной разработки

**Генерация NEXTAUTH_SECRET:**
```bash
# Linux/Mac
openssl rand -base64 32

# Или используйте онлайн генератор: https://generate-secret.vercel.app/32
```

### 3. Запустите проект

```bash
# Собрать и запустить все контейнеры
docker-compose up -d

# Посмотреть логи
docker-compose logs -f
```

Подождите 1-2 минуты, пока все запустится.

### 4. Создайте первого пользователя (учителя)

```bash
# Войдите в контейнер приложения
docker-compose exec app sh

# В контейнере выполните скрипт
node create-teacher.js
```

Введите:
- Email учителя (например: `teacher@example.com`)
- Пароль (запомните его!)
- Имя (например: `Анастасия`)

### 5. Откройте сайт

Откройте в браузере: `http://localhost:3000`

Войдите используя созданные данные.

## Полезные команды Docker Compose

```bash
# Посмотреть статус контейнеров
docker-compose ps

# Посмотреть логи приложения
docker-compose logs -f app

# Посмотреть логи базы данных
docker-compose logs -f postgres

# Остановить все
docker-compose stop

# Запустить снова
docker-compose start

# Полностью остановить и удалить (данные БД сохранятся)
docker-compose down

# Остановить и удалить ВСЕ включая данные БД (⚠️ осторожно!)
docker-compose down -v

# Перезапустить приложение
docker-compose restart app

# Пересобрать и перезапустить после изменений
docker-compose up -d --build
```

## Деплой на Dokploy

### Подготовка

1. **Убедитесь, что проект в Git:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Создайте приватный репозиторий на GitHub** (если еще не создан)

### Настройка в Dokploy

#### Шаг 1: Создание проекта

1. Войдите в Dokploy (обычно `http://ваш-сервер:3000` или через домен)
2. Нажмите "New Project" или "Создать проект"
3. Выберите тип: "Git Repository"

#### Шаг 2: Подключение Git репозитория

1. **Repository URL:** укажите URL вашего GitHub репозитория
   - Для приватного репозитория: `https://github.com/ваш-username/nastya-site.git`
   - Или SSH: `git@github.com:ваш-username/nastya-site.git`

2. **Branch:** `main` (или `master`)

3. **Если приватный репозиторий:**
   - Добавьте SSH ключ в настройках Dokploy
   - Или используйте Personal Access Token от GitHub

#### Шаг 3: Настройки сборки

В настройках проекта укажите:

- **Build Command:**
  ```bash
  npm install && npm run db:generate && npm run build
  ```

- **Start Command:**
  ```bash
  npm start
  ```

- **Node Version:** `18` или `20` (рекомендуется 20)

- **Working Directory:** `.` (корень проекта)

#### Шаг 4: Переменные окружения

В разделе "Environment Variables" добавьте:

```
DATABASE_URL=postgresql://nastya_user:ваш_пароль@localhost:5432/nastya_site?schema=public
NEXTAUTH_URL=https://ваш-домен.com
NEXTAUTH_SECRET=ваш_секретный_ключ_из_шага_2_быстрого_старта
NODE_ENV=production
```

**Важно:**
- Если PostgreSQL на том же сервере: используйте `localhost` или `127.0.0.1`
- Если PostgreSQL на другом сервере: укажите IP адрес
- Если через Cloudflare Tunnel: используйте внутренний адрес туннеля
- `NEXTAUTH_URL` должен совпадать с реальным адресом вашего сайта

#### Шаг 5: Первый деплой

1. Нажмите "Deploy" или "Deploy Now"
2. Следите за логами сборки
3. Дождитесь успешного завершения

#### Шаг 6: Применение схемы базы данных

После первого деплоя нужно применить схему БД. В Dokploy:

1. Откройте терминал/консоль контейнера (если доступно)
2. Выполните:
   ```bash
   npx prisma db push
   ```

Или добавьте в Build Command перед `npm run build`:
```bash
npm install && npm run db:generate && npx prisma db push && npm run build
```

#### Шаг 7: Создание первого пользователя

1. В терминале Dokploy (или через SSH на сервере) выполните:
   ```bash
   # Войдите в контейнер приложения
   docker exec -it <container-name> sh
   
   # Или если используете docker-compose на сервере
   docker-compose exec app sh
   
   # Выполните скрипт
   node create-teacher.js
   ```

2. Введите данные учителя

#### Шаг 8: Настройка домена (опционально)

1. В Dokploy настройте домен в настройках проекта
2. Настройте DNS записи (A или CNAME) на IP вашего сервера
3. Обновите `NEXTAUTH_URL` в переменных окружения на `https://ваш-домен.com`
4. Перезапустите приложение

### Обновление проекта

Когда нужно обновить код:

1. Сделайте изменения в коде
2. Закоммитьте и запушьте в Git:
   ```bash
   git add .
   git commit -m "Описание изменений"
   git push origin main
   ```
3. Dokploy автоматически обнаружит изменения и пересоберет проект
4. Или нажмите "Redeploy" вручную в Dokploy

## Локальная разработка (без Docker)

1. Установите зависимости:
   ```bash
   npm install
   ```

2. Настройте `.env`:
   ```bash
   cp .env.example .env
   ```
   
   Укажите `DATABASE_URL` для вашей локальной БД:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/nastya_site
   ```

3. Настройте базу данных:
   ```bash
   npm run db:generate
   npm run db:push
   ```

4. Запустите сервер разработки:
   ```bash
   npm run dev
   ```

## Структура проекта

```
nastya-site/
├── prisma/              # Схема базы данных
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── (public)/    # Публичные страницы
│   │   ├── (auth)/      # Страницы аутентификации
│   │   ├── (dashboard)/ # Панели управления
│   │   └── api/         # API routes
│   ├── components/      # React компоненты
│   ├── lib/             # Утилиты и конфигурация
│   └── types/           # TypeScript типы
├── image/               # Изображения
├── docker-compose.yml   # Docker Compose конфигурация
├── Dockerfile           # Docker образ
└── create-teacher.js    # Скрипт создания первого пользователя
```

## Функциональность

### Публичные страницы
- Главная страница
- Тарифы
- Обо мне
- Контакты
- Как проходят занятия

### Панель учителя
- **Расписание** - управление уроками, календарь
- **Оплата** - отслеживание платежей
- **Статистика** - общая статистика по ученикам
- **Ученики** - управление списком учеников
- **Успеваемость** - отслеживание прогресса учеников
- **ОГЭ** - управление пробниками и материалами ОГЭ

### Панель ученика
- **Расписание** - личное расписание занятий
- **Папка д/з** - домашние задания
- **Папка материалы** - учебные материалы
- **ОГЭ** - статистика пробников и материалы ОГЭ

## Скрипты

- `npm run dev` - запуск сервера разработки
- `npm run build` - сборка для продакшена
- `npm start` - запуск продакшен сервера
- `npm run db:generate` - генерация Prisma Client
- `npm run db:push` - применение изменений схемы (для разработки)
- `npm run db:migrate` - применение миграций
- `npm run db:studio` - открытие Prisma Studio

## Решение проблем

### Ошибка подключения к БД

- Проверьте `DATABASE_URL` в переменных окружения
- Убедитесь, что PostgreSQL запущен и доступен
- Проверьте firewall настройки

### Ошибка при сборке

- Проверьте логи в Dokploy
- Убедитесь, что Node версия правильная (18+)
- Проверьте, что все зависимости в `package.json`

### Prisma ошибки

- Убедитесь, что `npm run db:generate` выполняется в build command
- Проверьте, что `DATABASE_URL` правильный

### NextAuth ошибки

- Проверьте `NEXTAUTH_SECRET` и `NEXTAUTH_URL`
- Убедитесь, что URL совпадает с реальным адресом сайта

## Безопасность

- Все пароли хешируются с помощью bcrypt
- API routes защищены через NextAuth сессии
- Валидация данных через Zod на клиенте и сервере
- Middleware для защиты роутов по ролям
- Не коммитьте `.env` файл в Git

## Лицензия

Приватный проект
