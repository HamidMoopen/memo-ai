'use server'

import { createClient } from '@/lib/supabase/server'

export type LoginFormData = {
  email: string
  password: string
}

export type LoginResult = {
  error?: 'credentials' | 'unknown'
  message?: string
  showSignUp?: boolean
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createClient();

  try {
    // Attempt to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error("Sign in error:", signInError);
      return { error: signInError.message };
    }

    // Verify session was established
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session) {
      console.error("Session error:", sessionError);
      return { error: "Failed to establish session" };
    }

    // Return success - let the client handle the redirect
    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { error: "An unexpected error occurred" };
  }
} 