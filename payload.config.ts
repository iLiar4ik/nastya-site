import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import path from 'path'

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
  }),
  // sharp отключён — вызывает SIGILL на старых CPU (Acer Aspire One)
  typescript: {
    outputFile: path.resolve(process.cwd(), 'payload-types.ts'),
  },
})
