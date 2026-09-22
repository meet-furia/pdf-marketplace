import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { registerAuthenticatedUser } from '../services/userService'

export function useAuthSession() {
  const [session, setSession] = useState(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)
  const registeredUserIds = useRef(new Set())

  const handleSession = async (currentSession) => {
    setSession(currentSession)
    setIsLoadingSession(false)

    const user = currentSession?.user

    if (!user?.email_confirmed_at || registeredUserIds.current.has(user.id)) {
      return
    }

    registeredUserIds.current.add(user.id)

    try {
      await registerAuthenticatedUser(user, currentSession.access_token)
    } catch (error) {
      registeredUserIds.current.delete(user.id)
      console.error('Failed to register authenticated user:', error)
    }
  }

  const logout = useCallback(() => supabase.auth.signOut(), [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => handleSession(data.session))

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        handleSession(currentSession)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  return {
    session,
    user: session?.user ?? null,
    isLoadingSession,
    logout,
  }
}
