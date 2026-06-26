import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  // Commas and parentheses are syntax in PostgREST's .or() filter string —
  // strip them so a typed comma can't inject an unintended extra clause.
  const q = raw.replace(/[(),]/g, '')

  if (q.length < 2 || q.length > 60) {
    return NextResponse.json({ results: [] })
  }

  // tags.cs.{value} is Postgres "array contains" — an exact element match, not
  // a substring match (tags are stored as whole lowercase keywords). Lowercase
  // the query for that clause so it lines up with how tags are stored; title
  // and excerpt already match case-insensitively via ilike.
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, excerpt, category, tags, cover_image_url')
    .eq('status', 'published')
    .or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,tags.cs.{${q.toLowerCase()}}`)
    .order('published_at', { ascending: false })
    .limit(8)

  if (error) {
    console.error('[/api/search]', error.message)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }

  return NextResponse.json({ results: data ?? [] })
}
