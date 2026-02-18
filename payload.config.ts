import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { buildConfig } from 'payload'
import path from 'node:path'

import { Students } from './collections/Students'
import { Materials } from './collections/Materials'
import { Homework } from './collections/Homework'
import { Tests } from './collections/Tests'
import { Payments } from './collections/Payments'

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
      admin: {
        group: 'Система',
      },
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
      admin: {
        group: 'Система',
      },
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
    Students,
    Materials,
    Homework,
    Tests,
    Payments,
  ],
  secret: process.env.PAYLOAD_SECRET || 'change-me-in-production',
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL ?? (process.env.NODE_ENV === 'production' ? 'file:/app/data/payload.db' : `file:${path.resolve(process.cwd(), 'data', 'payload.db')}`),
    },
    migrationDir: path.join(process.cwd(), 'migrations'),
  }),
  // sharp отключён — вызывает SIGILL на старых CPU (Acer Aspire One)
  typescript: {
    outputFile: path.resolve(process.cwd(), 'payload-types.ts'),
  },
})
