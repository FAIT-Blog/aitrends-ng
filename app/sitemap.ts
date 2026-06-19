export const dynamic = 'force-dynamic'

import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const SITE_URL = 'https://www.aitrends.ng'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: posts } = await supabase
    .from('posts')
    .select('slug, published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'hourly', priority: 1 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/category/anthropic`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/category/ai-models`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/category/industry`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/category/tools`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/category/ai`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
  ]

  const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
    url: `${SITE_URL}/post/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : new Date(),
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  return [...staticRoutes, ...postRoutes]
}
