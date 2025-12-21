import { getServerSession } from "next-auth"
import { authOptions } from "./auth"
import { NextResponse } from "next/server"

export async function getAuthenticatedUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return null
  }
  return session.user
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}

export function forbiddenResponse() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}

export function badRequestResponse(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

