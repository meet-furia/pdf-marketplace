function MarketplaceModeToggle({ mode, onChange }) {
  return (
    <div className="grid w-full grid-cols-2 rounded-lg bg-slate-100 p-1 sm:w-72">
      <button
        className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
          mode === 'customer'
            ? 'bg-white text-slate-950 shadow-sm'
            : 'text-slate-600 hover:text-slate-950'
        }`}
        onClick={() => onChange('customer')}
        type="button"
      >
        Customer
      </button>
      <button
        className={`rounded-md px-3 py-2 text-sm font-semibold transition ${
          mode === 'seller'
            ? 'bg-white text-slate-950 shadow-sm'
            : 'text-slate-600 hover:text-slate-950'
        }`}
        onClick={() => onChange('seller')}
        type="button"
      >
        Seller
      </button>
    </div>
  )
}

export default MarketplaceModeToggle
