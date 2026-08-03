import { supabaseAdmin } from '@/lib/supabase'
import { passesQualityGate } from '@/lib/qualityGate'

export interface AdminPost {
  id: string
  title: string
  slug: string
  category: string
  status: 'published' | 'draft'
  auto_generated: boolean
  created_at: string
  published_at: string | null
}

export interface AdminPendingPost {
  id: number
  title: string
  category: string
  status: string
  provider: string
  attempts: number
  created_at: string
  updated_at: string
  content?: string
  excerpt?: string
  tags?: string[]
  source_urls?: string[]
  image_prompt?: string
  image_job_id?: string | null
  post_id?: string | null
}

const CATEGORY_SLUGS = ['anthropic', 'ai-models', 'industry', 'tools', 'ai']

export async function getPublishedCounts(): Promise<Record<string, number>> {
  const counts = await Promise.all(
    CATEGORY_SLUGS.map(async (slug) => {
      const { count } = await supabaseAdmin
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published')
        .eq('category', slug)
      return [slug, count ?? 0] as const
    })
  )
  return Object.fromEntries(counts)
}

export async function getStatusCounts(): Promise<{ published: number; draft: number }> {
  const [published, draft] = await Promise.all([
    supabaseAdmin.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
    supabaseAdmin.from('posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
  ])
  return { published: published.count ?? 0, draft: draft.count ?? 0 }
}

export async function getPendingStatusCounts(): Promise<Record<string, number>> {
  const statuses = ['pending_image', 'generating', 'failed', 'published']
  const entries = await Promise.all(
    statuses.map(async (status) => {
      const { count } = await supabaseAdmin
        .from('pending_posts')
        .select('id', { count: 'exact', head: true })
        .eq('status', status)
      return [status, count ?? 0] as const
    })
  )
  return Object.fromEntries(entries)
}

export async function getRecentPublished(limit = 10): Promise<AdminPost[]> {
  const { data } = await supabaseAdmin
    .from('posts')
    .select('id,title,slug,category,status,auto_generated,created_at,published_at')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)
  return (data as AdminPost[]) ?? []
}

export async function getAllPosts(limit = 100, status?: string): Promise<AdminPost[]> {
  let query = supabaseAdmin
    .from('posts')
    .select('id,title,slug,category,status,auto_generated,created_at,published_at')
    .order('published_at', { ascending: false })
    .limit(limit)
  if (status === 'published' || status === 'draft') query = query.eq('status', status)
  const { data } = await query
  return (data as AdminPost[]) ?? []
}

export async function getPendingPosts(limit = 100, status?: string): Promise<AdminPendingPost[]> {
  let query = supabaseAdmin
    .from('pending_posts')
    .select('id,title,category,status,provider,attempts,created_at,updated_at,content,excerpt,tags,source_urls,image_prompt,image_job_id,post_id')
    .order('updated_at', { ascending: false })
    .limit(limit)
  if (status) query = query.eq('status', status)
  const { data } = await query
  return (data as AdminPendingPost[]) ?? []
}

export interface PendingGateStatus {
  pass: boolean
  reasons: string[]
  wordCount: number
}

export function gateForContent(content?: string): PendingGateStatus {
  return passesQualityGate(content ?? '')
}
