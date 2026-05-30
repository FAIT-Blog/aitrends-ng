'use client'

import { useState } from 'react'
import PostCard from './PostCard'
import type { Post } from '@/lib/types'

const PAGE_SIZE = 9

export default function PostGrid({ posts }: { posts: Post[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE)

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
        {posts.slice(0, visible).map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {visible < posts.length && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              padding: '10px 28px',
              borderRadius: 8,
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--blue)')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--border)')}
          >
            Load more ({posts.length - visible} remaining)
          </button>
        </div>
      )}
    </div>
  )
}
