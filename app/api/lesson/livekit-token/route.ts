import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getStudentSession } from '@/lib/student-auth'
import { AccessToken } from 'livekit-server-sdk'

const ROOM_PREFIX = 'nastya-lesson'

export async function POST(req: NextRequest) {
  const key = process.env.LIVEKIT_API_KEY
  const secret = process.env.LIVEKIT_API_SECRET
  const serverUrl = process.env.LIVEKIT_URL

  if (!key || !secret || !serverUrl) {
    return NextResponse.json(
      { error: 'LiveKit not configured (LIVEKIT_API_KEY, LIVEKIT_API_SECRET, LIVEKIT_URL)' },
      { status: 503 }
    )
  }

  let body: { studentId?: number }
  try {
    body = await req.json()
  } catch {
    body = {}
  }
  const studentId = body.studentId != null ? Number(body.studentId) : null
  if (studentId == null || isNaN(studentId)) {
    return NextResponse.json({ error: 'studentId required' }, { status: 400 })
  }

  const admin = await getSession()
  const student = await getStudentSession()

  const allowed = !!admin || (!!student && student.id === studentId)
  if (!allowed) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const roomName = `${ROOM_PREFIX}-${studentId}`
  const isTeacher = !!admin
  const identity = isTeacher ? `teacher-${studentId}` : `student-${studentId}`
  const name = isTeacher ? 'Учитель' : (student?.name ?? `Ученик ${studentId}`)

  const at = new AccessToken(key, secret, {
    identity,
    name,
    ttl: '6h',
  })
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  })

  const token = await at.toJwt()
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '')
  const excalidrawRoomName = `${ROOM_PREFIX}-${studentId}-${dateStr}`
  return NextResponse.json({ token, serverUrl, excalidrawRoomName })
}
