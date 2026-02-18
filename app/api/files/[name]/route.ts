import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? '/app/data/uploads'

export async function GET(req: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  if (!name || name.includes('..')) return new NextResponse('Not found', { status: 404 })
  const filepath = path.join(UPLOAD_DIR, name)
  if (!fs.existsSync(filepath)) return new NextResponse('Not found', { status: 404 })
  const buffer = fs.readFileSync(filepath)
  return new NextResponse(buffer, {
    headers: { 'Content-Type': 'application/octet-stream' },
  })
}
