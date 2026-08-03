import Link from 'next/link'
import { getPublishedCounts, getStatusCounts, getPendingStatusCounts, getRecentPublished, getPendingPosts, gateForContent } from '@/lib/adminData'
import { StatCard, Badge, SectionCard } from '@/components/admin/AdminUI'
import type { AdminPendingPost } from '@/lib/adminData'

const CATEGORY_LABELS: Record<string, string> = {
  anthropic: 'Anthropic',
  'ai-models': 'AI Models',
  industry: 'Industry',
  tools: 'Tools',
  ai: 'AI Trends',
}

function pendingGateBadge(row: AdminPendingPost) {
  const gate = gateForContent(row.content)
  return gate.pass
    ? <Badge tone="green">gate OK</Badge>
    : <Badge tone="red">gate fail</Badge>
}

export default async function AdminOverviewPage() {
  const [statusCounts, pendingCounts, publishedByCat, recentPublished, recentPending] = await Promise.all([
    getStatusCounts(),
    getPendingStatusCounts(),
    getPublishedCounts(),
    getRecentPublished(8),
    getPendingPosts(10),
  ])

  const catTotal = Object.values(publishedByCat).reduce((a, b) => a + b, 0)

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', margin: '0 0 4px', fontWeight: 700 }}>Overview</h1>
      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0 0 24px' }}>
        Live state of the AITrends.ng publishing pipeline.
      </p>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
        <StatCard label="Published posts" value={statusCounts.published} href="/admin/posts" color="var(--blue)" />
        <StatCard label="Drafts" value={statusCounts.draft} href="/admin/posts?status=draft" />
        <StatCard label="Queue · pending" value={pendingCounts.pending_image ?? 0} href="/admin/pending" color="var(--gold)" />
        <StatCard label="Queue · generating" value={pendingCounts.generating ?? 0} href="/admin/pending?status=generating" color="var(--gold)" />
        <StatCard label="Queue · failed" value={pendingCounts.failed ?? 0} href="/admin/pending?status=failed" color="#f87171" />
        <StatCard label="Queue · published" value={pendingCounts.published ?? 0} href="/admin/pending?status=published" />
      </div>

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 28 }}>
        {Object.entries(CATEGORY_LABELS).map(([slug, label]) => (
          <StatCard key={slug} label={label} value={publishedByCat[slug] ?? 0} href={`/category/${slug}`} color={catTotal ? 'var(--blue)' : undefined} />
        ))}
      </div>

      <SectionCard title="Latest published posts" action={<Link href="/admin/posts" style={{ color: 'var(--blue)', fontSize: '0.8rem' }}>View all →</Link>}>
        {recentPublished.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No published posts yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
            <thead>
              <tr style={{ color: 'var(--muted)', textAlign: 'left' }}>
                <th style={{ padding: '6px 10px 6px 0', borderBottom: '1px solid var(--border)' }}>Title</th>
                <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>Category</th>
                <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>Published</th>
              </tr>
            </thead>
            <tbody>
              {recentPublished.map((post) => (
                <tr key={post.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px 10px 8px 0' }}>
                    <Link href={`/admin/posts/${post.id}`} style={{ color: 'var(--text)', textDecoration: 'none' }} className="link-hover-glow">
                      {post.title}
                    </Link>
                  </td>
                  <td style={{ padding: '8px 10px' }}>{CATEGORY_LABELS[post.category] ?? post.category}</td>
                  <td style={{ padding: '8px 10px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {post.published_at ? new Date(post.published_at).toISOString().slice(0, 16).replace('T', ' ') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionCard>

      <SectionCard title="Pending queue (recent)" action={<Link href="/admin/pending" style={{ color: 'var(--blue)', fontSize: '0.8rem' }}>View queue →</Link>}>
        {recentPending.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Queue is empty.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.83rem' }}>
            <thead>
              <tr style={{ color: 'var(--muted)', textAlign: 'left' }}>
                <th style={{ padding: '6px 10px 6px 0', borderBottom: '1px solid var(--border)' }}>Title</th>
                <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>Status</th>
                <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>Provider</th>
                <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>Attempts</th>
                <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>Gate</th>
              </tr>
            </thead>
            <tbody>
              {recentPending.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px 10px 8px 0' }}>
                    <Link href={`/admin/pending/${row.id}`} style={{ color: 'var(--text)', textDecoration: 'none' }} className="link-hover-glow">
                      #{row.id} · {row.title}
                    </Link>
                  </td>
                  <td style={{ padding: '8px 10px' }}>
                    <Badge tone={row.status === 'failed' ? 'red' : row.status === 'pending_image' ? 'gold' : row.status === 'published' ? 'green' : 'blue'}>
                      {row.status}
                    </Badge>
                  </td>
                  <td style={{ padding: '8px 10px', color: 'var(--muted)' }}>{row.provider ?? '—'}</td>
                  <td style={{ padding: '8px 10px', color: 'var(--muted)' }}>{row.attempts}</td>
                  <td style={{ padding: '8px 10px' }}>{pendingGateBadge(row)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionCard>
    </div>
  )
}
