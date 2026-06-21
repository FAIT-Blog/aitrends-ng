'use client'

import { useState } from 'react'

interface FeedbackFormProps {
  postSlug: string
}

const inputStyle: React.CSSProperties = {
  background: '#0d1117',
  border: '1px solid var(--border)',
  borderRadius: 6,
  color: 'var(--text)',
  fontSize: '0.85rem',
  padding: '10px 14px',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box',
}

export default function FeedbackForm({ postSlug }: FeedbackFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return
    setState('loading')
    setErrorMsg('')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          post_slug: postSlug,
        }),
      })
      if (res.ok) {
        setState('success')
        setName('')
        setEmail('')
        setMessage('')
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
        borderRadius: 10,
        padding: '24px 28px',
        marginBottom: 40,
      }}
    >
      <h3
        style={{
          fontFamily: 'Sora, sans-serif',
          fontWeight: 700,
          fontSize: '1rem',
          color: '#fff',
          marginBottom: 6,
        }}
      >
        Share your thoughts
      </h3>
      <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: 20 }}>
        Reactions, corrections, or insights — all welcome.
      </p>

      {state === 'success' ? (
        <p style={{ color: '#34d399', fontSize: '0.9rem' }}>
          Thank you! Your message has been received.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input
              type="text"
              placeholder="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Email (optional)"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle') }}
              style={inputStyle}
            />
          </div>
          <textarea
            placeholder="Your thoughts on this story…"
            value={message}
            onChange={(e) => { setMessage(e.target.value); if (state === 'error') setState('idle') }}
            required
            rows={4}
            maxLength={2000}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
          />
          {errorMsg && (
            <p style={{ color: '#f87171', fontSize: '0.78rem', margin: 0 }}>{errorMsg}</p>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--muted)', fontSize: '0.72rem' }}>
              {message.length}/2000
            </span>
            <button
              type="submit"
              disabled={state === 'loading' || !message.trim()}
              style={{
                background: 'var(--blue)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                fontSize: '0.85rem',
                fontWeight: 600,
                padding: '10px 24px',
                cursor: state === 'loading' || !message.trim() ? 'not-allowed' : 'pointer',
                opacity: state === 'loading' || !message.trim() ? 0.6 : 1,
              }}
            >
              {state === 'loading' ? 'Sending…' : 'Send Feedback'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
