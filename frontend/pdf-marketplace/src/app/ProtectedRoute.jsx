import { Navigate, Outlet, useLocation } from 'react-router-dom'
import EmailVerificationNotice from '../components/EmailVerificationNotice'
import { useAuth } from './AuthProvider'

function ProtectedRoute({ children }) {
  const { user, isLoadingSession } = useAuth()
  const location = useLocation()

  if (isLoadingSession) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f7fb] px-6 text-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
          Loading
        </p>
      </main>
    )
  }

  if (!user) {
    return <Navigate replace state={{ from: location }} to="/login" />
  }

  if (!user.email_confirmed_at) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f7fb] px-5 py-10 text-slate-900">
        <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <EmailVerificationNotice user={user} />
        </section>
      </main>
    )
  }

  return children ?? <Outlet />
}

export default ProtectedRoute
