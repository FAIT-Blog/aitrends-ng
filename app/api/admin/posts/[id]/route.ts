import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminAuthed } from '@/lib/adminAuth'

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  let body: { status?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const status = body.status
  if (status !== 'published' && status !== 'draft') {
    return NextResponse.json({ error: 'status must be "published" or "draft"' }, { status: 400 })
  }

  const patch: Record<string, string> = { status }
  if (status === 'published' && !(await hasPublishedAt(id))) {
    patch.published_at = new Date().toISOString()
  }

  const { error } = await supabaseAdmin
    .from('posts')
    .update(patch)
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

async function hasPublishedAt(id: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('posts')
    .select('published_at')
    .eq('id', id)
    .single()
  return Boolean(data?.published_at)
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const { error } = await supabaseAdmin.from('posts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
