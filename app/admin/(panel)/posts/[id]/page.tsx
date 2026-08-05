import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabaseAdmin } from '@/lib/supabase'
import { Badge, SectionCard, MetaRow } from '@/components/admin/AdminUI'
import PostActions from '@/components/admin/PostActions'

const CATEGORY_LABELS: Record<string, string> = {
  anthropic: 'Anthropic',
  'ai-models': 'AI Models',
  industry: 'Industry',
  tools: 'Tools',
  ai: 'AI Trends',
}

export default async function AdminPostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { data: post } = await supabaseAdmin
    .from('posts')
    .select('*')
    .eq('id', id)
    .single()

  if (!post) notFound()

  const tags: string[] = Array.isArray(post.tags) ? (post.tags as string[]) : []
  const sources: string[] = Array.isArray(post.source_urls) ? (post.source_urls as string[]) : []

  return (
    <div>
      <p style={{ margin: '0 0 8px' }}>
        <Link href="/admin/posts" style={{ color: 'var(--blue)', fontSize: '0.8rem' }}>← Back to posts</Link>
      </p>
      <h1 style={{ fontSize: '1.35rem', margin: '0 0 4px', fontWeight: 700, lineHeight: 1.35 }}>{post.title}</h1>
      <div style={{ display: 'flex', gap: 8, margin: '10px 0 20px', flexWrap: 'wrap' }}>
        <Badge tone="green">{post.status}</Badge>
        <Badge tone="blue">{CATEGORY_LABELS[post.category] ?? post.category}</Badge>
        {post.auto_generated && <Badge tone="gold">Scout auto</Badge>}
      </div>

      <SectionCard
        title="Actions"
        action={
          <PostActions postId={post.id} status={post.status} slug={post.slug} redirectAfterDelete />
        }
      >
        <p style={{ color: 'var(--muted)', fontSize: '0.8rem', margin: 0 }}>
          Unpublish hides the post from the site (keeps the row). Delete removes it permanently —
          sitemap and feed regenerate automatically.
        </p>
      </SectionCard>

      <SectionCard title="Meta">
        <MetaRow label="Slug" value={<code style={{ color: 'var(--blue)' }}>{post.slug}</code>} />
        <MetaRow label="Created" value={formatDate(post.created_at)} />
        <MetaRow label="Published" value={post.published_at ? formatDate(post.published_at) : '—'} />
        <MetaRow label="Updated" value={post.updated_at ? formatDate(post.updated_at) : '—'} />
        <MetaRow label="ID" value={<code style={{ fontSize: '0.72rem', color: 'var(--muted)' }}>{post.id}</code>} />
      </SectionCard>

      {post.cover_image_url && (
        <SectionCard title="Cover image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image_url}
            alt={post.cover_image_prompt || post.title}
            style={{ maxWidth: '100%', borderRadius: 8, display: 'block' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          {post.cover_image_prompt && (
            <p style={{ color: 'var(--muted)', fontSize: '0.78rem', margin: '10px 0 0', lineHeight: 1.6 }}>
              <strong>Prompt:</strong> {post.cover_image_prompt}
            </p>
          )}
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

      <SectionCard title="Excerpt">
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', margin: 0, lineHeight: 1.7 }}>{post.excerpt || '—'}</p>
      </SectionCard>

      <SectionCard title="Content">
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.content }} />
      </SectionCard>
    </div>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toISOString().slice(0, 16).replace('T', ' ')
}
