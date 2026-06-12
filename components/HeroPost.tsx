'use client'
import Link from 'next/link'
import CategoryBadge from './CategoryBadge'
import type { Post } from '@/lib/types'

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function HeroPost({ post }: { post: Post }) {
  return (
    <Link href={`/post/${post.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <article
        className="hero-article"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          overflow: 'hidden',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          minHeight: 360,
          transition: 'box-shadow 0.15s',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(37,99,235,0.15)'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = 'none'
        }}
      >
        <div
          className="hero-image"
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt={post.title}
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
          )}
          {!post.cover_image_url && (
            <span style={{ fontSize: '4rem' }}>⚡</span>
          )}
        </div>

        <div
          className="hero-text"
          style={{
            padding: '36px 40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CategoryBadge category={post.category} />
            <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
              {formatDate(post.published_at)}
            </span>
          </div>

          <h2
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: '1.5rem',
              color: '#fff',
              lineHeight: 1.3,
              margin: 0,
            }}
          >
            {post.title}
          </h2>

          <p
            style={{
              color: '#9ca3af',
              fontSize: '0.9rem',
              lineHeight: 1.65,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {post.excerpt}
          </p>

          <span
            className="read-more"
            style={{
              color: 'var(--blue)',
              fontSize: '0.82rem',
              fontWeight: 600,
              marginTop: 4,
              transition: 'color 0.18s, text-shadow 0.18s',
            }}
          >
            Read digest →
          </span>
        </div>
      </article>
    </Link>
  )
}
