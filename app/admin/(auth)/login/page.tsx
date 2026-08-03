'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin() {
    if (!password || loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.ok) {
        router.push('/admin')
      } else {
        const data = await res.json().catch(() => ({}))
        setError((data as { error?: string }).error || 'Login failed. Try again.')
        setPassword('')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '10vh auto 0', padding: '0 20px' }}>
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 12,
          padding: '28px 30px',
        }}
      >
        <h2
          style={{
            fontFamily: 'Sora, sans-serif',
            fontWeight: 700,
            fontSize: '1.2rem',
            margin: '0 0 4px',
          }}
        >
          AITrends.ng Admin
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem', margin: '0 0 20px' }}>
          Enter the admin password to review published and queued posts.
        </p>

        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); if (error) setError('') }}
          onKeyDown={(e) => { if (e.key === 'Enter') handleLogin() }}
          autoFocus
          style={{
            background: '#0d1117',
            border: '1px solid var(--border)',
            borderRadius: 6,
            color: 'var(--text)',
            fontSize: '0.9rem',
            padding: '10px 14px',
            outline: 'none',
            width: '100%',
            boxSizing: 'border-box',
            marginBottom: 12,
          }}
        />

        {error && (
          <p style={{ color: '#f87171', fontSize: '0.8rem', margin: '0 0 12px' }}>{error}</p>
        )}

        <button
          type="button"
          onClick={handleLogin}
          disabled={loading || !password}
          style={{
            background: 'var(--blue)',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: '0.9rem',
            fontWeight: 600,
            padding: '10px 0',
            width: '100%',
            cursor: loading || !password ? 'not-allowed' : 'pointer',
            opacity: loading || !password ? 0.6 : 1,
          }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </div>
    </div>
  )
}
