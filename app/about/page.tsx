import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About — AITrends.ng',
  description:
    "AITrends.ng transforms AI news into practical understanding — helping people make sense of artificial intelligence and what to do next.",
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
        AITrends.ng — insights, and lessons for the future.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        {/* Mission — leads with WHY, not HOW */}
        <section>
          <p style={{ color: '#9ca3af', lineHeight: 1.85, fontSize: '1.02rem' }}>
            Artificial intelligence is becoming one of the defining technologies of our time.
            Every week brings another breakthrough — a new model, a startup funding round, a scientific
            discovery, a government policy, or a product launch that promises to change the way we work,
            learn, build businesses, and solve problems.
          </p>
          <p style={{ color: '#9ca3af', lineHeight: 1.85, fontSize: '1.02rem', marginTop: 16 }}>
            The challenge isn&apos;t finding AI news.
            It&apos;s making sense of it.
          </p>
          <p style={{ color: '#e5e7eb', lineHeight: 1.85, fontSize: '1.02rem', marginTop: 16, fontWeight: 500 }}>
            That&apos;s why AITrends.ng exists.
          </p>
          <p style={{ color: '#9ca3af', lineHeight: 1.85, fontSize: '1.02rem', marginTop: 16 }}>
            We help people understand not only what is happening in artificial intelligence,
            but why it matters, who it affects, what opportunities it creates, and what to do next.
          </p>
        </section>

        {/* Philosophy */}
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
            Our Philosophy
          </h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.85 }}>
            Every meaningful development in AI changes someone&apos;s future.
            Every article we publish begins with the same questions:
          </p>
          <ul style={{ color: '#9ca3af', lineHeight: 2, paddingLeft: 20, marginTop: 8 }}>
            <li>What happened?</li>
            <li>Why does it matter?</li>
            <li>Who is affected?</li>
            <li>What opportunities emerge?</li>
            <li>What risks should we understand?</li>
            <li>What should people do differently because of this?</li>
          </ul>
          <p style={{ color: '#9ca3af', lineHeight: 1.85, marginTop: 16 }}>
            Those questions shape every story we publish.
            We don&apos;t chase headlines. We pursue understanding.
          </p>
        </section>

        {/* How We Work — condensed, reader-focused */}
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
            How We Work
          </h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.85 }}>
            AITrends.ng is powered by an autonomous editorial system developed by{' '}
            <strong style={{ color: '#fff' }}>Felicota Audio Infotech (FAIT)</strong>.
          </p>
          <p style={{ color: '#9ca3af', lineHeight: 1.85, marginTop: 12 }}>
            Our publishing pipeline continuously monitors trusted AI sources across
            industry, academia, research, startups, and technology communities.
            It identifies meaningful developments, gathers supporting context, and produces
            structured editorial briefings.
          </p>
          <p style={{ color: '#9ca3af', lineHeight: 1.85, marginTop: 12 }}>
            But technology is only part of the story.
            Automation helps us discover information faster.
            Editorial philosophy determines what makes that information valuable.
          </p>
        </section>

        {/* Who We Write For */}
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
            Who We Write For
          </h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.85 }}>
            AITrends.ng is built for people who want to understand AI beyond the headlines:
          </p>
          <ul style={{ color: '#9ca3af', lineHeight: 2, paddingLeft: 20, marginTop: 8 }}>
            <li>Entrepreneurs and startup founders</li>
            <li>Software developers and engineers</li>
            <li>Business leaders and decision-makers</li>
            <li>Students and lifelong learners</li>
            <li>Educators and academic institutions</li>
            <li>Policymakers and researchers</li>
            <li>Anyone preparing for an AI-driven future</li>
          </ul>
          <p style={{ color: '#9ca3af', lineHeight: 1.85, marginTop: 16 }}>
            You don&apos;t need to be an AI expert. Curiosity is enough.
          </p>
        </section>

        {/* Editorial Principles */}
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
            Our Editorial Principles
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Signal over noise.', desc: 'We focus on developments likely to have lasting significance rather than temporary hype.' },
              { label: 'Clarity over complexity.', desc: 'AI is complicated enough. Our writing shouldn\'t be.' },
              { label: 'Insight over repetition.', desc: 'We don\'t exist to rewrite press releases. We exist to help readers understand what announcements actually mean.' },
              { label: 'Balance over sensationalism.', desc: 'We avoid both hype and fear. AI deserves thoughtful discussion, not exaggerated promises or unnecessary panic.' },
              { label: 'Action over information.', desc: 'Readers should finish every article with a clearer understanding of what to pay attention to next.' },
            ].map((item) => (
              <div key={item.label}>
                <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</p>
                <p style={{ color: 'var(--muted)', fontSize: '0.85rem', lineHeight: 1.7, marginTop: 2 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why We Built It */}
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
            Why We Exist
          </h2>
          <p style={{ color: '#9ca3af', lineHeight: 1.85 }}>
            We believe the future belongs to people who understand technological change
            before it becomes obvious. Artificial intelligence isn&apos;t just another industry —
            it&apos;s becoming part of every industry.
          </p>
          <p style={{ color: '#9ca3af', lineHeight: 1.85, marginTop: 12 }}>
            The organizations, educators, governments, businesses, and individuals who
            develop the ability to interpret AI developments — not just observe them —
            will be better prepared to make decisions, seize opportunities, and navigate change.
          </p>
          <p style={{ color: '#9ca3af', lineHeight: 1.85, marginTop: 12 }}>
            AITrends.ng exists to accelerate that understanding.
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
