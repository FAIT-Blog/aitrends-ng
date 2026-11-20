import { SOCIAL_PROFILES } from '@/lib/social'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        marginTop: 80,
        padding: '32px 20px',
        textAlign: 'center',
      }}
    >
      <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: 4 }}>
        <strong style={{ color: 'var(--text)' }}>AITrends<span style={{ color: 'var(--gold)' }}>.ng</span></strong>
        {' '}— insights, and lessons for the future.
      </p>
      <p style={{ color: 'var(--muted)', fontSize: '0.75rem', display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href="/feed.xml" style={{ color: 'var(--muted)' }}>RSS</a>
        <a href={SOCIAL_PROFILES.telegram} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)' }}>Telegram</a>
        <a href={SOCIAL_PROFILES.bluesky} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--muted)' }}>Bluesky</a>
      </p>
    </footer>
  )
}
