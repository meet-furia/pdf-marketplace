import { useAuth } from '../app/AuthProvider'

function EmailVerificationNotice({ user }) {
  const { logout } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Verify your email</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Please verify your email before continuing. We have sent a
          confirmation link to your email.
        </p>
      </div>

      <div className="rounded-lg border border-cyan-200 bg-cyan-50 p-4">
        <p className="text-sm font-semibold text-cyan-950">{user.email}</p>
        <p className="mt-2 text-sm leading-6 text-cyan-800">
          Open the confirmation link from Supabase, then come back and log in.
        </p>
      </div>

      <button
        className="w-full rounded-lg border border-red-200 bg-red-50 px-5 py-3 font-semibold text-red-700 transition hover:bg-red-100"
        onClick={logout}
        type="button"
      >
        Logout
      </button>
    </div>
  )
}

export default EmailVerificationNotice
