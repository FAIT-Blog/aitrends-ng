import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _public: SupabaseClient | null = null
let _admin: SupabaseClient | null = null

function getPublic(): SupabaseClient {
  if (!_public) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
    _public = createClient(url, key)
  }
  return _public
}

function getAdmin(): SupabaseClient {
  if (!_admin) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SECRET_KEY
    if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY')
    _admin = createClient(url, key)
  }
  return _admin
}

// Proxy objects that initialize lazily on first method call
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getPublic()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
})

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getAdmin()
    const value = (client as unknown as Record<string | symbol, unknown>)[prop]
    return typeof value === 'function' ? value.bind(client) : value
  },
})
