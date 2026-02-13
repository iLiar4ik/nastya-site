import sharp from 'sharp'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
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
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || 'file:./payload.db',
    },
    useTimestamp: true,
  }),
  sharp,
  typescript: {
    outputFile: path.resolve(process.cwd(), 'payload-types.ts'),
  },
})
