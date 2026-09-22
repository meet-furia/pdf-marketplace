import { useAuth } from '../app/AuthProvider'

function UserCard({ user }) {
  const { logout } = useAuth()
  const displayName = user.user_metadata?.full_name || user.email

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {user.user_metadata?.avatar_url ? (
          <img
            alt={displayName}
            className="h-14 w-14 rounded-full object-cover"
            src={user.user_metadata.avatar_url}
          />
        ) : (
          <div className="grid h-14 w-14 place-items-center rounded-full bg-cyan-100 text-xl font-bold text-cyan-700">
            {displayName?.charAt(0)?.toUpperCase()}
          </div>
        )}

        <div className="min-w-0">
          <h2 className="truncate text-2xl font-bold">Welcome</h2>
          <p className="truncate text-sm text-slate-600">{displayName}</p>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">
          You are signed in.
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Your marketplace account is ready to use.
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

export default UserCard
