# Nastya Tutor Backend API

Backend API для системы управления репетиторством по математике.

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Настройте переменные окружения:
```bash
cp .env.example .env
# Отредактируйте .env файл с вашими настройками
```

3. Настройте базу данных PostgreSQL:
```bash
# Создайте базу данных
createdb nastya_tutor

# Запустите миграции
npm run migrate
```

4. Запустите сервер:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Аутентификация

- `POST /api/auth/register` - Регистрация нового пользователя
- `POST /api/auth/login` - Вход в систему
- `POST /api/auth/refresh` - Обновление токена
- `GET /api/auth/me` - Получение текущего пользователя

### Ученики

- `GET /api/students` - Список учеников (с пагинацией и фильтрами)
- `GET /api/students/:id` - Детали ученика
- `POST /api/students` - Создание ученика
- `PUT /api/students/:id` - Обновление ученика
- `DELETE /api/students/:id` - Удаление ученика
- `GET /api/students/statistics` - Статистика по ученикам

### Уроки

- `GET /api/lessons` - Список уроков
- `GET /api/lessons/schedule?startDate=&endDate=` - Расписание на период
- `GET /api/lessons/upcoming?limit=` - Ближайшие уроки
- `GET /api/lessons/:id` - Детали урока
- `POST /api/lessons` - Создание урока
- `PUT /api/lessons/:id` - Обновление урока
- `DELETE /api/lessons/:id` - Удаление урока

### Аналитика

- `GET /api/analytics/overview` - Обзорная статистика
- `GET /api/analytics/students/:id/progress` - Прогресс ученика
- `GET /api/analytics/revenue` - Статистика доходов
- `GET /api/analytics/attendance` - Посещаемость
- `GET /api/analytics/grade-distribution` - Распределение по классам

## Структура проекта

```
backend/
├── src/
│   ├── config/          # Конфигурация (БД, JWT)
│   ├── controllers/     # Контроллеры
│   ├── models/          # Sequelize модели
│   ├── routes/          # API маршруты
│   ├── services/        # Бизнес-логика
│   ├── middleware/     # Middleware (auth, validation, rate limiting)
│   └── server.js        # Точка входа
├── migrations/          # SQL миграции
└── scripts/             # Вспомогательные скрипты
```

## Безопасность

- JWT токены для аутентификации
- Rate limiting для защиты от DDoS
- Валидация всех входных данных
- Хеширование паролей (bcrypt)
- CORS настройки
- Helmet для безопасности HTTP заголовков

## Переменные окружения

- `DB_HOST` - Хост PostgreSQL
- `DB_PORT` - Порт PostgreSQL
- `DB_NAME` - Имя базы данных
- `DB_USER` - Пользователь БД
- `DB_PASSWORD` - Пароль БД
- `JWT_SECRET` - Секретный ключ для JWT
- `PORT` - Порт сервера (по умолчанию 3000)
- `NODE_ENV` - Окружение (development/production)


