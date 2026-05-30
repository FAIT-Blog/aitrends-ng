import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — AITrends.ng',
  description:
    "AITrends.ng is an automated AI news digest for African builders. Every post is sourced, rewritten, and published without human intervention.",
}

export default function AboutPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 20px 100px' }}>
      <div style={{ marginBottom: 10, fontSize: '0.8rem', color: 'var(--muted)' }}>
        <Link href="/" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Home</Link>
        {' / '}
        <span style={{ color: 'var(--text)' }}>About</span>
      </div>

      <h1
        style={{
          fontFamily: 'Sora, sans-serif',
          fontWeight: 700,
          fontSize: '2.2rem',
          color: '#fff',
          marginBottom: 8,
          marginTop: 24,
        }}
      >
        About AITrends.ng
      </h1>
      <p style={{ color: 'var(--blue)', fontWeight: 600, fontSize: '1rem', marginBottom: 40 }}>
        The African builder&apos;s daily briefing on Claude, Anthropic, and the models shaping what&apos;s next.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        <section>
          <h2
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: '1.15rem',
              color: '#fff',
              marginBottom: 12,
              borderBottom: '1px solid var(--border)',
              paddingBottom: 8,
            }}
          >
            What it is
          </h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.75 }}>
            AITrends.ng is a fully automated AI news digest blog. It monitors the top sources covering
            artificial intelligence — Anthropic&apos;s blog, Reddit&apos;s AI communities, Hacker News, and
            leading AI newsletters — and turns the most important stories into punchy, opinionated
            briefings targeted at African developers, founders, and builders who follow global AI closely.
          </p>
        </section>

        <section>
          <h2
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: '1.15rem',
              color: '#fff',
              marginBottom: 12,
              borderBottom: '1px solid var(--border)',
              paddingBottom: 8,
            }}
          >
            How it works
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              {
                step: '01',
                title: 'Scout monitors RSS feeds',
                body: 'A Node.js cron job (the Scout Agent) runs on a schedule, pulling new items from Anthropic\'s official blog, Reddit\'s r/MachineLearning and r/ClaudeAI, Hacker News, and other curated feeds.',
              },
              {
                step: '02',
                title: 'Gemini rewrites the digest',
                body: 'Each new story is passed to Gemini 1.5 Flash, which rewrites it in the AITrends.ng voice: punchy, opinionated, useful. Not a summary — a briefing. Scout also prompts Gemini to generate an image prompt tuned to the visual identity.',
              },
              {
                step: '03',
                title: 'Pollinations generates the cover image',
                body: 'The image prompt is sent to Pollinations.ai, which renders a clean tech illustration in the AITrends.ng style: dark background, electric blue and gold accents, no text in the image.',
              },
              {
                step: '04',
                title: 'The post goes live',
                body: 'Scout calls the protected /api/posts/create endpoint, which validates the payload, generates a URL-safe slug, stores the post in Supabase, and makes it live instantly on aitrends.ng.',
              },
              {
                step: '05',
                title: 'Slack notification',
                body: 'Felix gets a Slack message with the post title, cover image preview, and a direct link — so he can stay informed without having to check the site.',
              },
            ].map((item) => (
              <div
                key={item.step}
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '18px 20px',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                }}
              >
                <span
                  style={{
                    fontFamily: 'JetBrains Mono, monospace',
                    color: 'var(--blue)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    minWidth: 28,
                    marginTop: 2,
                  }}
                >
                  {item.step}
                </span>
                <div>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', marginBottom: 6 }}>{item.title}</p>
                  <p style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: 1.7 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: '1.15rem',
              color: '#fff',
              marginBottom: 12,
              borderBottom: '1px solid var(--border)',
              paddingBottom: 8,
            }}
          >
            Who it&apos;s for
          </h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.75 }}>
            African developers, founders, and AI practitioners who want to stay on top of the Claude
            and Anthropic ecosystem without spending time hunting across dozens of sources. If you build
            with APIs, follow model releases, or care about where AI is heading — this is your briefing.
          </p>
        </section>

        <section>
          <h2
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: '1.15rem',
              color: '#fff',
              marginBottom: 12,
              borderBottom: '1px solid var(--border)',
              paddingBottom: 8,
            }}
          >
            A note on automation
          </h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.75 }}>
            Every post on AITrends.ng is AI-generated and carries an <em style={{ color: 'var(--muted)' }}>AI digest</em> badge.
            We are transparent about this. The goal is speed and coverage — getting you the signal from
            the noise, faster. The source URLs are always listed at the bottom of each post so you can
            go deeper on any story.
          </p>
        </section>

        <section>
          <h2
            style={{
              fontFamily: 'Sora, sans-serif',
              fontWeight: 700,
              fontSize: '1.15rem',
              color: '#fff',
              marginBottom: 12,
              borderBottom: '1px solid var(--border)',
              paddingBottom: 8,
            }}
          >
            Powered by FAIT
          </h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.75 }}>
            AITrends.ng is built and maintained by{' '}
            <strong style={{ color: '#fff' }}>Felicota Audio Infotech (FAIT)</strong>, a Lagos-based
            technology company. It is one of several automated projects exploring what&apos;s possible when
            you put AI systems to work building things for African audiences.
          </p>
        </section>
      </div>

      <div style={{ marginTop: 60, textAlign: 'center' }}>
        <Link
          href="/"
          style={{
            background: 'var(--blue)',
            color: '#fff',
            padding: '12px 28px',
            borderRadius: 8,
            fontSize: '0.9rem',
            fontWeight: 700,
            textDecoration: 'none',
            fontFamily: 'Sora, sans-serif',
          }}
        >
          Read the latest digests →
        </Link>
      </div>
    </div>
  )
}
