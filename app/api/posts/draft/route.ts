import { NextRequest, NextResponse } from 'next/server'
import { createPost } from '@/lib/createPost'

const VALID_CATEGORIES = ['ai-models', 'anthropic', 'industry', 'tools']

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get('x-api-key')
  if (!apiKey || apiKey !== process.env.SCOUT_API_KEY) {
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
        content,
        excerpt,
        category: category as 'ai-models' | 'anthropic' | 'industry' | 'tools',
        tags: Array.isArray(body.tags) ? (body.tags as string[]) : [],
        cover_image_url: typeof body.cover_image_url === 'string' ? body.cover_image_url : '',
        cover_image_prompt:
          typeof body.cover_image_prompt === 'string' ? body.cover_image_prompt : '',
        source_urls: Array.isArray(body.source_urls) ? (body.source_urls as string[]) : [],
        auto_generated: body.auto_generated === true,
      },
      'draft'
    )

    return NextResponse.json({ success: true, post_id, slug })
  } catch (err) {
    console.error('[/api/posts/draft]', err)
    return NextResponse.json({ error: 'Failed to save draft' }, { status: 500 })
  }
}
