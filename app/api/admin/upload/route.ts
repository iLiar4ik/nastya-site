import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { media } from '@/db/schema'
import path from 'path'
import fs from 'fs'
import { writeFile, mkdir } from 'fs/promises'

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? (
  process.env.NODE_ENV === 'production' ? '/app/data/uploads' : path.join(process.cwd(), 'public', 'uploads')
)

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })
  await mkdir(UPLOAD_DIR, { recursive: true })
  const ext = path.extname(file.name) || '.bin'
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
  const filepath = path.join(UPLOAD_DIR, filename)
  const bytes = await file.arrayBuffer()
  await writeFile(filepath, Buffer.from(bytes))
  const url = process.env.NODE_ENV === 'production' ? `/api/files/${filename}` : `/uploads/${filename}`
  const [row] = await db.insert(media).values({
    filename: file.name,
    url,
    mimeType: file.type || null,
    alt: null,
  }).returning()
  return NextResponse.json(row)
}
