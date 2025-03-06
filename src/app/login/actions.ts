'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type LoginFormData = {
  email: string
  password: string
}

export type LoginResult = {
  error?: 'credentials' | 'unknown'
  message?: string
  showSignUp?: boolean
}

export async function signIn(formData: LoginFormData): Promise<LoginResult> {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      return {
        error: 'credentials',
        message: 'No account found with these credentials',
        showSignUp: true
      }
    }
    return {
      error: 'unknown',
      message: error.message
    }
  }

  if (data?.user) {
    redirect('/dashboard')
  }

  return { error: 'unknown', message: 'Something went wrong' }
} 