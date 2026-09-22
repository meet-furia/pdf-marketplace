import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import CartIcon from '../components/navigation/CartIcon'
import { useMarketplaceMode } from '../hooks/useMarketplaceMode'
import { canAccessAdminProducts } from '../services/adminProductService'
import { useAuth } from './AuthProvider'

const customerLinks = [
  { icon: CartIcon, label: 'Cart', to: '/cart' },
]

const sellerLinks = [
  { label: 'Seller', to: '/seller' },
  { label: 'Products', to: '/seller/products' },
  { label: 'Payouts', to: '/seller/payment-details' },
]

const adminLinks = [
  { label: 'Review', to: '/admin/products/pending' },
]

function DashboardLayout() {
  const { logout, user } = useAuth()
  const location = useLocation()
  const { mode, setMode } = useMarketplaceMode()
  const [canShowAdminLinks, setCanShowAdminLinks] = useState(false)
  const displayName = user?.user_metadata?.full_name || user?.email

  useEffect(() => {
    let isCurrent = true

    const checkAdminAccess = async () => {
      setCanShowAdminLinks(false)

      try {
        const hasAccess = await canAccessAdminProducts()

        if (isCurrent) {
          setCanShowAdminLinks(hasAccess)
        }
      } catch (error) {
        if (isCurrent) {
          setCanShowAdminLinks(false)
        }
      }
    }

    checkAdminAccess()

    return () => {
      isCurrent = false
    }
  }, [user?.id])

  useEffect(() => {
    if (location.pathname.startsWith('/seller')) {
      setMode('seller')
      return
    }

    if (
      location.pathname.startsWith('/cart') ||
      location.pathname.startsWith('/checkout') ||
      location.pathname.startsWith('/library')
    ) {
      setMode('customer')
    }
  }, [location.pathname])

  const modeLinks = mode === 'seller' ? sellerLinks : customerLinks
  const visibleLinks = canShowAdminLinks
    ? [...modeLinks, ...adminLinks]
    : modeLinks

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
              Dashboard
            </p>
            <Link className="text-xl font-black tracking-tight" to="/">
              PDF Marketplace
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <p className="hidden max-w-56 truncate text-sm font-medium text-slate-600 sm:block">
              {displayName}
            </p>
            <button
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
              onClick={logout}
              type="button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:px-8">
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <nav className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {visibleLinks.map((link) => {
              const Icon = link.icon

              return (
                <NavLink
                  className={({ isActive }) =>
                    `flex whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-cyan-50 text-cyan-700'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                    }`
                  }
                  key={link.to}
                  to={link.to}
                >
                  {Icon && <Icon className="mr-2 h-5 w-5" />}
                  {link.label}
                </NavLink>
              )
            })}
          </nav>
        </aside>

        <Outlet />
      </div>
    </main>
  )
}

export default DashboardLayout
