const features = [
  ['Curated PDFs', 'Find useful resources faster.'],
  ['Saved Library', 'Keep purchases in one place.'],
  ['Secure Access', 'Continue with email or Google.'],
]

function LandingHero() {
  return (
    <section className="space-y-8">
      <div className="space-y-5">
        <div className="inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-4 py-2 text-sm font-semibold text-cyan-800">
          PDF Marketplace
        </div>

        <div className="max-w-2xl space-y-4">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-6xl">
            Your digital library, ready when you are.
          </h1>
          <p className="text-lg leading-8 text-slate-600">
            Discover, save, and manage premium PDF resources from one simple
            marketplace account.
          </p>
        </div>
      </div>

      <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
        {features.map(([title, description]) => (
          <div
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            key={title}
          >
            <p className="text-sm font-semibold text-slate-900">{title}</p>
            <p className="mt-2 text-sm leading-5 text-slate-500">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default LandingHero
