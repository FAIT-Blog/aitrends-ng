'use client'

import { useState } from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setState('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (res.ok) {
        setState('success')
        setEmail('')
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg((data as { error?: string }).error || 'Something went wrong. Try again.')
        setState('error')
      }
    } catch {
      setErrorMsg('Network error. Please try again.')
      setState('error')
    }
  }

  return (
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
          marginBottom: 8,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        Newsletter
      </h3>
      {state === 'success' ? (
        <p style={{ color: '#34d399', fontSize: '0.82rem', lineHeight: 1.6 }}>
          You&apos;re on the list! We&apos;ll email you when new AI briefings are published.
        </p>
      ) : (
        <>
          <p style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: 12 }}>
            Get Africa&apos;s latest AI news in your inbox.
          </p>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle') }}
              required
              style={{
                background: '#0d1117',
                border: '1px solid var(--border)',
                borderRadius: 6,
                color: 'var(--text)',
                fontSize: '0.82rem',
                padding: '8px 12px',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
              }}
            />
            {errorMsg && (
              <p style={{ color: '#f87171', fontSize: '0.75rem', margin: 0 }}>{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={state === 'loading'}
              style={{
                background: 'var(--blue)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: '0.82rem',
                fontWeight: 600,
                padding: '8px 0',
                cursor: state === 'loading' ? 'not-allowed' : 'pointer',
                opacity: state === 'loading' ? 0.7 : 1,
              }}
            >
              {state === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        </>
      )}
    </div>
  )
}
