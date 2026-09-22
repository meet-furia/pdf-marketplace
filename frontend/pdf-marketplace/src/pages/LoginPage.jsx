import { useMemo } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard'
import LandingHero from '../components/LandingHero'
import { useAuth } from '../app/AuthProvider'

const isSupabaseConfigured = () =>
  Boolean(
    import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  )

const getRedirectPath = (location) => {
  const from = location.state?.from

  if (!from?.pathname || from.pathname === '/login') {
    return '/'
  }

  return `${from.pathname}${from.search || ''}${from.hash || ''}`
}

function LoginPage() {
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const configured = useMemo(() => isSupabaseConfigured(), [])
  const redirectPath = getRedirectPath(location)

  if (user?.email_confirmed_at) {
    return <Navigate replace to={redirectPath} />
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-6xl items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_430px] lg:px-8">
      <LandingHero />
      <AuthCard
        googleRedirectPath={redirectPath}
        initialAuthMode="login"
        isSupabaseConfigured={configured}
        onAuthenticated={() => navigate(redirectPath, { replace: true })}
        user={user}
      />
    </section>
  )
}

export default LoginPage
