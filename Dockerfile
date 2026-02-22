FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline --no-audit --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

# Copy only necessary files for build (using .dockerignore)
COPY . .

# Build Next.js (SQLite: временный файл для сборки)
ENV DATABASE_URL=file:./.tmp/payload.db
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN mkdir -p .tmp && npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY docker-entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/docker-entrypoint.sh
RUN mkdir -p /app/data /app/data/uploads

# Запуск от root — иначе нет прав на запись в volume /app/data
EXPOSE 8000

ENV PORT 8000
ENV HOSTNAME "0.0.0.0"

# Healthcheck для проверки работоспособности приложения
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
