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
      <p style={{ color: 'var(--muted)', fontSize: '0.75rem' }}>
        <a href="/feed.xml" style={{ color: 'var(--muted)' }}>RSS</a>
      </p>
    </footer>
  )
}
