'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { label: 'Overview', href: '/admin' },
  { label: 'Published Posts', href: '/admin/posts' },
  { label: 'Pending Queue', href: '/admin/pending' },
]

export default function AdminNav() {
  const pathname = usePathname()

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 28,
        paddingBottom: 16,
        borderBottom: '1px solid var(--border)',
        flexWrap: 'wrap',
      }}
    >
      <Link href="/admin" style={{ textDecoration: 'none' }}>
        <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.05rem', color: 'var(--blue)' }}>
          AITrends<span style={{ color: 'var(--gold)' }}>.ng</span> Admin
        </span>
      </Link>

      <nav style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {LINKS.map((link) => {
          const active = pathname === link.href || (link.href !== '/admin' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                fontSize: '0.82rem',
                fontWeight: 500,
                color: active ? '#fff' : 'var(--muted)',
                background: active ? 'var(--surface)' : 'transparent',
                border: '1px solid' + (active ? 'var(--blue)' : 'var(--border)'),
                textDecoration: 'none',
                transition: 'color 0.15s',
              }}
            >
              {link.label}
            </Link>
          )
        })}
        <LogoutButton />
      </nav>
    </div>
  )
}

function LogoutButton() {
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <button
      type="button"
      onClick={logout}
      style={{
        padding: '6px 14px',
        borderRadius: 6,
        fontSize: '0.82rem',
        fontWeight: 500,
        color: '#f87171',
        background: 'transparent',
        border: '1px solid var(--border)',
        cursor: 'pointer',
      }}
    >
      Log out
    </button>
  )
}
