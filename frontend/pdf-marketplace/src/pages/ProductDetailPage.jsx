import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../app/AuthProvider'
import { addCartItem } from '../services/cartService'
import { getProductById } from '../services/productService'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    currency: 'INR',
    maximumFractionDigits: 2,
    style: 'currency',
  }).format(Number(price || 0))

function ProductDetailPage() {
  const { productId } = useParams()
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [error, setError] = useState('')
  const [cartMessage, setCartMessage] = useState('')
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCurrent = true

    const loadProduct = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await getProductById(productId)

        if (isCurrent) {
          setProduct(response.data)
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(loadError.message || 'Unable to load product.')
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      isCurrent = false
    }
  }, [productId])

  const handleAddToCart = async () => {
    setCartMessage('')

    if (!user) {
      navigate('/login', {
        state: {
          from: {
            hash: location.hash,
            pathname: location.pathname,
            search: location.search,
          },
        },
      })
      return
    }

    setIsAddingToCart(true)

    try {
      await addCartItem(productId)
      setCartMessage('Added to cart.')
    } catch (cartError) {
      setCartMessage(cartError.message || 'Unable to add product to cart.')
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (isLoading) {
    return (
      <section className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-6xl place-items-center px-5 py-10 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
          Loading product
        </p>
      </section>
    )
  }

  if (error || !product) {
    return (
      <section className="mx-auto w-full max-w-4xl px-5 py-10 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6">
          <h1 className="text-xl font-black text-red-900">
            Product unavailable
          </h1>
          <p className="mt-2 text-sm leading-6 text-red-700">
            {error || 'We could not find this product.'}
          </p>
          <Link
            className="mt-5 inline-flex rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
            to="/"
          >
            Back to products
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-10 lg:px-8">
      <Link
        className="text-sm font-semibold text-cyan-700 transition hover:text-cyan-900"
        to="/"
      >
        Back to products
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="relative grid aspect-[16/9] place-items-center overflow-hidden rounded-lg bg-slate-100">
            <div className="rounded-md border border-cyan-200 bg-cyan-50 px-5 py-4 text-base font-black uppercase tracking-[0.18em] text-cyan-700">
              {product.fileType || 'FILE'}
            </div>
            {product.thumbnailUrl && (
              <img
                alt={`${product.title} thumbnail`}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none'
                }}
                src={product.thumbnailUrl}
              />
            )}
          </div>

          <div className="mt-6">
            {product.category && (
              <span className="rounded-md bg-cyan-50 px-2 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-700">
                {product.category}
              </span>
            )}
            <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950">
              {product.title}
            </h1>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
              {product.description}
            </p>
          </div>
        </article>

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-slate-500">Price</p>
          <p className="mt-1 text-3xl font-black text-slate-950">
            {formatPrice(product.price)}
          </p>

          <div className="mt-6 rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">Seller</p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {product.sellerName || 'Marketplace seller'}
            </p>
          </div>

          <button
            className="mt-6 w-full rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={isAddingToCart}
            onClick={handleAddToCart}
            type="button"
          >
            {isAddingToCart ? 'Adding...' : 'Add to cart'}
          </button>

          {cartMessage && (
            <p className="mt-4 rounded-lg bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800">
              {cartMessage}
            </p>
          )}
        </aside>
      </div>
    </section>
  )
}

export default ProductDetailPage
