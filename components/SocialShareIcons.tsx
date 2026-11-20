'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import { SOCIAL_VIA_HANDLE } from '@/lib/social'

interface Props {
  url: string
  title: string
  label?: string
  align?: 'left' | 'right'
}

const ICON_BUTTON: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 34,
  height: 34,
  padding: 0,
  borderRadius: 8,
  border: '1px solid var(--border)',
  background: 'var(--surface)',
  color: 'var(--muted)',
  textDecoration: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s, color 0.15s',
}

export default function SocialShareIcons({ url, title, label, align = 'left' }: Props) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedBoth = encodeURIComponent(`${title} ${url}`)

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      const el = document.createElement('textarea')
      el.value = url
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const links = [
    {
      name: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=${SOCIAL_VIA_HANDLE}`,
      color: '#1DA1F2',
      icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
    },
    {
      name: 'Bluesky',
      href: `https://bsky.app/intent/compose?text=${encodedBoth}`,
      color: '#2085E8',
      icon: <path d="M320 272.5c-28.3-51-80.3-134.8-128.8-175.9-46.5-39.3-116.7-14.1-116.7 46.5 0 31.4 17.2 84.8 29 120.5 20.7 61.2 78.1 104.4 137.8 104.4 22.3 0 44.3-4.7 64.8-13.9 6.5-3 13.2-5.5 20-7.5 6.8 2 13.5 4.5 20 7.5 20.5 9.2 42.5 13.9 64.8 13.9 59.7 0 117.1-43.2 137.8-104.4 11.8-35.7 29-89.1 29-120.5 0-60.6-70.2-85.8-116.7-46.5-48.5 41.1-100.5 124.9-128.8 175.9z" />,
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodedBoth}`,
      color: '#25D366',
      icon: <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />,
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: '#0A66C2',
      icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />,
    },
    {
      name: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: '#229ED9',
      icon: <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />,
    },
  ]

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        alignItems: align === 'right' ? 'flex-end' : 'flex-start',
      }}
    >
      {label && (
        <span
          style={{
            color: 'var(--muted)',
            fontSize: '0.68rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          {label}
        </span>
      )}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: align === 'right' ? 'flex-end' : 'flex-start' }}>
        {links.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${link.name}`}
            title={`Share on ${link.name}`}
            style={ICON_BUTTON}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = link.color
              ;(e.currentTarget as HTMLElement).style.color = link.color
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
              ;(e.currentTarget as HTMLElement).style.color = 'var(--muted)'
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              {link.icon}
            </svg>
          </a>
        ))}
        <button
          type="button"
          onClick={copyLink}
          aria-label="Copy link"
          title="Copy link"
          style={{
            ...ICON_BUTTON,
            borderColor: copied ? 'var(--green, #10b981)' : 'var(--border)',
            color: copied ? 'var(--green, #10b981)' : 'var(--muted)',
          }}
          onMouseEnter={e => {
            if (!copied) (e.currentTarget as HTMLElement).style.borderColor = '#6b7280'
          }}
          onMouseLeave={e => {
            if (!copied) (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
          }}
        >
          {copied ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
