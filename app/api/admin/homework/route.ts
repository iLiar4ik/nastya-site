import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { homework, media } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await db.query.homework.findMany({ orderBy: [desc(homework.createdAt)] })
  const withUrls = await Promise.all(rows.map(async (r) => {
    let attachmentUrl: string | null = null
    if (r.attachmentFileId) {
      const m = await db.query.media.findFirst({ where: eq(media.id, r.attachmentFileId) })
      attachmentUrl = m?.url ?? null
    }
    return { ...r, attachmentUrl }
  }))
  return NextResponse.json(withUrls)
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const [row] = await db.insert(homework).values({
    title: body.title,
    studentId: body.studentId,
    materialId: body.materialId ?? null,
    attachmentFileId: body.attachmentFileId ?? null,
    status: body.status ?? 'active',
    dueDate: body.dueDate,
    instructions: body.instructions ?? null,
  }).returning()
  return NextResponse.json(row)
}
