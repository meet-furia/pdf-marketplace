import { supabase } from '../lib/supabaseClient'

export function loginWithEmail(email, password) {
  return supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  })
}

export function signupWithEmail(email, password) {
  return supabase.auth.signUp({
    email: email.trim(),
    password,
    options: {
      emailRedirectTo: window.location.origin,
    },
  })
}

export function loginWithGoogle(redirectPath = '/') {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}${redirectPath}`,
    },
  })
}

export function logout() {
  return supabase.auth.signOut()
}
