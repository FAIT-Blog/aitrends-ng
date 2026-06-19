'use client'

import Link from 'next/link'
import CategoryBadge from './CategoryBadge'
import type { Post } from '@/lib/types'

function readTime(content: string) {
  const words = content.replace(/<[^>]+>/g, '').split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/post/${post.slug}`} style={{ textDecoration: 'none' }}>
      <article
        className="post-card"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
          transition: 'transform 0.15s, box-shadow 0.15s',
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translateY(-3px)'
          el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)'
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLElement
          el.style.transform = 'translateY(0)'
          el.style.boxShadow = 'none'
        }}
      >
        <div
          style={{
            position: 'relative',
            aspectRatio: '16/9',
            width: '100%',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {post.cover_image_url ? (
            <img
              src={post.cover_image_url}
              alt={post.cover_image_prompt || post.title}
              loading="lazy"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <span style={{ color: 'var(--muted)', fontSize: '2rem' }}>⚡</span>
          )}
        </div>

        <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CategoryBadge category={post.category} />
          </div>

          <h3
            className="post-title"
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: '0.95rem',
              color: '#fff',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              margin: 0,
              transition: 'color 0.18s, text-shadow 0.18s',
            }}
          >
            {post.title}
          </h3>

          <p
            style={{
              color: 'var(--muted)',
              fontSize: '0.82rem',
              lineHeight: 1.55,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              margin: 0,
              flex: 1,
            }}
          >
            {post.excerpt}
          </p>

          <div style={{ display: 'flex', gap: 12, fontSize: '0.72rem', color: 'var(--muted)', marginTop: 4 }}>
            <span>{formatDate(post.published_at)}</span>
            <span>{readTime(post.content)} min read</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
