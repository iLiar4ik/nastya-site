import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/db'
import { materials, materialsTags } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const rows = await db.query.materials.findMany({ orderBy: [desc(materials.createdAt)] })
  const withTags = await Promise.all(rows.map(async (m) => {
    const tags = await db.query.materialsTags.findMany({ where: eq(materialsTags.materialId, m.id) })
    return { ...m, tags: tags.map(x => x.tag) }
  }))
  return NextResponse.json(withTags)
}

export async function POST(req: NextRequest) {
  const user = await getSession()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const [row] = await db.insert(materials).values({
    title: body.title,
    type: body.type,
    category: body.category ?? null,
    subject: body.subject ?? null,
    topic: body.topic ?? null,
    fileId: body.fileId ?? null,
    fileUrl: body.fileUrl ?? null,
    content: body.content ?? null,
  }).returning()
  if (body.tags?.length) {
    await db.insert(materialsTags).values(body.tags.map((tag: string) => ({ materialId: row.id, tag })))
  }
  return NextResponse.json(row)
}
