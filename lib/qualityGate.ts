// Mirror of scout-agent/quality-gate.js — the admin panel uses this to show
// whether a pending post's stored content would pass the publish gate BEFORE
// offering a Retry action. Kept structurally identical to the Scout version so
// the badge always matches what publisher.js will actually enforce.
//
// Gate rules (must stay in sync with quality-gate.js):
//   - at least one <h3> heading
//   - 400–2500 words
//   - no banned words
//   - a substantive final "Why this matters" section (heading + body, or a
//     prose closing near the end with enough text after the phrase)

export const MIN_DIGEST_WORDS = 400
export const MIN_WTM_WORDS = 12

export function contentWordCount(html: string): number {
  return (html || '')
    .replace(/<[^>]*>/g, '')
    .split(/\s+/)
    .filter(Boolean).length
}

function plainText(html: string): string {
  return String(html || '').replace(/<[^>]*>/g, ' ')
}

function countWords(text: string): number {
  return (String(text || '').match(/\S+/g) || []).length
}

export function whyThisMattersFailures(content: string): string[] {
  const html = String(content || '')

  const headingRe = /<h([23])[^>]*>([\s\S]*?)<\/h\1>/gi
  let lastHeadingEnd = -1
  let match: RegExpExecArray | null
  while ((match = headingRe.exec(html)) !== null) {
    if (/why this matters/i.test(plainText(match[2]))) lastHeadingEnd = headingRe.lastIndex
  }

  if (lastHeadingEnd !== -1) {
    const rest = html.slice(lastHeadingEnd)
    const nextHeading = rest.search(/<h[23][^>]*>/i)
    if (nextHeading !== -1) return ['"Why this matters" section is not the final section']
    const words = countWords(plainText(rest))
    if (words >= MIN_WTM_WORDS) return []
    return [`"Why this matters" section too short (${words} words, min ${MIN_WTM_WORDS})`]
  }

  const text = plainText(html).replace(/\s+/g, ' ').trim()
  const phrase = 'why this matters'
  const idx = text.toLowerCase().lastIndexOf(phrase)
  if (idx === -1) return ['missing "Why this matters" closing']

  const after = text.slice(idx + phrase.length)
  const afterWords = countWords(after)
  const nearEnd = idx >= Math.floor(text.length * 0.8)
  if (nearEnd && afterWords >= MIN_WTM_WORDS) return []
  return [`"Why this matters" closing is not a substantive final section (${afterWords} words after the phrase)`]
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

  reasons.push(...whyThisMattersFailures(content))

  return { pass: reasons.length === 0, reasons, wordCount }
}
