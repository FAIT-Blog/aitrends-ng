import React from 'react'

// Shared presentational helpers for the admin panel. Kept inline-style
// consistent with the brand palette (--surface, --border, --blue).

export function StatCard({
  label,
  value,
  color = 'var(--text)',
  href,
}: {
  label: string
  value: React.ReactNode
  color?: string
  href?: string
}) {
  const inner = (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        padding: '18px 20px',
        minWidth: 150,
        flex: '1 1 150px',
      }}
    >
      <div style={{ fontSize: '1.7rem', fontWeight: 700, color, fontFamily: 'Sora, sans-serif', lineHeight: 1.1 }}>
        {value}
      </div>
      <div style={{ color: 'var(--muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4 }}>
        {label}
      </div>
    </div>
  )

  if (href) {
    return (
      <a href={href} style={{ textDecoration: 'none', display: 'flex', flex: '1 1 150px', minWidth: 150 }}>
        {inner}
      </a>
    )
  }
  return inner
}

export function Badge({ children, tone = 'muted' }: { children: React.ReactNode; tone?: 'muted' | 'green' | 'red' | 'gold' | 'blue' }) {
  const colors: Record<string, string> = {
    muted: '#9ca3af',
    green: '#34d399',
    red: '#f87171',
    gold: '#fbbf24',
    blue: '#60a5fa',
  }
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 999,
        fontSize: '0.72rem',
        fontWeight: 600,
        color: colors[tone],
        border: `1px solid ${colors[tone]}55`,
        background: `${colors[tone]}11`,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

export function SectionCard({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '20px 22px', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, gap: 12, flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700 }}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  )
}

export function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 8, fontSize: '0.85rem', lineHeight: 1.7 }}>
      <span style={{ color: 'var(--muted)', minWidth: 110 }}>{label}</span>
      <span style={{ color: 'var(--text)', wordBreak: 'break-word', minWidth: 0 }}>{value}</span>
    </div>
  )
}
