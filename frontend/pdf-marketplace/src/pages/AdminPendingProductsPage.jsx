import { useEffect, useState } from 'react'
import {
  approveProduct,
  getPendingProducts,
  rejectProduct,
} from '../services/adminProductService'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    currency: 'INR',
    maximumFractionDigits: 2,
    style: 'currency',
  }).format(Number(price || 0))

const isForbiddenError = (error) =>
  /forbidden|access denied|not admin|403/i.test(error?.message || '')

function AdminPendingProductsPage() {
  const [pendingProducts, setPendingProducts] = useState([])
  const [rejectReasons, setRejectReasons] = useState({})
  const [actionProductId, setActionProductId] = useState(null)
  const [error, setError] = useState('')
  const [forbidden, setForbidden] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCurrent = true

    const loadPendingProducts = async () => {
      setIsLoading(true)
      setError('')
      setForbidden(false)

      try {
        const response = await getPendingProducts()

        if (isCurrent) {
          setPendingProducts(response.data || [])
        }
      } catch (loadError) {
        if (isCurrent) {
          if (isForbiddenError(loadError)) {
            setForbidden(true)
          }

          setError(loadError.message || 'Unable to load pending products.')
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    loadPendingProducts()

    return () => {
      isCurrent = false
    }
  }, [])

  const removeProductFromList = (productId) => {
    setPendingProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== productId)
    )
  }

  const handleApprove = async (productId) => {
    setError('')
    setActionProductId(productId)

    try {
      await approveProduct(productId)
      removeProductFromList(productId)
    } catch (approveError) {
      if (isForbiddenError(approveError)) {
        setForbidden(true)
      }

      setError(approveError.message || 'Unable to approve product.')
    } finally {
      setActionProductId(null)
    }
  }

  const handleReject = async (productId) => {
    setError('')
    setActionProductId(productId)

    try {
      await rejectProduct(productId, rejectReasons[productId] || '')
      removeProductFromList(productId)
      setRejectReasons((currentReasons) => {
        const nextReasons = { ...currentReasons }
        delete nextReasons[productId]
        return nextReasons
      })
    } catch (rejectError) {
      if (isForbiddenError(rejectError)) {
        setForbidden(true)
      }

      setError(rejectError.message || 'Unable to reject product.')
    } finally {
      setActionProductId(null)
    }
  }

  const updateRejectReason = (productId, reason) => {
    setRejectReasons((currentReasons) => ({
      ...currentReasons,
      [productId]: reason,
    }))
  }

  if (isLoading) {
    return (
      <section className="grid min-h-72 place-items-center rounded-lg border border-slate-200 bg-white">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
          Loading pending products
        </p>
      </section>
    )
  }

  if (forbidden) {
    return (
      <section className="rounded-lg border border-red-200 bg-red-50 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">
          Forbidden
        </p>
        <h2 className="mt-3 text-2xl font-black tracking-tight text-red-950">
          Admin access required
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-red-700">
          The backend denied access to pending product review. Use an account
          configured as an admin to continue.
        </p>
        {error && <p className="mt-4 text-sm font-semibold text-red-700">{error}</p>}
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
          Admin review
        </p>
        <h2 className="mt-3 text-2xl font-black tracking-tight">
          Pending products
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Review seller submissions and publish or reject them.
        </p>
      </div>

      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {!pendingProducts.length ? (
        <div className="mt-8 rounded-lg border border-dashed border-slate-300 p-8 text-center">
          <h3 className="text-xl font-black text-slate-950">
            No pending products
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            New seller submissions will appear here for approval.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {pendingProducts.map((product) => (
            <article
              className="rounded-lg border border-slate-200 p-5"
              key={product.id}
            >
              <div className="flex flex-col justify-between gap-4 lg:flex-row">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-black text-slate-950">
                      {product.title}
                    </h3>
                    <span className="rounded-md bg-amber-50 px-2 py-1 text-xs font-black uppercase tracking-[0.14em] text-amber-700 ring-1 ring-amber-200">
                      {product.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {product.category || 'Uncategorized'} -{' '}
                    {formatPrice(product.price)}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Seller: {product.sellerName || 'Unknown seller'}
                  </p>
                </div>

                <button
                  className="h-fit rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  disabled={actionProductId === product.id}
                  onClick={() => handleApprove(product.id)}
                  type="button"
                >
                  {actionProductId === product.id ? 'Working...' : 'Approve'}
                </button>
              </div>

              <p className="mt-4 text-sm leading-6 text-slate-600">
                {product.description}
              </p>

              <div className="mt-5 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                <label className="block">
                  <span className="text-sm font-semibold text-slate-700">
                    Rejection reason
                  </span>
                  <input
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                    onChange={(event) =>
                      updateRejectReason(product.id, event.target.value)
                    }
                    placeholder="Optional note for rejection"
                    value={rejectReasons[product.id] || ''}
                  />
                </label>

                <button
                  className="self-end rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={actionProductId === product.id}
                  onClick={() => handleReject(product.id)}
                  type="button"
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default AdminPendingProductsPage
