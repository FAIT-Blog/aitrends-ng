import Link from 'next/link'
import { getAllPosts } from '@/lib/adminData'
import { Badge, SectionCard } from '@/components/admin/AdminUI'
import PostActions from '@/components/admin/PostActions'

const CATEGORY_LABELS: Record<string, string> = {
  anthropic: 'Anthropic',
  'ai-models': 'AI Models',
  industry: 'Industry',
  tools: 'Tools',
  ai: 'AI Trends',
}

interface SearchParams {
  status?: string
}

export default async function AdminPostsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { status } = await searchParams
  const posts = await getAllPosts(200, status === 'draft' ? 'draft' : status === 'published' ? 'published' : undefined)

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', margin: '0 0 4px', fontWeight: 700 }}>Published Posts</h1>
      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0 0 20px' }}>
        {status === 'draft' ? 'Draft posts only.' : status === 'published' ? 'Published posts only.' : 'All posts (latest first).'}
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        <FilterLink active={!status} href="/admin/posts" label="All" />
        <FilterLink active={status === 'published'} href="/admin/posts?status=published" label="Published" />
        <FilterLink active={status === 'draft'} href="/admin/posts?status=draft" label="Drafts" />
      </div>

      <SectionCard title={`${posts.length} posts`}>
        {posts.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No posts found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ color: 'var(--muted)', textAlign: 'left' }}>
                <th style={{ padding: '6px 10px 6px 0', borderBottom: '1px solid var(--border)' }}>Title</th>
                <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>Category</th>
                <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>Status</th>
                <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>Source</th>
                <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>Published</th>
                <th style={{ padding: '6px 0 6px 10px', borderBottom: '1px solid var(--border)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px 10px 8px 0' }}>
                    <Link href={`/admin/posts/${post.id}`} style={{ color: 'var(--text)', textDecoration: 'none' }} className="link-hover-glow">
                      {post.title}
                    </Link>
                  </td>
                  <td style={{ padding: '8px 10px' }}>{CATEGORY_LABELS[post.category] ?? post.category}</td>
                  <td style={{ padding: '8px 10px' }}>
                    <Badge tone={post.status === 'published' ? 'green' : 'muted'}>{post.status}</Badge>
                  </td>
                  <td style={{ padding: '8px 10px', color: 'var(--muted)' }}>{post.auto_generated ? 'Scout' : 'Manual'}</td>
                  <td style={{ padding: '8px 10px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {post.published_at ? new Date(post.published_at).toISOString().slice(0, 16).replace('T', ' ') : '—'}
                  </td>
                  <td style={{ padding: '8px 0 8px 10px', whiteSpace: 'nowrap' }}>
                    <PostActions postId={post.id} status={post.status} slug={post.slug} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionCard>
    </div>
  )
}

function FilterLink({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      style={{
        padding: '5px 12px',
        borderRadius: 6,
        fontSize: '0.8rem',
        fontWeight: 500,
        color: active ? '#fff' : 'var(--muted)',
        background: active ? 'var(--blue)' : 'transparent',
        border: '1px solid' + (active ? 'var(--blue)' : 'var(--border)'),
        textDecoration: 'none',
      }}
    >
      {label}
    </Link>
  )
}
