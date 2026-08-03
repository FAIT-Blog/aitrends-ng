'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  postId: string
  status: 'published' | 'draft'
  slug: string
}

export default function PostActions({ postId, status, slug }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function run(action: 'toggle' | 'delete') {
    if (busy) return
    if (action === 'delete' && !window.confirm('Delete this post permanently? This cannot be undone.')) return
    setBusy(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, {
        method: action === 'toggle' ? 'PATCH' : 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: action === 'toggle' ? JSON.stringify({ status: status === 'published' ? 'draft' : 'published' }) : undefined,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError((data as { error?: string }).error || 'Request failed')
      } else {
        router.refresh()
      }
    } catch {
      setError('Network error')
    } finally {
      setBusy(false)
    }
  }

  return (
    <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
      <a href={`/post/${slug}`} target="_blank" rel="noreferrer" style={{ color: 'var(--blue)', fontSize: '0.78rem' }}>View</a>
      <button
        type="button"
        onClick={() => run('toggle')}
        disabled={busy}
        style={{ ...btnStyle, color: 'var(--gold)' }}
      >
        {status === 'published' ? 'Unpublish' : 'Publish'}
      </button>
      <button
        type="button"
        onClick={() => run('delete')}
        disabled={busy}
        style={{ ...btnStyle, color: '#f87171' }}
      >
        Delete
      </button>
      {error && <span style={{ color: '#f87171', fontSize: '0.72rem' }}>{error}</span>}
    </span>
  )
}

const btnStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid var(--border)',
  borderRadius: 5,
  fontSize: '0.72rem',
  padding: '3px 8px',
  cursor: 'pointer',
}
