export function slugify(text: string): string {
  let slug = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

  if (slug.length > 80) {
    slug = slug.slice(0, 80)
    const lastHyphen = slug.lastIndexOf('-')
    // Only trim at word boundary if the hyphen is in the second half —
    // prevents a pathologically long first word from collapsing the whole slug
    if (lastHyphen > 40) slug = slug.slice(0, lastHyphen)
  }

  return slug.replace(/-+$/, '').replace(/^-+/, '')
}
