// Mirror of scout-agent/quality-gate.js — the admin panel uses this to show
// whether a pending post's stored content would pass the publish gate BEFORE
// offering a Retry action. Kept structurally identical to the Scout version so
// the badge always matches what publisher.js will actually enforce.
//
// Gate rules (must stay in sync with quality-gate.js):
//   - at least one <h3> heading
//   - 400–2500 words
//   - no banned words
//   - a literal "Why this matters" closing section

export const MIN_DIGEST_WORDS = 400

export function contentWordCount(html: string): number {
  return (html || '')
    .replace(/<[^>]*>/g, '')
    .split(/\s+/)
    .filter(Boolean).length
}

export interface GateResult {
  pass: boolean
  reasons: string[]
  wordCount: number
}

export function passesQualityGate(content: string): GateResult {
  const reasons: string[] = []
  const wordCount = contentWordCount(content)

  if (!/<h3/i.test(content)) reasons.push('no h3 headings')
  if (wordCount < 400) reasons.push(`too short (${wordCount} words, min 400)`)
  if (wordCount > 2500) reasons.push(`too long (${wordCount} words, max 2500)`)

  const banned = ['revolutionary', 'game-changing', 'unbelievable', 'shocking', 'terrifying', 'incredible']
  const lower = content.toLowerCase()
  for (const word of banned) {
    if (lower.includes(word)) {
      reasons.push(`contains banned word: "${word}"`)
      break
    }
  }

  if (!/why this matters/i.test(content)) reasons.push('missing "Why this matters" closing')

  return { pass: reasons.length === 0, reasons, wordCount }
}
