import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/types.gen'

export function createClient() {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  return supabase
}

// Create a singleton instance for client-side use
export const supabase = createClient() 