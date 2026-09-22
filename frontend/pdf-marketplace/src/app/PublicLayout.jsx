import { Link, NavLink, Outlet } from 'react-router-dom'
import CartIcon from '../components/navigation/CartIcon'
import MarketplaceModeToggle from '../components/navigation/MarketplaceModeToggle'
import { useMarketplaceMode } from '../hooks/useMarketplaceMode'
import { useAuth } from './AuthProvider'

const customerLinks = [
  { label: 'Products', to: '/' },
]

const sellerLinks = [
  { label: 'Seller', to: '/seller' },
  { label: 'Products', to: '/seller/products' },
  { label: 'Payouts', to: '/seller/payment-details' },
]

function PublicLayout() {
  const { logout, user } = useAuth()
  const { isCustomerMode, mode, setMode } = useMarketplaceMode()
  const displayName = user?.user_metadata?.full_name || user?.email
  const visibleLinks = isCustomerMode ? customerLinks : sellerLinks

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-5 py-4 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link className="text-lg font-black tracking-tight" to="/">
              PDF Marketplace
            </Link>

            <MarketplaceModeToggle mode={mode} onChange={setMode} />

            <div className="flex items-center gap-2">
              {isCustomerMode && (
                <Link
                  aria-label="Cart"
                  className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-800 transition hover:bg-slate-100"
                  to="/cart"
                  title="Cart"
                >
                  <CartIcon />
                </Link>
              )}

            {user ? (
              <>
                <span className="hidden max-w-44 truncate text-sm font-medium text-slate-600 sm:inline">
                  {displayName}
                </span>
                <button
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                  onClick={logout}
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  to="/login"
                >
                  Login
                </Link>
                <Link
                  className="rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                  to="/register"
                >
                  Register
                </Link>
              </>
            )}
            </div>
          </div>

          <nav className="flex gap-1 overflow-x-auto pb-1">
            {visibleLinks.map((link) => (
              <NavLink
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-cyan-50 text-cyan-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  }`
                }
                key={link.to}
                to={link.to}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <Outlet />
    </main>
  )
}

export default PublicLayout
