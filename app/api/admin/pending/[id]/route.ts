import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isAdminAuthed } from '@/lib/adminAuth'
import { passesQualityGate } from '@/lib/qualityGate'

// Retry a failed/stuck pending post: reset to pending_image so the next
// Phase 2 run (complete.yml, hourly) picks it up. Keeps the stored provider
// on the row — Phase 2 uses per-row provider, never the current env default.
export async function PATCH(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params

  const { data: row, error: fetchErr } = await supabaseAdmin
    .from('pending_posts')
    .select('id, content')
    .eq('id', id)
    .single()
  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 })
  if (!row) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const gate = passesQualityGate(row.content ?? '')
  if (!gate.pass) {
    return NextResponse.json(
      { error: `Content fails the quality gate — retry would just fail again at publish. Reasons: ${gate.reasons.join('; ')}` },
      { status: 422 }
    )
  }

  const { error } = await supabaseAdmin
    .from('pending_posts')
    .update({ status: 'pending_image', attempts: 0, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthed())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await ctx.params
  const { error } = await supabaseAdmin.from('pending_posts').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
