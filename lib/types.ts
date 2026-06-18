export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  category: string
  tags: string[]
  cover_image_url: string
  cover_image_prompt: string
  source_urls: string[]
  status: 'published' | 'draft'
  auto_generated: boolean
  created_at: string
  published_at: string | null
  updated_at?: string | null
}
