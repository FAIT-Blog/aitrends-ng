import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { gateForContent } from '@/lib/adminData'
import { Badge, SectionCard, MetaRow } from '@/components/admin/AdminUI'
import PendingActions from '@/components/admin/PendingActions'

export default async function AdminPendingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const numericId = Number(id)
  if (!Number.isFinite(numericId)) notFound()

  const { data: row } = await supabaseAdmin
    .from('pending_posts')
    .select('*')
    .eq('id', numericId)
    .single()

  if (!row) notFound()

  const gate = gateForContent(row.content)
  const tags: string[] = Array.isArray(row.tags) ? (row.tags as string[]) : []
  const sources: string[] = Array.isArray(row.source_urls) ? (row.source_urls as string[]) : []

  return (
    <div>
      <p style={{ margin: '0 0 8px' }}>
        <Link href="/admin/pending" style={{ color: 'var(--blue)', fontSize: '0.8rem' }}>← Back to queue</Link>
      </p>
      <h1 style={{ fontSize: '1.3rem', margin: '0 0 4px', fontWeight: 700, lineHeight: 1.35 }}>#{row.id} · {row.title}</h1>
      <div style={{ display: 'flex', gap: 8, margin: '10px 0 20px', flexWrap: 'wrap' }}>
        <Badge tone={row.status === 'failed' ? 'red' : row.status === 'pending_image' ? 'gold' : row.status === 'published' ? 'green' : 'blue'}>{row.status}</Badge>
        {row.category && <Badge tone="blue">{row.category}</Badge>}
        {row.provider && <Badge>{row.provider}</Badge>}
      </div>

      <SectionCard
        title="Quality gate"
        action={<PendingActions id={row.id} gatePass={gate.pass} />}
      >
        {gate.pass ? (
          <p style={{ color: '#34d399', fontSize: '0.85rem', margin: 0 }}>
            PASS — {gate.wordCount} words, h3 present, &quot;Why This Matters&quot; present. Retry will reset this row
            to <code>pending_image</code> for the next Phase 2 run.
          </p>
        ) : (
          <div style={{ fontSize: '0.85rem' }}>
            <p style={{ color: '#f87171', margin: '0 0 6px' }}>
              FAIL — {gate.wordCount} words. This content cannot pass the publish gate, so Retry is disabled
              (it would just fail again at Phase 2). Delete it, or re-queue from Scout Phase 1.            </p>
            <ul style={{ margin: 0, paddingLeft: 20, color: 'var(--muted)' }}>
              {gate.reasons.map((r) => <li key={r} style={{ marginBottom: 4 }}>{r}</li>)}
            </ul>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Meta">
        <MetaRow label="Attempts" value={row.attempts} />
        <MetaRow label="Provider" value={row.provider ?? '—'} />
        <MetaRow label="Image job ID" value={row.image_job_id ? <code style={{ fontSize: '0.72rem' }}>{row.image_job_id}</code> : '—'} />
        <MetaRow label="Post ID" value={row.post_id ? <code style={{ fontSize: '0.72rem' }}>{row.post_id}</code> : '—'} />
        <MetaRow label="Created" value={formatDate(row.created_at)} />
        <MetaRow label="Updated" value={formatDate(row.updated_at)} />
      </SectionCard>

      {row.image_prompt && (
        <SectionCard title="Image prompt">
          <p style={{ color: 'var(--muted)', fontSize: '0.82rem', margin: 0, lineHeight: 1.7 }}>{row.image_prompt}</p>
        </SectionCard>
      )}

      {tags.length > 0 && (
        <SectionCard title="Tags">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {tags.map((t) => <Badge key={t}>{t}</Badge>)}
          </div>
        </SectionCard>
      )}

      {sources.length > 0 && (
        <SectionCard title="Source URLs">
          <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.8rem' }}>
            {sources.map((u) => (
              <li key={u} style={{ marginBottom: 6 }}>
                <a href={u} target="_blank" rel="noopener noreferrer nofollow" style={{ color: 'var(--blue)', wordBreak: 'break-all' }}>{u}</a>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {row.excerpt && (
        <SectionCard title="Excerpt">
          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: 0, lineHeight: 1.7 }}>{row.excerpt}</p>
        </SectionCard>
      )}

      <SectionCard title="Stored content">
        <div className="prose" dangerouslySetInnerHTML={{ __html: row.content || '<p>—</p>' }} />
      </SectionCard>
    </div>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 16).replace('T', ' ')
}
