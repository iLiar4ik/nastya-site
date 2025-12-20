FROM node:18-alpine

WORKDIR /app

# Копируем package files
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Создаем пользователя без root прав для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Открываем порт (по умолчанию 3000, но можно изменить через переменную PORT)
EXPOSE 3000

# Health check (порт будет определен через переменную окружения PORT)
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "const port = process.env.PORT || 3000; require('http').get(`http://localhost:${port}/health`, (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Запускаем миграции и приложение
# Используем exec-form для лучшей обработки сигналов и принудительной синхронизации вывода
CMD ["sh", "-c", "set -x && echo '=== BACKEND CONTAINER STARTED ===' >&2 && echo 'Current directory:' >&2 && pwd >&2 && echo 'Starting migrations...' >&2 && node migrations/run-migrations.js 2>&1 && echo 'Migrations completed, starting server...' >&2 && exec node src/server.js 2>&1"]

