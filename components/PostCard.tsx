'use client'

import Link from 'next/link'
import Image from 'next/image'
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
        {post.cover_image_url ? (
          <div style={{ position: 'relative', aspectRatio: '16/9', width: '100%', background: '#0d1117' }}>
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div
            style={{
              aspectRatio: '16/9',
              background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: 'var(--muted)', fontSize: '2rem' }}>⚡</span>
          </div>
        )}

        <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CategoryBadge category={post.category} />
            {post.auto_generated && (
              <span style={{ fontSize: '0.65rem', color: 'var(--muted)', letterSpacing: '0.04em' }}>
                · AI digest
              </span>
            )}
          </div>

          <h3
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
