import { useState } from 'react'
import {
  loginWithEmail,
  loginWithGoogle,
  signupWithEmail,
} from '../services/authService'

function AuthForm({
  googleRedirectPath = '/',
  initialMode = 'login',
  onAuthenticated,
}) {
  const [authMode, setAuthMode] = useState(initialMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const resetStatus = () => {
    setError('')
    setMessage('')
  }

  const handleEmailAuth = async (event) => {
    event.preventDefault()
    resetStatus()
    setIsSubmitting(true)

    const { data, error: authError } =
      authMode === 'login'
        ? await loginWithEmail(email, password)
        : await signupWithEmail(email, password)

    setIsSubmitting(false)

    if (authError) {
      setError(authError.message)
      return
    }

    if (authMode === 'signup' && !data.session) {
      console.log('Signup access token exists:', false)
      setMessage('Account created. Please check your email to verify your account.')
      return
    }

    console.log('Auth access token exists:', Boolean(data.session?.access_token))
    setMessage(authMode === 'login' ? 'Logged in successfully.' : 'Account created.')
    onAuthenticated?.()
  }

  const handleGoogleLogin = async () => {
    resetStatus()
    setIsSubmitting(true)

    const { error: authError } = await loginWithGoogle(googleRedirectPath)

    setIsSubmitting(false)

    if (authError) {
      setError(authError.message)
    }
  }

  const selectAuthMode = (mode) => {
    setAuthMode(mode)
    resetStatus()
  }

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">
            {authMode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {authMode === 'login'
              ? 'Login to continue to your account.'
              : 'Create your account and start building your library.'}
          </p>
        </div>

        <div className="grid grid-cols-2 rounded-lg bg-slate-100 p-1">
          <button
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              authMode === 'login'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
            onClick={() => selectAuthMode('login')}
            type="button"
          >
            Login
          </button>
          <button
            className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
              authMode === 'signup'
                ? 'bg-white text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-950'
            }`}
            onClick={() => selectAuthMode('signup')}
            type="button"
          >
            Sign up
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleEmailAuth}>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              autoComplete="email"
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              autoComplete={
                authMode === 'login' ? 'current-password' : 'new-password'
              }
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              minLength={6}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              required
              type="password"
              value={password}
            />
          </label>

          <button
            className="w-full rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? 'Please wait...'
              : authMode === 'login'
                ? 'Login'
                : 'Create account'}
          </button>
        </form>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
            Or
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <button
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-800 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
          disabled={isSubmitting}
          onClick={handleGoogleLogin}
          type="button"
        >
          <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-sm font-bold text-blue-600 shadow-sm">
            G
          </span>
          Continue with Google
        </button>
      </div>

      {(error || message) && (
        <p
          className={`mt-5 rounded-lg px-4 py-3 text-sm ${
            error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          {error || message}
        </p>
      )}
    </>
  )
}

export default AuthForm
