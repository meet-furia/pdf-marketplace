import { createContext, useContext } from 'react'
import { useAuthSession } from '../hooks/useAuthSession'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const auth = useAuthSession()

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const auth = useContext(AuthContext)

  if (!auth) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return auth
}
