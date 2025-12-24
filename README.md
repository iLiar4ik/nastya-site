# Сайт-визитка репетитора по математике

Современный одностраничный сайт для репетитора по математике с формой обратной связи.

## Технологии

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**

## Запуск проекта

### Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### Production сборка

```bash
# Сборка проекта
npm run build

# Запуск production сервера
npm start
```

## Docker

```bash
# Сборка образа
docker-compose build

# Запуск контейнера
docker-compose up -d
```

Приложение будет доступно на порту 8000.

## Структура проекта

```
├── app/
│   ├── api/
│   │   └── contact/      # API для формы обратной связи
│   ├── globals.css       # Глобальные стили
│   ├── layout.tsx        # Корневой layout
│   └── page.tsx          # Главная страница
├── components/
│   ├── landing/          # Компоненты главной страницы
│   └── ui/               # UI компоненты shadcn/ui
└── lib/
    └── utils.ts          # Утилиты
```

## Деплой

Проект готов к деплою в Dokploy. См. `DOKPLOY_QUICK_START.md` для инструкций.
