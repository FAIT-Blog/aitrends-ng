import { NextRequest, NextResponse } from 'next/server'
import { createPost } from '@/lib/createPost'
import crypto from 'crypto'
import sanitizeHtml from 'sanitize-html'

// Allowlist matches what Gemini currently generates (h3, p, strong) plus safe
// additions for future content. Strips script, iframe, style, on* handlers,
// and javascript:/data: URLs automatically via sanitize-html defaults.
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h2', 'h3', 'h4',
    'p', 'br',
    'strong', 'em',
    'ul', 'ol', 'li',
    'a', 'blockquote', 'hr',
  ],
  allowedAttributes: {
    a: ['href', 'target', 'rel'],
  },
  allowedSchemesByTag: {
    a: ['https', 'http', 'mailto'],
  },
}

const VALID_CATEGORIES = ['ai-models', 'anthropic', 'industry', 'tools']

// Constant-time comparison — prevents timing attacks on the API key
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
  } catch {
    return false
  }
}

// Validates that a value is a public HTTPS/HTTP URL — rejects javascript:, data:, etc.
function isSafeUrl(val: unknown): string {
  if (typeof val !== 'string' || !val) return ''
  try {
    const u = new URL(val)
    return ['https:', 'http:'].includes(u.protocol) ? val : ''
  } catch {
    return ''
  }
}

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  const expectedKey = process.env.SCOUT_API_KEY ?? ''
  if (!apiKey || !expectedKey || !safeCompare(apiKey, expectedKey)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { title, content, excerpt, category } = body

  if (!title || typeof title !== 'string') {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }
  if (!content || typeof content !== 'string') {
    return NextResponse.json({ error: 'content is required' }, { status: 400 })
  }
  if (!excerpt || typeof excerpt !== 'string') {
    return NextResponse.json({ error: 'excerpt is required' }, { status: 400 })
  }
  if (!category || !VALID_CATEGORIES.includes(category as string)) {
    return NextResponse.json(
      { error: `category must be one of: ${VALID_CATEGORIES.join(', ')}` },
      { status: 400 }
    )
  }

  try {
    const { post_id, slug } = await createPost(
      {
        title,
        content: sanitizeHtml(content as string, SANITIZE_OPTIONS),
        excerpt,
        category: category as 'ai-models' | 'anthropic' | 'industry' | 'tools',
        tags: Array.isArray(body.tags) ? (body.tags as string[]) : [],
        cover_image_url: isSafeUrl(body.cover_image_url),
        cover_image_prompt:
          typeof body.cover_image_prompt === 'string' ? body.cover_image_prompt : '',
        source_urls: Array.isArray(body.source_urls)
          ? (body.source_urls as unknown[]).map(isSafeUrl).filter(Boolean) as string[]
          : [],
        auto_generated: body.auto_generated === true,
      },
      'published'
    )

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.aitrends.ng'

    return NextResponse.json({
      success: true,
      post_id,
      slug,
      url: `${siteUrl}/post/${slug}`,
    })
  } catch (err) {
    console.error('[/api/posts/create]', err)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
