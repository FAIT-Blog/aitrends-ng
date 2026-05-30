const COLOURS: Record<string, { bg: string; color: string }> = {
  anthropic:  { bg: '#1e1b4b', color: '#818cf8' },
  'ai-models':{ bg: '#064e3b', color: '#34d399' },
  industry:   { bg: '#1c1917', color: '#f59e0b' },
  tools:      { bg: '#172554', color: '#60a5fa' },
}

const LABELS: Record<string, string> = {
  anthropic:   'Anthropic',
  'ai-models': 'AI Models',
  industry:    'Industry',
  tools:       'Tools',
}

export default function CategoryBadge({ category }: { category: string }) {
  const style = COLOURS[category] ?? { bg: '#1f2937', color: '#9ca3af' }
  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
        fontSize: '0.7rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        padding: '3px 9px',
        borderRadius: 4,
        display: 'inline-block',
      }}
    >
      {LABELS[category] ?? category}
    </span>
  )
}
