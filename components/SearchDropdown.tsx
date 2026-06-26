'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import CategoryBadge from './CategoryBadge'

interface SearchResult {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  tags: string[]
  cover_image_url: string
}

export default function SearchDropdown() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle')
  const [mobileOpen, setMobileOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Debounce: wait 300ms after typing stops before fetching.
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setStatus('idle')
      return
    }
    setStatus('loading')
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        const data = await res.json().catch(() => ({ results: [] }))
        setResults(Array.isArray(data.results) ? data.results : [])
      } catch {
        setResults([])
      } finally {
        setStatus('done')
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  function close() {
    setQuery('')
    setResults([])
    setStatus('idle')
    setMobileOpen(false)
  }

  // Click outside closes the dropdown.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        close()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') close()
  }

  const showDropdown = query.trim().length >= 2

  return (
    <div className="search-wrap" ref={wrapRef}>
      <button
        type="button"
        className="search-toggle"
        aria-label="Search"
        onClick={() => {
          setMobileOpen((v) => !v)
          setTimeout(() => inputRef.current?.focus(), 0)
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--muted)',
          cursor: 'pointer',
          fontSize: '1rem',
          padding: '5px 8px',
        }}
      >
        ⌕
      </button>

      <div className={`search-input-wrap ${mobileOpen ? 'search-input-wrap-open' : ''}`}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search posts..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            background: '#0d1117',
            border: '1px solid var(--border)',
            borderRadius: 6,
            color: 'var(--text)',
            fontSize: '0.82rem',
            padding: '6px 10px',
            outline: 'none',
            width: '100%',
            boxSizing: 'border-box',
          }}
        />

        {showDropdown && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: 6,
              zIndex: 1000,
              maxHeight: 360,
              overflowY: 'auto',
            }}
          >
            {status === 'loading' && (
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', padding: '8px 10px', margin: 0 }}>
                Searching...
              </p>
            )}

            {status === 'done' && results.length === 0 && (
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem', padding: '8px 10px', margin: 0 }}>
                No results for &quot;{query.trim()}&quot;
              </p>
            )}

            {status === 'done' &&
              results.map((post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.slug}`}
                  onClick={close}
                  className="search-result-row"
                  style={{
                    display: 'block',
                    padding: '8px 10px',
                    borderRadius: 6,
                    textDecoration: 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <CategoryBadge category={post.category} />
                  </div>
                  <div style={{ color: 'var(--text)', fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3 }}>
                    {post.title}
                  </div>
                  <div
                    style={{
                      color: 'var(--muted)',
                      fontSize: '0.75rem',
                      lineHeight: 1.4,
                      marginTop: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {post.excerpt}
                  </div>
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}
