import { supabaseAdmin } from './supabase'
import { slugify } from './slugify'

export interface PostPayload {
  title: string
  content: string
  excerpt: string
  category: 'ai-models' | 'anthropic' | 'industry' | 'tools' | 'ai'
  tags?: string[]
  cover_image_url?: string
  cover_image_prompt?: string
  source_urls?: string[]
  auto_generated?: boolean
}

export async function createPost(payload: PostPayload, status: 'published' | 'draft') {
  const {
    title,
    content,
    excerpt,
    category,
    tags = [],
    cover_image_url = '',
    cover_image_prompt = '',
    source_urls = [],
    auto_generated = false,
  } = payload

  // Generate unique slug
  let baseSlug = slugify(title)
  let slug = baseSlug
  let suffix = 2

  while (true) {
    const { data: existing } = await supabaseAdmin
      .from('posts')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (!existing) break
    slug = `${baseSlug}-${suffix}`
    suffix++
  }

  const { data, error } = await supabaseAdmin
    .from('posts')
    .insert({
      title,
      slug,
      content,
      excerpt,
      category,
      tags,
      cover_image_url,
      cover_image_prompt,
      source_urls,
      status,
      auto_generated,
      published_at: status === 'published' ? new Date().toISOString() : null,
    })
    .select('id, slug')
    .single()

  if (error) throw error

  return { post_id: data.id, slug: data.slug }
}
