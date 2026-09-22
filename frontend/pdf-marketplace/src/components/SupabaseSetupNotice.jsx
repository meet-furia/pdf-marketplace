function SupabaseSetupNotice() {
  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-bold">Connect Supabase</h2>
      <p className="text-sm leading-6 text-slate-600">
        Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to your
        frontend `.env` file, then restart Vite.
      </p>
    </div>
  )
}

export default SupabaseSetupNotice
