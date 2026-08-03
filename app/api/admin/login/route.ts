import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminPassword, adminSessionToken, ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE } from '@/lib/adminAuth'

// Simple in-memory brute-force throttle. Vercel serverless instances are
// ephemeral, so this resets on cold start — it's a deterrent, not a vault.
// (SEC-04 was deferred at current scale; this is the minimum viable guard.)
const attempts = new Map<string, { count: number; resetAt: number }>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now > entry.resetAt) return false
  return entry.count >= 10
}

function recordAttempt(ip: string, failed: boolean) {
  const now = Date.now()
  const entry = attempts.get(ip)
  if (!entry || now > entry.resetAt) {
    attempts.set(ip, { count: failed ? 1 : 0, resetAt: now + 10 * 60 * 1000 })
    return
  }
  if (failed) entry.count += 1
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
  }

  let body: { password?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const password = typeof body.password === 'string' ? body.password : ''
  if (!verifyAdminPassword(password)) {
    recordAttempt(ip, true)
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  recordAttempt(ip, false)

  const token = adminSessionToken()
  if (!token) {
    return NextResponse.json({ error: 'Admin auth not configured' }, { status: 500 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE,
  })
  return res
}
