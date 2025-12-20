# Инструкция по деплою в Dokploy

## Подготовка к деплою

### 1. Настройка переменных окружения

Создайте файл `.env.production` или настройте переменные в Dokploy:

```env
# Database - ВАЖНО: используйте правильное имя сервиса PostgreSQL
DB_HOST=<имя_сервиса_postgresql_в_dokploy>
DB_PORT=5432
DB_NAME=nastya_tutor
DB_USER=postgres
DB_PASSWORD=your_secure_password

# JWT
JWT_SECRET=your-very-secure-secret-key-minimum-32-characters-long
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Server
NODE_ENV=production
PORT=3000

# CORS (замените на ваш домен фронтенда)
CORS_ORIGIN=https://your-frontend-domain.com
```

### 2. Деплой бэкенда в Dokploy

1. **Создайте новый проект в Dokploy**
   - Название: `nastya-backend`
   - Тип: **Docker**

2. **Настройте Git репозиторий**
   - Подключите ваш репозиторий: `https://github.com/iLiar4ik/nastya-tutor`
   - Branch: `master`
   - Build Context: `backend`
   - Dockerfile Path: `backend/Dockerfile`

3. **Настройте переменные окружения**
   - Добавьте все переменные из `.env.production`
   - **Важно**: Используйте сильный `JWT_SECRET` (минимум 32 символа)

4. **Настройте порты**
   - Container Port: `3000`
   - Public Port: `3000` (или любой другой доступный)

5. **Настройка базы данных (КРИТИЧЕСКИ ВАЖНО!)**
   
   **Вариант A: PostgreSQL в Dokploy**
   
   - Создайте новый сервис PostgreSQL в Dokploy
   - **Как найти правильное имя для DB_HOST:**
     
     **Способ 1: Имя сервиса**
     - В Dokploy откройте настройки PostgreSQL сервиса
     - Имя сервиса отображается в заголовке страницы сервиса
     - Это может быть: `postgres`, `nastya-postgres`, `postgresql`, или другое имя
     - Используйте это имя как `DB_HOST`
     
     **Способ 2: Внутренний IP**
     - В настройках PostgreSQL сервиса найдите "Internal IP" или "Service IP"
     - Используйте этот IP адрес как `DB_HOST`
     
     **Способ 3: Через Docker сеть**
     - Если оба сервиса в одной Docker сети, используйте имя сервиса
     - Убедитесь, что оба сервиса (backend и postgres) в одной сети
   
   - Настройте переменные окружения:
     ```
     DB_HOST=<найденное_имя_или_IP>
     DB_PORT=5432
     DB_NAME=nastya_tutor
     DB_USER=postgres
     DB_PASSWORD=your_secure_password
     ```
   
   **Вариант B: Внешняя база данных**
   - Используйте внешний PostgreSQL (Supabase, Railway, DigitalOcean, и т.д.)
   - Укажите полный хост в `DB_HOST` (например, `db.xxxxx.supabase.co`)
   - Настройте SSL подключение если требуется
   - Пример для Supabase:
     ```
     DB_HOST=db.xxxxx.supabase.co
     DB_PORT=5432
     DB_NAME=postgres
     DB_USER=postgres
     DB_PASSWORD=your_password
     ```

6. **Настройте команду запуска**
   - Command: `npm run start:migrate` (выполнит миграции перед запуском)

### 3. Деплой фронтенда

**Вариант A: Статический хостинг (рекомендуется)**

1. Используйте Netlify, Vercel или другой статический хостинг
2. Загрузите папку с HTML/CSS/JS файлами
3. Настройте переменную окружения `API_BASE_URL` или обновите `js/api/client.js`

**Вариант B: Nginx в Dokploy**

1. Создайте новый проект в Dokploy
2. Настройте:
   - Build Context: `.` (корень проекта)
   - Dockerfile Path: `nginx/Dockerfile`
   - Port: `80`

### 4. Настройка CORS

Убедитесь, что `CORS_ORIGIN` в переменных окружения бэкенда указывает на домен вашего фронтенда:

```
CORS_ORIGIN=https://your-frontend-domain.com
```

### 5. Настройка API клиента на фронтенде

Если фронтенд и бэкенд на разных доменах, обновите `js/api/client.js`:

```javascript
// В начале файла добавьте:
window.API_BASE_URL = 'https://your-backend-domain.com/api';
```

Или установите переменную окружения при сборке.

## Решение проблем с подключением к БД

### Ошибка: `ENOTFOUND postgres`

**Причина:** Неправильное имя хоста в `DB_HOST`

**Решения:**

1. **Проверьте имя сервиса PostgreSQL в Dokploy:**
   - Откройте настройки PostgreSQL сервиса
   - Найдите имя сервиса (обычно в заголовке)
   - Обновите `DB_HOST` в переменных окружения бэкенда

2. **Используйте внутренний IP:**
   - В настройках PostgreSQL найдите "Internal IP" или "Service IP"
   - Используйте этот IP как `DB_HOST`

3. **Проверьте сеть:**
   - Убедитесь, что оба сервиса (backend и postgres) в одной Docker сети
   - В Dokploy это обычно настраивается автоматически, если сервисы в одном проекте

4. **Проверьте переменные окружения:**
   - Убедитесь, что все переменные `DB_*` правильно настроены
   - Проверьте, что нет опечаток в именах переменных

### Ошибка: `password authentication failed`

**Причина:** Неверные учетные данные

**Решение:**
- Проверьте `DB_USER` и `DB_PASSWORD` в переменных окружения
- Убедитесь, что пароль совпадает с настройками PostgreSQL сервиса

### Ошибка: `database does not exist`

**Причина:** База данных не создана

**Решение:**
- Создайте базу данных в PostgreSQL
- Или используйте существующую базу (например, `postgres` по умолчанию)
- Обновите `DB_NAME` в переменных окружения

## Проверка после деплоя

1. **Проверьте health check:**
   ```
   curl https://your-backend-domain.com/health
   ```
   Должен вернуть: `{"status":"ok","message":"Server is running","database":"connected"}`

2. **Проверьте логи:**
   - В Dokploy откройте логи контейнера бэкенда
   - Убедитесь, что видите: `Database connection has been established successfully.`
   - Убедитесь, что видите: `All migrations completed successfully!`

3. **Проверьте API:**
   ```bash
   curl https://your-backend-domain.com/api/auth/register \
     -X POST \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test123456","name":"Test"}'
   ```

4. **Проверьте фронтенд:**
   - Откройте в браузере
   - Попробуйте зарегистрироваться или войти
   - Проверьте работу API запросов в консоли браузера (F12)

## Локальное тестирование с Docker

Перед деплоем можно протестировать локально:

```bash
# Запуск с docker-compose
docker-compose up -d

# Проверка логов
docker-compose logs -f backend

# Остановка
docker-compose down
```

## Резервное копирование

Настройте автоматическое резервное копирование базы данных:

```bash
# Пример скрипта бэкапа
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > backup_$(date +%Y%m%d).sql
```

## Мониторинг

Рекомендуется настроить:
- Логирование ошибок
- Мониторинг производительности
- Алерты при падении сервиса
- Мониторинг использования ресурсов

## Обновление

Для обновления приложения:
1. Закоммитьте изменения в Git
2. Dokploy автоматически обнаружит изменения
3. Пересоберет и перезапустит контейнер
4. Миграции выполнятся автоматически при старте

## Troubleshooting

### Проблема: Бэкенд не подключается к БД
- Проверьте переменные окружения `DB_*`
- Убедитесь, что БД доступна из контейнера
- Проверьте логи: `docker-compose logs backend` или в Dokploy
- Убедитесь, что имя сервиса PostgreSQL правильное

### Проблема: CORS ошибки
- Проверьте `CORS_ORIGIN` в переменных окружения
- Убедитесь, что домен фронтенда указан правильно

### Проблема: Миграции не выполняются
- Проверьте логи при старте
- Убедитесь, что команда `start:migrate` используется
- Проверьте права доступа к БД

### Проблема: Токены не работают
- Проверьте `JWT_SECRET` (должен быть одинаковым для всех инстансов)
- Убедитесь, что токены сохраняются в localStorage
