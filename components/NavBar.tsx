'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import SearchDropdown from './SearchDropdown'

const CATEGORIES = [
  { label: 'Anthropic', href: '/category/anthropic' },
  { label: 'AI Models', href: '/category/ai-models' },
  { label: 'Industry', href: '/category/industry' },
  { label: 'Tools', href: '/category/tools' },
  { label: 'AI Trends', href: '/category/ai' },
]

export default function NavBar() {
  const pathname = usePathname()

  return (
    <header style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <Link href="/" className="nav-logo" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: '1.15rem', color: 'var(--blue)' }}>
              AITrends<span style={{ color: 'var(--gold)' }}>.ng</span>
            </span>
          </Link>

          <nav className="site-nav" style={{ display: 'flex', gap: 4 }}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  color: pathname === cat.href ? '#fff' : 'var(--muted)',
                  background: pathname === cat.href ? 'var(--surface)' : 'transparent',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
              >
                {cat.label}
              </Link>
            ))}
            <Link
              href="/about"
              style={{
                padding: '5px 12px',
                borderRadius: 6,
                fontSize: '0.82rem',
                fontWeight: 500,
                color: pathname === '/about' ? '#fff' : 'var(--muted)',
                background: pathname === '/about' ? 'var(--surface)' : 'transparent',
                textDecoration: 'none',
              }}
            >
              About
            </Link>
          </nav>

          <SearchDropdown />
        </div>
      </div>
    </header>
  )
}
