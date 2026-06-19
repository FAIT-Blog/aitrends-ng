export const dynamic = 'force-dynamic'

import { supabase } from '@/lib/supabase'
import type { Post } from '@/lib/types'
import HeroPost from '@/components/HeroPost'
import PostGrid from '@/components/PostGrid'
import Sidebar from '@/components/Sidebar'
import Link from 'next/link'

const CATEGORIES = [
  { label: 'All', href: '/' },
  { label: 'Anthropic', href: '/category/anthropic' },
  { label: 'AI Models', href: '/category/ai-models' },
  { label: 'Industry', href: '/category/industry' },
  { label: 'Tools', href: '/category/tools' },
  { label: 'AI Trends', href: '/category/ai' },
]

async function getPosts(): Promise<Post[]> {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(50)
  return (data as Post[]) ?? []
}

async function getCategoryCounts(): Promise<Record<string, number>> {
  const { data } = await supabase
    .from('posts')
    .select('category')
    .eq('status', 'published')

  if (!data) return {}
  return data.reduce<Record<string, number>>((acc, row) => {
    acc[row.category] = (acc[row.category] ?? 0) + 1
    return acc
  }, {})
}

export default async function HomePage() {
  const [posts, categoryCounts] = await Promise.all([getPosts(), getCategoryCounts()])

  const heroPost = posts[0] ?? null
  const gridPosts = posts.slice(1)

  const today = new Date().toLocaleDateString('en-NG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      {/* Page header */}
      <div style={{ marginBottom: 36 }}>
        <h1
          style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 700,
            fontSize: '2rem',
            color: '#fff',
            marginBottom: 6,
          }}
        >
          Today in AI
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{today}</p>
      </div>

      {/* Category filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 36, flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.href}
            href={cat.href}
            style={{
              padding: '6px 16px',
              borderRadius: 20,
              fontSize: '0.82rem',
              fontWeight: 600,
              background: cat.href === '/' ? 'var(--blue)' : 'var(--surface)',
              border: `1px solid ${cat.href === '/' ? 'var(--blue)' : 'var(--border)'}`,
              color: cat.href === '/' ? '#fff' : 'var(--muted)',
              textDecoration: 'none',
            }}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Hero + main layout */}
      {heroPost && (
        <div style={{ marginBottom: 40 }}>
          <HeroPost post={heroPost} />
        </div>
      )}

      {/* Grid + sidebar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: 40,
          alignItems: 'start',
        }}
      >
        <PostGrid posts={gridPosts} />
        <Sidebar recentPosts={posts} categoryCounts={categoryCounts} />
      </div>
    </div>
  )
}
