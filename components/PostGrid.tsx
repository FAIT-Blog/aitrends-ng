'use client'

import { useState, useCallback } from 'react'
import PostCard from './PostCard'
import type { Post } from '@/lib/types'

const PAGE_SIZE = 50

export default function PostGrid({
  posts: initialPosts,
  category,
}: {
  posts: Post[]
  category?: string
}) {
  const [posts, setPosts] = useState(initialPosts)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState<number | null>(null)

  const hasMore = total === null || posts.length < total

  const loadMore = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        offset: String(posts.length),
        limit: String(PAGE_SIZE),
      })
      if (category) params.set('category', category)

      const res = await fetch(`/api/posts/list?${params}`)
      const data = await res.json()
      if (data.posts) {
        setPosts(prev => [...prev, ...data.posts])
        setTotal(data.total)
      }
    } catch (err) {
      console.error('Failed to load more posts:', err)
    } finally {
      setLoading(false)
    }
  }, [posts.length, category])

  if (posts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
        <p>No posts yet. Check back soon.</p>
      </div>
    )
  }

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 24,
        }}
      >
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {hasMore && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button
            onClick={loadMore}
            disabled={loading}
            style={{
              padding: '10px 32px',
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: loading ? 'var(--muted)' : 'var(--surface)',
              color: loading ? 'var(--text)' : 'var(--blue)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: loading ? 'default' : 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {!hasMore && posts.length > 50 && (
        <p style={{
          textAlign: 'center',
          marginTop: 48,
          color: 'var(--muted)',
          fontSize: '0.78rem',
          letterSpacing: '0.05em',
        }}>
          — {posts.length} posts loaded —
        </p>
      )}
    </div>
  )
}
