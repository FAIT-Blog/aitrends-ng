// app/api/slack/editorial/route.ts
//
// Receives Slack Events API webhooks from #scout-editor.
// When Felix posts a message to #scout-editor, Slack calls this endpoint.
//
// This replaces the old polling approach where Scout queried conversations.history
// on every run. Now: Felix writes → Slack pushes → row saved → Scout reads from DB.
//
// Set up in Slack:
//   1. Enable Event Subscriptions in your Slack app settings
//   2. Set Request URL: https://aitrends-ng.vercel.app/api/slack/editorial
//   3. Subscribe to bot event: message.channels (+ message.groups if private)
//   4. Copy "Signing Secret" → Vercel env var: SLACK_SIGNING_SECRET

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function extractUrls(text: string): string[] {
  const slackWrapped = /<(https?:\/\/[^|>\s]+)[^>]*>/g
  const urls: string[] = []
  let m: RegExpExecArray | null
  while ((m = slackWrapped.exec(text)) !== null) urls.push(m[1])
  const stripped = text.replace(/<[^>]+>/g, ' ')
  const bare = /https?:\/\/[^\s<>"']+/g
  while ((m = bare.exec(stripped)) !== null) urls.push(m[0].replace(/[.,;!?]$/, ''))
  return [...new Set(urls)]
}

function stripSlackFormatting(text: string): string {
  return text
    .replace(/<https?:\/\/[^|>]*\|([^>]+)>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .trim()
}

function verifySlackSignature(
  signingSecret: string,
  signature: string,
  timestamp: string,
  body: string
): boolean {
  // Reject replays older than 5 minutes
  if (Math.abs(Date.now() / 1000 - parseInt(timestamp, 10)) > 300) return false
  const baseString = `v0:${timestamp}:${body}`
  const expected = 'v0=' + crypto.createHmac('sha256', signingSecret).update(baseString).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  } catch {
    return false
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text()

  let body: Record<string, unknown>
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Slack sends a one-time challenge when the Request URL is first saved
  if (body.type === 'url_verification') {
    return NextResponse.json({ challenge: body.challenge })
  }

  // Validate signature on all other requests
  const signingSecret = process.env.SLACK_SIGNING_SECRET
  if (!signingSecret) {
    console.error('[editorial] SLACK_SIGNING_SECRET not configured')
    return NextResponse.json({ error: 'Configuration error' }, { status: 500 })
  }

  const signature = req.headers.get('x-slack-signature') ?? ''
  const timestamp  = req.headers.get('x-slack-request-timestamp') ?? ''

  if (!verifySlackSignature(signingSecret, signature, timestamp, rawBody)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }

  // Slack retries if we don't respond within 3 s — just acknowledge
  if (req.headers.get('x-slack-retry-num')) {
    return NextResponse.json({ ok: true })
  }

  // Only handle message events
  const event = body.event as Record<string, unknown> | undefined
  if (!event || event.type !== 'message') {
    return NextResponse.json({ ok: true })
  }

  // Ignore bot messages and non-standard subtypes (channel_join, etc.)
  if (event.bot_id || event.subtype) {
    return NextResponse.json({ ok: true })
  }

  const rawText  = (event.text as string) || ''
  const urls     = extractUrls(rawText)
  const plainText = stripSlackFormatting(rawText)
    .replace(/https?:\/\/\S+/g, '')
    .trim()

  if (!plainText && urls.length === 0) {
    return NextResponse.json({ ok: true })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!
  )

  const { error } = await supabase.from('editorial_queue').insert({
    slack_ts:      event.ts as string,
    slack_channel: event.channel as string,
    text:          plainText || null,
    urls:          urls.length > 0 ? urls : null,
    notes:         plainText || null,
    status:        'pending',
  })

  if (error) {
    // Duplicate ts = Slack retry that slipped past the retry header check — safe to ignore
    if (error.code === '23505') return NextResponse.json({ ok: true })
    console.error('[editorial] DB insert error:', error.message)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  console.log(`[editorial] Queued: ${urls.length} URL(s), note: "${plainText.slice(0, 60)}"`)

  // Trigger Phase 1 immediately so the editorial input is processed now,
  // not at the next 6-hour cron tick. Non-blocking — a dispatch failure
  // never breaks the webhook response; the input is already safely in the DB
  // and will be picked up by the scheduled run at worst.
  const pat = process.env.GITHUB_PAT
  if (pat) {
    fetch(
      'https://api.github.com/repos/FAIT-Blog/scout-agent/actions/workflows/scout.yml/dispatches',
      {
        method: 'POST',
        headers: {
          Authorization:  `Bearer ${pat}`,
          Accept:         'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ref: 'main' }),
      }
    )
      .then(r => console.log(`[editorial] Phase 1 dispatch: HTTP ${r.status}`))
      .catch(e => console.error(`[editorial] Phase 1 dispatch failed: ${e.message}`))
  } else {
    console.warn('[editorial] GITHUB_PAT not set — Phase 1 will run on next cron tick')
  }

  return NextResponse.json({ ok: true })
}
