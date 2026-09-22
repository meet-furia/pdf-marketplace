import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyProducts } from '../services/productService'
import { getSellerDashboard } from '../services/sellerService'

const formatMoney = (amount) =>
  new Intl.NumberFormat('en-IN', {
    currency: 'INR',
    maximumFractionDigits: 2,
    style: 'currency',
  }).format(Number(amount || 0))

const countByStatus = (products, statuses) =>
  products.filter((product) => statuses.includes(product.status)).length

function MetricCard({ label, value }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
        {value}
      </p>
    </article>
  )
}

function SellerDashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCurrent = true

    const loadDashboard = async () => {
      setIsLoading(true)
      setError('')

      try {
        const [dashboardResponse, productsResponse] = await Promise.all([
          getSellerDashboard(),
          getMyProducts(),
        ])

        if (isCurrent) {
          setDashboard(dashboardResponse.data)
          setProducts(productsResponse.data || [])
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(loadError.message || 'Unable to load seller dashboard.')
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      isCurrent = false
    }
  }, [])

  const pendingProducts = countByStatus(products, ['PENDING_APPROVAL', 'DRAFT'])
  const approvedProducts = countByStatus(products, ['PUBLISHED'])

  if (isLoading) {
    return (
      <section className="grid min-h-72 place-items-center rounded-lg border border-slate-200 bg-white">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
          Loading seller dashboard
        </p>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
          Seller
        </p>
        <h2 className="mt-3 text-2xl font-black tracking-tight">
          Dashboard
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Track your products, paid orders, and earnings.
        </p>

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total products" value={products.length} />
        <MetricCard label="Total sales/orders" value={dashboard?.paidOrderCount || 0} />
        <MetricCard label="Total earnings" value={formatMoney(dashboard?.totalSellerEarning)} />
        <MetricCard label="Pending products" value={pendingProducts} />
        <MetricCard label="Approved products" value={approvedProducts} />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Link
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/80"
          to="/seller/upload"
        >
          <p className="text-lg font-black text-slate-950">Upload Product</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Add a new digital file and submit it for review.
          </p>
        </Link>

        <Link
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/80"
          to="/seller/products"
        >
          <p className="text-lg font-black text-slate-950">My Products</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Edit product details and check status.
          </p>
        </Link>

        <Link
          className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/80"
          to="/seller/payment-details"
        >
          <p className="text-lg font-black text-slate-950">Payment Details</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Manage payout account information.
          </p>
        </Link>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-black text-slate-950">Revenue summary</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm font-semibold text-slate-500">Gross sales</p>
            <p className="mt-1 text-xl font-black text-slate-950">
              {formatMoney(dashboard?.totalSalesAmount)}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Seller earning</p>
            <p className="mt-1 text-xl font-black text-slate-950">
              {formatMoney(dashboard?.totalSellerEarning)}
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-500">Platform fee</p>
            <p className="mt-1 text-xl font-black text-slate-950">
              {formatMoney(dashboard?.totalPlatformFee)}
            </p>
          </div>
        </div>
      </section>
    </section>
  )
}

export default SellerDashboardPage
