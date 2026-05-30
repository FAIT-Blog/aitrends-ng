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
        {' '}— The African builder&apos;s daily briefing on Claude, Anthropic, and the models shaping what&apos;s next.
      </p>
      <p style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
        by <span style={{ color: 'var(--blue)' }}>FAIT</span> · Auto-generated digests · <a href="/feed.xml" style={{ color: 'var(--muted)' }}>RSS</a>
      </p>
    </footer>
  )
}
