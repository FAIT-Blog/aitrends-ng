export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Post } from '@/lib/types'
import CategoryBadge from '@/components/CategoryBadge'
import ShareButtons from '@/components/ShareButtons'

interface Props {
  params: Promise<{ slug: string }>
}

async function getPost(slug: string): Promise<Post | null> {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  return (data as Post) ?? null
}

async function getRelated(category: string, excludeId: string): Promise<Post[]> {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', category)
    .neq('id', excludeId)
    .order('published_at', { ascending: false })
    .limit(3)
  return (data as Post[]) ?? []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  const url = `https://aitrends.ng/post/${post.slug}`
  return {
    title: `${post.title} — AITrends.ng`,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.cover_image_url
        ? [{ url: post.cover_image_url, alt: post.title }]
        : [],
      url,
      type: 'article',
      publishedTime: post.published_at ?? undefined,
      tags: post.tags ?? [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.cover_image_url ? [post.cover_image_url] : [],
    },
  }
}

function formatDate(iso: string | null) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })
}

function readTime(content: string) {
  return Math.max(1, Math.round(content.replace(/<[^>]+>/g, '').split(/\s+/).length / 200))
}

function wasUpdated(published: string | null, updated: string | null | undefined): boolean {
  if (!published || !updated) return false
  return (new Date(updated).getTime() - new Date(published).getTime()) > 86_400_000
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const related = await getRelated(post.category, post.id)
  const postUrl = `https://aitrends.ng/post/${post.slug}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image_url || undefined,
    datePublished: post.published_at || undefined,
    dateModified: post.updated_at || post.published_at || undefined,
    author: { '@type': 'Organization', name: 'AITrends.ng', url: 'https://aitrends.ng' },
    publisher: {
      '@type': 'Organization',
      name: 'AITrends.ng',
      url: 'https://aitrends.ng',
      logo: { '@type': 'ImageObject', url: 'https://aitrends.ng/logo.png' },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    keywords: post.tags?.join(', ') || post.category,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px 80px' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24, fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', gap: 6, alignItems: 'center' }}>
        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link href={`/category/${post.category}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>
          {post.category}
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 300 }}>
          {post.title}
        </span>
      </div>

      {/* Cover image */}
      {post.cover_image_url && (
        <div style={{ position: 'relative', aspectRatio: '16/9', marginBottom: 36, borderRadius: 12, overflow: 'hidden' }}>
          <Image
            src={post.cover_image_url}
            alt={post.cover_image_prompt || post.title}
            fill
            priority
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 800px) 100vw, 800px"
          />
        </div>
      )}

      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <CategoryBadge category={post.category} />
        <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Published {formatDate(post.published_at)}</span>
        {wasUpdated(post.published_at, post.updated_at) && (
          <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>· Updated {formatDate(post.updated_at ?? null)}</span>
        )}
        <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{readTime(post.content)} min read</span>
        {post.auto_generated && (
          <span
            style={{
              background: '#1c1917',
              color: '#a16207',
              fontSize: '0.68rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            AI Generated
          </span>
        )}
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: 'Sora, sans-serif',
          fontWeight: 700,
          fontSize: '2rem',
          color: '#fff',
          lineHeight: 1.25,
          marginBottom: 32,
        }}
      >
        {post.title}
      </h1>

      {/* Body */}
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.content }}
        style={{ marginBottom: 40 }}
      />

      {/* Tags */}
      {post.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 32 }}>
          {post.tags.map((tag) => (
            <span
              key={tag}
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                color: 'var(--muted)',
                fontSize: '0.72rem',
                padding: '3px 10px',
                borderRadius: 20,
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Sources */}
      {post.source_urls.length > 0 && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '16px 20px',
            marginBottom: 40,
          }}
        >
          <p style={{ fontSize: '0.78rem', color: 'var(--muted)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            This digest was compiled from:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {post.source_urls.map((url) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener noreferrer nofollow" style={{ color: 'var(--blue)', fontSize: '0.8rem', wordBreak: 'break-all' }}>
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Share */}
      <ShareButtons url={postUrl} title={post.title} />

      {/* People Also Ask — related posts as internal hyperlinks */}
      {related.length > 0 && (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '20px 24px',
            marginBottom: 40,
          }}
        >
          <p
            style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.09em',
              marginBottom: 16,
              margin: '0 0 16px',
            }}
          >
            People Also Ask
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {related.map((p, i) => (
              <li
                key={p.id}
                style={{
                  borderBottom: i < related.length - 1 ? '1px solid var(--border)' : 'none',
                  paddingBottom: i < related.length - 1 ? 14 : 0,
                  marginBottom: i < related.length - 1 ? 14 : 0,
                }}
              >
                <Link
                  href={`/post/${p.slug}`}
                  style={{
                    color: 'var(--blue)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.92rem',
                    lineHeight: 1.45,
                    display: 'block',
                    marginBottom: p.excerpt ? 4 : 0,
                  }}
                >
                  {p.title}
                </Link>
                {p.excerpt && (
                  <p style={{ color: 'var(--muted)', fontSize: '0.78rem', margin: 0, lineHeight: 1.5 }}>
                    {p.excerpt}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </>
  )
}
