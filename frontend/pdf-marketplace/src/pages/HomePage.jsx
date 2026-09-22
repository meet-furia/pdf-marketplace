import { useEffect, useState } from 'react'
import ProductGrid from '../components/product/ProductGrid'
import { getPublishedProductPage } from '../services/productService'

const PAGE_SIZE = 12

function HomePage() {
  const [page, setPage] = useState(0)
  const [productPage, setProductPage] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCurrent = true

    const loadProducts = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await getPublishedProductPage({
          page,
          size: PAGE_SIZE,
          sortField: 'createdAt',
          sortDirection: 'DESC',
        })

        if (isCurrent) {
          setProductPage(response.data)
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(loadError.message || 'Unable to load products.')
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isCurrent = false
    }
  }, [page])

  const products = productPage?.content || []
  const isFirstPage = productPage?.first ?? page === 0
  const isLastPage = productPage?.last ?? true
  const totalPages = productPage?.totalPages || 0

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
            Marketplace
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950">
            Published digital products
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Browse digital products from sellers. Sign in only when you are
            ready to buy, manage your cart, or access your library.
          </p>
        </div>

        {totalPages > 0 && (
          <p className="text-sm font-semibold text-slate-600">
            Page {page + 1} of {totalPages}
          </p>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="grid min-h-72 place-items-center rounded-lg border border-slate-200 bg-white">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
            Loading products
          </p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}

      {!isLoading && !error && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between gap-4">
          <button
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isFirstPage}
            onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 0))}
            type="button"
          >
            Previous
          </button>

          <p className="text-sm font-semibold text-slate-600">
            {productPage?.totalElements || 0} products
          </p>

          <button
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={isLastPage}
            onClick={() =>
              setPage((currentPage) =>
                Math.min(currentPage + 1, Math.max(totalPages - 1, 0))
              )
            }
            type="button"
          >
            Next
          </button>
        </div>
      )}
    </section>
  )
}

export default HomePage
