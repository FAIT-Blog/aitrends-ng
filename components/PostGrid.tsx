'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import PostCard from './PostCard'
import type { Post } from '@/lib/types'

const PAGE_SIZE = 9

export default function PostGrid({ posts }: { posts: Post[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const hasMore = visible < posts.length

  const loadMore = useCallback(() => {
    setVisible(v => Math.min(v + PAGE_SIZE, posts.length))
  }, [posts.length])

  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      // 300px lookahead — triggers before the sentinel is visible so cards
      // appear before the user reaches the bottom. Feels seamless on mobile
      // where finger-flick scrolling covers large distances quickly.
      { rootMargin: '300px' }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

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

      {/* Sentinel — zero-height element watched by IntersectionObserver.
          Only rendered when more posts remain so the observer is disconnected
          once everything is loaded, freeing resources. */}
      {hasMore && (
        <div ref={sentinelRef} style={{ height: 1, marginTop: 48 }} aria-hidden="true" />
      )}

      {!hasMore && posts.length > PAGE_SIZE && (
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
