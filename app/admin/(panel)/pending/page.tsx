import Link from 'next/link'
import { getPendingPosts, gateForContent } from '@/lib/adminData'
import { Badge, SectionCard } from '@/components/admin/AdminUI'

interface SearchParams {
  status?: string
}

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'pending_image', label: 'Pending' },
  { value: 'generating', label: 'Generating' },
  { value: 'failed', label: 'Failed' },
  { value: 'published', label: 'Published' },
]

export default async function AdminPendingPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { status } = await searchParams
  const rows = await getPendingPosts(200, status || undefined)

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', margin: '0 0 4px', fontWeight: 700 }}>Pending Queue</h1>
      <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0 0 20px' }}>
        Rows in the <code>pending_posts</code> pipeline. Failed posts need review before retry.
      </p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {STATUS_FILTERS.map((f) => {
          const active = (status ?? '') === f.value
          return (
            <Link
              key={f.value || 'all'}
              href={f.value ? `/admin/pending?status=${f.value}` : '/admin/pending'}
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
              {f.label}
            </Link>
          )
        })}
      </div>

      <SectionCard title={`${rows.length} rows`}>
        {rows.length === 0 ? (
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No rows in this state.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ color: 'var(--muted)', textAlign: 'left' }}>
                <th style={{ padding: '6px 10px 6px 0', borderBottom: '1px solid var(--border)' }}>ID / Title</th>
                <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>Category</th>
                <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>Status</th>
                <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>Provider</th>
                <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>Attempts</th>
                <th style={{ padding: '6px 10px', borderBottom: '1px solid var(--border)' }}>Gate</th>
                <th style={{ padding: '6px 0 6px 10px', borderBottom: '1px solid var(--border)' }}>Updated</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const gate = gateForContent(row.content)
                return (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '8px 10px 8px 0' }}>
                      <Link href={`/admin/pending/${row.id}`} style={{ color: 'var(--text)', textDecoration: 'none' }} className="link-hover-glow">
                        #{row.id} · {row.title}
                      </Link>
                    </td>
                    <td style={{ padding: '8px 10px' }}>{row.category ?? '—'}</td>
                    <td style={{ padding: '8px 10px' }}>
                      <Badge tone={row.status === 'failed' ? 'red' : row.status === 'pending_image' ? 'gold' : row.status === 'published' ? 'green' : 'blue'}>
                        {row.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '8px 10px', color: 'var(--muted)' }}>{row.provider ?? '—'}</td>
                    <td style={{ padding: '8px 10px', color: 'var(--muted)' }}>{row.attempts}</td>
                    <td style={{ padding: '8px 10px' }}>
                      {gate.pass ? <Badge tone="green">OK</Badge> : <Badge tone="red">fail</Badge>}
                    </td>
                    <td style={{ padding: '8px 0 8px 10px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {new Date(row.updated_at).toISOString().slice(0, 16).replace('T', ' ')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </SectionCard>
    </div>
  )
}
