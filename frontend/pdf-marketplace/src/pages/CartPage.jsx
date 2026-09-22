import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearCart, getMyCart, removeCartItem } from '../services/cartService'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    currency: 'INR',
    maximumFractionDigits: 2,
    style: 'currency',
  }).format(Number(price || 0))

function CartPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [error, setError] = useState('')
  const [isClearing, setIsClearing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [removingItemId, setRemovingItemId] = useState(null)

  useEffect(() => {
    let isCurrent = true

    const loadCart = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await getMyCart()

        if (isCurrent) {
          setCart(response.data)
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(loadError.message || 'Unable to load cart.')
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    loadCart()

    return () => {
      isCurrent = false
    }
  }, [])

  const handleRemoveItem = async (cartItemId) => {
    setError('')
    setRemovingItemId(cartItemId)

    try {
      const response = await removeCartItem(cartItemId)
      setCart(response.data)
    } catch (removeError) {
      setError(removeError.message || 'Unable to remove cart item.')
    } finally {
      setRemovingItemId(null)
    }
  }

  const handleClearCart = async () => {
    setError('')
    setIsClearing(true)

    try {
      const response = await clearCart()
      setCart(response.data)
    } catch (clearError) {
      setError(clearError.message || 'Unable to clear cart.')
    } finally {
      setIsClearing(false)
    }
  }

  const items = cart?.items || []
  const hasItems = items.length > 0

  if (isLoading) {
    return (
      <section className="grid min-h-72 place-items-center rounded-lg border border-slate-200 bg-white">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
          Loading cart
        </p>
      </section>
    )
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
              Cart
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight">
              Your selected products
            </h2>
          </div>

          {hasItems && (
            <button
              className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isClearing}
              onClick={handleClearCart}
              type="button"
            >
              {isClearing ? 'Clearing...' : 'Clear cart'}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {!hasItems ? (
          <div className="mt-8 rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <h3 className="text-xl font-black text-slate-950">
              Your cart is empty
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Browse published products and add the ones you want to buy.
            </p>
            <Link
              className="mt-5 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              to="/"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="mt-6 divide-y divide-slate-200">
            {items.map((item) => (
              <article
                className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
                key={item.id}
              >
                <div className="flex min-w-0 gap-4">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-md bg-slate-100 text-xs font-black uppercase tracking-[0.16em] text-cyan-700">
                    {item.fileType || 'FILE'}
                  </div>
                  <div className="min-w-0">
                    <Link
                      className="font-black text-slate-950 transition hover:text-cyan-700"
                      to={`/products/${item.productId}`}
                    >
                      {item.productTitle}
                    </Link>
                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      {formatPrice(item.currentPrice)}
                    </p>
                  </div>
                </div>

                <button
                  className="self-start rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 sm:self-center"
                  disabled={removingItemId === item.id}
                  onClick={() => handleRemoveItem(item.id)}
                  type="button"
                >
                  {removingItemId === item.id ? 'Removing...' : 'Remove'}
                </button>
              </article>
            ))}
          </div>
        )}
      </div>

      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-500">Total</p>
        <p className="mt-1 text-3xl font-black text-slate-950">
          {formatPrice(cart?.totalAmount)}
        </p>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {items.length} {items.length === 1 ? 'item' : 'items'} in cart.
        </p>

        <button
          className="mt-6 w-full rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={!hasItems}
          onClick={() => navigate('/checkout')}
          type="button"
        >
          Checkout
        </button>
      </aside>
    </section>
  )
}

export default CartPage
