import { supabase } from '@/lib/supabase'
import type { Post } from '@/lib/types'

const SITE_URL = 'https://www.aitrends.ng'

export async function GET() {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(20)

  const posts: Post[] = (data as Post[]) ?? []

  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/post/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/post/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${post.published_at ? new Date(post.published_at).toUTCString() : ''}</pubDate>
      <category><![CDATA[${post.category}]]></category>
      ${post.cover_image_url ? `<enclosure url="${post.cover_image_url}" type="image/jpeg" />` : ''}
    </item>`
    )
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AITrends.ng</title>
    <link>${SITE_URL}</link>
    <description>The African builder's daily briefing on Claude, Anthropic, and the models shaping what's next.</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
