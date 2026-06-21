import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function strip(val: unknown, maxLen: number): string {
  if (typeof val !== 'string') return ''
  return val.replace(/<[^>]*>/g, '').trim().slice(0, maxLen)
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const message = strip(body.message, 2000)
  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 })
  }

  const name = strip(body.name, 100) || null
  const rawEmail = strip(body.email, 254)
  const email = rawEmail && isValidEmail(rawEmail) ? rawEmail : null
  const post_slug = strip(body.post_slug, 200) || null

  const { error } = await supabaseAdmin
    .from('feedback')
    .insert({ name, email, message, post_slug })

  if (error) {
    console.error('[/api/feedback]', error.message)
    return NextResponse.json({ error: 'Failed to save feedback' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
