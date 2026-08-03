import { supabase } from '@/lib/supabase'

const CATEGORY_SLUGS = ['anthropic', 'ai-models', 'industry', 'tools', 'ai']

// Category counts for the sidebar. Uses lightweight head-count queries
// (one per category, no rows returned) instead of fetching every published
// post's category column — the old approach transferred 300+ rows per page
// load and grew linearly with the post count.
export async function getCategoryCounts(): Promise<Record<string, number>> {
  const counts = await Promise.all(
    CATEGORY_SLUGS.map(async (slug) => {
      const { count } = await supabase
        .from('posts')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'published')
        .eq('category', slug)
      return [slug, count ?? 0] as const
    })
  )
  return Object.fromEntries(counts)
}
