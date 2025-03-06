import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/types.gen'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
    },
})

// Add a listener for auth state changes
if (typeof window !== 'undefined') {
    supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔐 Auth state changed:', { event, sessionExists: !!session });
    });
}