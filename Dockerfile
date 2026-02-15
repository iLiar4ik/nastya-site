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

# Build Next.js (DATABASE_URI для Payload на этапе build, в CI передаётся build-arg)
ARG DATABASE_URI=postgresql://postgres:build@localhost:5432/postgres
ENV DATABASE_URI=$DATABASE_URI
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Папка для Payload: база SQLite и загрузки
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY docker-entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set correct permissions
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 8000

ENV PORT 8000
ENV HOSTNAME "0.0.0.0"

# Healthcheck для проверки работоспособности приложения
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8000/', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
