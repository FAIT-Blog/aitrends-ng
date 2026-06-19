export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Post } from '@/lib/types'
import PostGrid from '@/components/PostGrid'
import Sidebar from '@/components/Sidebar'

interface Props {
  params: Promise<{ slug: string }>
}

const CATEGORY_META: Record<string, { label: string; description: string }> = {
  anthropic: {
    label: 'Anthropic',
    description: 'All coverage on Anthropic: Claude updates, company news, safety research, and product releases.',
  },
  'ai-models': {
    label: 'AI Models',
    description: 'Deep dives on the frontier models — GPT, Gemini, Mistral, Llama, and what they mean for builders.',
  },
  industry: {
    label: 'Industry',
    description: 'Business moves, funding rounds, partnerships, and the politics shaping the AI industry.',
  },
  tools: {
    label: 'Tools',
    description: 'Developer tools, APIs, SDKs, and products powered by AI that are worth your attention.',
  },
  ai: {
    label: 'AI Trends',
    description: 'Long-form AI conversations and podcast episodes — distilled into structured briefings for builders.',
  },
}

const VALID = Object.keys(CATEGORY_META)

async function getPosts(category: string): Promise<Post[]> {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', category)
    .order('published_at', { ascending: false })
    .limit(50)
  return (data as Post[]) ?? []
}

async function getCategoryCounts(): Promise<Record<string, number>> {
  const { data } = await supabase.from('posts').select('category').eq('status', 'published')
  if (!data) return {}
  return data.reduce<Record<string, number>>((acc, row) => {
    acc[row.category] = (acc[row.category] ?? 0) + 1
    return acc
  }, {})
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const meta = CATEGORY_META[slug]
  if (!meta) return {}
  return {
    title: `${meta.label} — AITrends.ng`,
    description: meta.description,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  if (!VALID.includes(slug)) notFound()

  const meta = CATEGORY_META[slug]
  const [posts, categoryCounts] = await Promise.all([getPosts(slug), getCategoryCounts()])

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', marginBottom: 8 }}>
          <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
          {' / '}
          <span style={{ color: 'var(--text)' }}>{meta.label}</span>
        </div>
        <h1
          style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 700,
            fontSize: '2rem',
            color: '#fff',
            marginBottom: 10,
          }}
        >
          {meta.label}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', maxWidth: 600 }}>{meta.description}</p>
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem', marginTop: 8 }}>
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 40, alignItems: 'start' }}>
        <PostGrid posts={posts} />
        <Sidebar recentPosts={posts} categoryCounts={categoryCounts} />
      </div>
    </div>
  )
}
