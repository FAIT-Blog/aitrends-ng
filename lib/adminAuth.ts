import crypto from 'crypto'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'aitrends_admin'
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 12 // 12 hours

// Timing-safe comparison — prevents timing attacks on the admin password.
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
  } catch {
    return false
  }
}

// Session token: HMAC-SHA256 of the admin password. Stateless — no DB table,
// no expiry store. Rotating ADMIN_PASSWORD invalidates every live session.
// The token is never logged and never sent to the client except as the
// httpOnly cookie value.
export function adminSessionToken(): string {
  const pw = process.env.ADMIN_PASSWORD ?? ''
  if (!pw) return ''
  return crypto
    .createHmac('sha256', pw)
    .update('aitrends-admin-session-v1')
    .digest('hex')
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? ''
  if (!expected) return false
  return safeCompare(password, expected)
}

// Reads the admin cookie from the current request and returns true if it
// matches the expected session token. Server-only (uses next/headers).
export async function isAdminAuthed(): Promise<boolean> {
  try {
    const store = await cookies()
    const token = store.get(ADMIN_COOKIE)?.value
    if (!token) return false
    const expected = adminSessionToken()
    if (!expected) return false
    return safeCompare(token, expected)
  } catch {
    return false
  }
}
