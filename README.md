# Nastya Tutor - Система управления репетиторством

Полнофункциональная система для управления репетиторством по математике с веб-интерфейсом и REST API.

## Особенности

- Управление учениками (CRUD операции)
- Расписание уроков с календарем
- История уроков и отчеты
- Аналитика и статистика
- Безопасная аутентификация (JWT)
- Адаптивный дизайн
- Темная/светлая тема

## Технологии

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- shadcn/ui компоненты
- Font Awesome иконки

### Backend
- Node.js + Express
- PostgreSQL + Sequelize ORM
- JWT аутентификация
- bcrypt для хеширования паролей

## Установка и запуск

### Требования
- Node.js 16+
- PostgreSQL 12+
- npm или yarn

### Backend

1. Перейдите в папку backend:
```bash
cd backend
```

2. Установите зависимости:
```bash
npm install
```

3. Настройте переменные окружения:
```bash
cp .env.example .env
# Отредактируйте .env с вашими настройками БД
```

4. Создайте базу данных:
```bash
createdb nastya_tutor
```

5. Запустите миграции:
```bash
npm run migrate
```

6. Запустите сервер:
```bash
npm run dev  # Development
# или
npm start    # Production
```

### Frontend

1. Настройте URL API в `js/api/client.js`:
```javascript
const API_BASE_URL = 'http://localhost:3000/api';
```

2. Откройте `index.html` в браузере или используйте локальный сервер:
```bash
# Python
python -m http.server 8080

# Node.js
npx http-server -p 8080
```

3. Откройте в браузере: `http://localhost:8080`

## Миграция данных

Если у вас есть данные в LocalStorage, используйте скрипт миграции:

1. Откройте консоль браузера на любой странице
2. Загрузите скрипт миграции:
```html
<script src="js/migrate-data.js"></script>
```
3. Выполните миграцию:
```javascript
migrateData()
```

## Структура проекта

```
nastya-site/
├── backend/              # Backend API
│   ├── src/
│   ├── migrations/
│   └── package.json
├── css/                  # Стили
├── js/                   # JavaScript модули
│   ├── api/             # API клиент
│   └── ...
├── *.html               # HTML страницы
└── README.md
```

## API Документация

См. [backend/README.md](backend/README.md) для полной документации API.

## Деплой

Подробные инструкции по деплою в Dokploy см. в [DEPLOY.md](DEPLOY.md)

### Быстрый старт для Dokploy

1. Настройте переменные окружения в Dokploy
2. Подключите Git репозиторий
3. Укажите Build Context: `backend`
4. Укажите Dockerfile Path: `backend/Dockerfile`
5. Настройте команду: `npm run start:migrate`

## Лицензия

ISC


