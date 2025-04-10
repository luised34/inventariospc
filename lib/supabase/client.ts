import { createBrowserClient } from '@supabase/ssr'
import { type Database } from './database-types'
import { useMemo } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'

type TypedSupabaseClient = SupabaseClient<Database>

let client: TypedSupabaseClient | undefined

function createSupabaseClient() {
  if (client) {
    return client
  }

  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  )

  return client
}


export function useSupabaseBrowser() {
  return useMemo(createSupabaseClient, [])
}

