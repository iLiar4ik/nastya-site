FROM node:18-alpine

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json* ./

# Устанавливаем зависимости
RUN npm install --legacy-peer-deps --no-audit

# Копируем остальные файлы
COPY . .

# Генерируем Prisma Client
RUN npx prisma generate

# Собираем приложение
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Запускаем
EXPOSE ${PORT:-8000}
ENV PORT ${PORT:-8000}
ENV HOSTNAME "0.0.0.0"
ENV NODE_ENV production

CMD ["npm", "start"]

