import { useMemo } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import LandingHero from '../components/LandingHero'
import { useAuth } from '../app/AuthProvider'

const isSupabaseConfigured = () =>
  Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  )

function RegisterPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const configured = useMemo(() => isSupabaseConfigured(), [])

  if (user?.email_confirmed_at) {
    return <Navigate replace to="/" />
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_430px] lg:px-8">
      <LandingHero />
      <AuthCard
        googleRedirectPath="/"
        initialAuthMode="signup"
        isSupabaseConfigured={configured}
        onAuthenticated={() => navigate('/', { replace: true })}
        user={user}
      />
    </section>
  )
}

export default RegisterPage
