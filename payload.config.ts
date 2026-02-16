import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import { createRequire } from 'node:module'
import fs from 'node:fs'
import path from 'node:path'

// В production загружаем миграции из /app/migrations (Docker) — иначе connect() не вызовет migrate()
// Не загружаем при next build (нет папки migrations в .next)
function loadProdMigrations(): { name: string; up: (args: unknown) => Promise<void>; down: (args: unknown) => Promise<void> }[] | undefined {
  if (process.env.NODE_ENV !== 'production') return undefined
  try {
    const dir = path.join(process.cwd(), 'migrations')
    if (!fs.existsSync(dir)) return undefined
    const require = createRequire(import.meta.url)
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js') && f !== 'index.js').sort()
    if (files.length === 0) return undefined
    return files.map((f) => {
      const fullPath = path.join(dir, f)
      const mod = require(fullPath)
      return { name: f.replace('.js', ''), up: mod.up, down: mod.down }
    })
  } catch {
    return undefined
  }
}

export default buildConfig({
  admin: {
    importMap: {
      autoGenerate: true,
    },
  },
  editor: lexicalEditor(),
  collections: [
    {
      slug: 'users',
      auth: true,
      access: {
        admin: () => true,
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      slug: 'media',
      upload: {
        staticDir: process.env.PAYLOAD_UPLOAD_DIR || path.resolve(process.cwd(), 'media'),
        mimeTypes: ['image/*'],
      },
      fields: [
        {
          name: 'alt',
          type: 'text',
        },
      ],
    },
  ],
  secret: process.env.PAYLOAD_SECRET || 'change-me-in-production',
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL,
    },
    prodMigrations: loadProdMigrations(),
  }),
  // sharp отключён — вызывает SIGILL на старых CPU (Acer Aspire One)
  typescript: {
    outputFile: path.resolve(process.cwd(), 'payload-types.ts'),
  },
})
