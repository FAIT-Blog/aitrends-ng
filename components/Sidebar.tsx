import Link from 'next/link'
import type { Post } from '@/lib/types'

const CATEGORIES = [
  { slug: 'anthropic', label: 'Anthropic' },
  { slug: 'ai-models', label: 'AI Models' },
  { slug: 'industry', label: 'Industry' },
  { slug: 'tools', label: 'Tools' },
]

interface SidebarProps {
  recentPosts: Post[]
  categoryCounts: Record<string, number>
}

export default function Sidebar({ recentPosts, categoryCounts }: SidebarProps) {
  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 36 }}>
      {/* About blurb */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '20px 22px',
        }}
      >
        <h3
          style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 700,
            fontSize: '0.88rem',
            color: 'var(--blue)',
            marginBottom: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          About AITrends.ng
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: 1.7 }}>
          Daily AI news digests for African builders and developers. Every story sourced, rewritten,
          and published automatically — so you never miss what matters in Claude, Anthropic, and the
          broader AI model ecosystem.
        </p>
        <Link
          href="/about"
          style={{ color: 'var(--blue)', fontSize: '0.78rem', fontWeight: 600, marginTop: 8, display: 'inline-block' }}
        >
          Learn how it works →
        </Link>
      </div>

      {/* Categories */}
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '20px 22px',
        }}
      >
        <h3
          style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 700,
            fontSize: '0.88rem',
            color: 'var(--blue)',
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          Categories
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {CATEGORIES.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/category/${cat.slug}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '7px 0',
                  borderBottom: '1px solid var(--border)',
                  color: 'var(--text)',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                }}
              >
                <span>{cat.label}</span>
                <span style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
                  {categoryCounts[cat.slug] ?? 0}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent posts */}
      {recentPosts.length > 0 && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '20px 22px',
          }}
        >
          <h3
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: '0.88rem',
              color: 'var(--blue)',
              marginBottom: 12,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Latest Posts
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {recentPosts.slice(0, 5).map((post) => (
              <li key={post.id}>
                <Link
                  href={`/post/${post.slug}`}
                  style={{
                    display: '-webkit-box',
                    padding: '8px 0',
                    borderBottom: '1px solid var(--border)',
                    color: 'var(--text)',
                    textDecoration: 'none',
                    fontSize: '0.82rem',
                    lineHeight: 1.45,
                    overflow: 'hidden',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  } as React.CSSProperties}
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}
