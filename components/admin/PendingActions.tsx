'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface Props {
  id: number
  gatePass: boolean
}

export default function PendingActions({ id, gatePass }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function run(action: 'retry' | 'delete') {
    if (busy) return
    if (action === 'delete' && !window.confirm('Delete this queued post permanently? This cannot be undone.')) return
    setBusy(true)
    setError('')
    try {
      const res = await fetch(`/api/admin/pending/${id}`, {
        method: action === 'retry' ? 'PATCH' : 'DELETE',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError((data as { error?: string }).error || 'Request failed')
      } else if (action === 'delete') {
        router.replace('/admin/pending')
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
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <button
        type="button"
        onClick={() => run('retry')}
        disabled={busy || !gatePass}
        style={{
          background: gatePass ? 'var(--blue)' : 'var(--surface)',
          color: gatePass ? '#fff' : 'var(--muted)',
          border: '1px solid' + (gatePass ? 'var(--blue)' : 'var(--border)'),
          borderRadius: 6,
          fontSize: '0.82rem',
          fontWeight: 600,
          padding: '7px 16px',
          cursor: gatePass && !busy ? 'pointer' : 'not-allowed',
          opacity: gatePass ? 1 : 0.5,
        }}
        title={gatePass ? 'Reset to pending_image for the next Phase 2 run' : 'Content fails the quality gate — cannot retry'}
      >
        Retry
      </button>
      <button
        type="button"
        onClick={() => run('delete')}
        disabled={busy}
        style={{
          background: 'transparent',
          color: '#f87171',
          border: '1px solid var(--border)',
          borderRadius: 6,
          fontSize: '0.82rem',
          padding: '7px 16px',
          cursor: busy ? 'not-allowed' : 'pointer',
        }}
      >
        Delete
      </button>
      {error && <span style={{ color: '#f87171', fontSize: '0.78rem' }}>{error}</span>}
    </div>
  )
}
