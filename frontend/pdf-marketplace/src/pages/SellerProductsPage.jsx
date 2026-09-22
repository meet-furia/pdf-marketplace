import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { validateUploadFile } from '../services/fileService'
import { getMyProducts, updateProduct } from '../services/productService'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    currency: 'INR',
    maximumFractionDigits: 2,
    style: 'currency',
  }).format(Number(price || 0))

const statusStyles = {
  DELETED: 'bg-red-50 text-red-700 ring-red-200',
  DRAFT: 'bg-slate-100 text-slate-700 ring-slate-200',
  PENDING_APPROVAL: 'bg-amber-50 text-amber-700 ring-amber-200',
  PUBLISHED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  REJECTED: 'bg-red-50 text-red-700 ring-red-200',
  UNPUBLISHED: 'bg-slate-100 text-slate-700 ring-slate-200',
}

const toEditableProduct = (product) => ({
  category: product.category || '',
  description: product.description || '',
  price: product.price || '',
  productFile: null,
  thumbnailFile: null,
  title: product.title || '',
})

function SellerProductsPage() {
  const [products, setProducts] = useState([])
  const [editingById, setEditingById] = useState({})
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [savingProductId, setSavingProductId] = useState(null)

  useEffect(() => {
    let isCurrent = true

    const loadProducts = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await getMyProducts()

        if (isCurrent) {
          setProducts(response.data || [])
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(loadError.message || 'Unable to load seller products.')
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
  }, [])

  const startEditing = (product) => {
    setEditingById((current) => ({
      ...current,
      [product.id]: toEditableProduct(product),
    }))
  }

  const cancelEditing = (productId) => {
    setEditingById((current) => {
      const next = { ...current }
      delete next[productId]
      return next
    })
  }

  const updateEditingField = (productId, field, value) => {
    setEditingById((current) => ({
      ...current,
      [productId]: {
        ...current[productId],
        [field]: value,
      },
    }))
  }

  const saveProduct = async (product) => {
    const edits = editingById[product.id]

    if (!edits.title.trim()) {
      setError('Title is required')
      return
    }

    if (!edits.description.trim()) {
      setError('Description is required')
      return
    }

    if (!Number(edits.price) || Number(edits.price) <= 0) {
      setError('Price must be greater than zero')
      return
    }

    try {
      if (edits.productFile) {
        validateUploadFile(edits.productFile, 'PRODUCT')
      }

      if (edits.thumbnailFile) {
        validateUploadFile(edits.thumbnailFile, 'THUMBNAIL')
      }
    } catch (validationError) {
      setError(validationError.message)
      return
    }

    setError('')
    setSavingProductId(product.id)

    try {
      const response = await updateProduct(product.id, {
        product: {
          title: edits.title.trim(),
          description: edits.description.trim(),
          price: Number(edits.price),
          category: edits.category.trim() || undefined,
        },
        productFile: edits.productFile,
        thumbnailFile: edits.thumbnailFile,
      })

      setProducts((currentProducts) =>
        currentProducts.map((currentProduct) =>
          currentProduct.id === product.id ? response.data : currentProduct
        )
      )
      cancelEditing(product.id)
    } catch (saveError) {
      setError(saveError.message || 'Unable to update product.')
    } finally {
      setSavingProductId(null)
    }
  }

  if (isLoading) {
    return (
      <section className="grid min-h-72 place-items-center rounded-lg border border-slate-200 bg-white">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
          Loading products
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
            Seller products
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight">
            Manage your products
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Edit product details and keep track of publishing status.
          </p>
        </div>

        <Link
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          to="/seller/upload"
        >
          Upload product
        </Link>
      </div>

      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {!products.length ? (
        <div className="mt-8 rounded-lg border border-dashed border-slate-300 p-8 text-center">
          <h3 className="text-xl font-black text-slate-950">
            No products yet
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Upload your first digital product to start selling.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {products.map((product) => {
            const edits = editingById[product.id]
            const isEditing = Boolean(edits)

            return (
              <article
                className="rounded-lg border border-slate-200 p-5"
                key={product.id}
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-black text-slate-950">
                        {product.title}
                      </h3>
                      <span
                        className={`rounded-md px-2 py-1 text-xs font-black uppercase tracking-[0.14em] ring-1 ${
                          statusStyles[product.status] ||
                          'bg-slate-100 text-slate-700 ring-slate-200'
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {product.category || 'Uncategorized'} -{' '}
                      {formatPrice(product.price)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                          onClick={() => cancelEditing(product.id)}
                          type="button"
                        >
                          Cancel
                        </button>
                        <button
                          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                          disabled={savingProductId === product.id}
                          onClick={() => saveProduct(product)}
                          type="button"
                        >
                          {savingProductId === product.id ? 'Saving...' : 'Save'}
                        </button>
                      </>
                    ) : (
                      <button
                        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        onClick={() => startEditing(product)}
                        type="button"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="mt-5 grid gap-4">
                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">
                        Title
                      </span>
                      <input
                        className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                        onChange={(event) =>
                          updateEditingField(
                            product.id,
                            'title',
                            event.target.value
                          )
                        }
                        value={edits.title}
                      />
                    </label>

                    <label className="block">
                      <span className="text-sm font-semibold text-slate-700">
                        Description
                      </span>
                      <textarea
                        className="mt-2 min-h-28 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                        onChange={(event) =>
                          updateEditingField(
                            product.id,
                            'description',
                            event.target.value
                          )
                        }
                        value={edits.description}
                      />
                    </label>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="block">
                        <span className="text-sm font-semibold text-slate-700">
                          Price
                        </span>
                        <input
                          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                          min="1"
                          onChange={(event) =>
                            updateEditingField(
                              product.id,
                              'price',
                              event.target.value
                            )
                          }
                          step="0.01"
                          type="number"
                          value={edits.price}
                        />
                      </label>

                      <label className="block">
                        <span className="text-sm font-semibold text-slate-700">
                          Category
                        </span>
                        <input
                          className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                          onChange={(event) =>
                            updateEditingField(
                              product.id,
                              'category',
                              event.target.value
                            )
                          }
                          value={edits.category}
                        />
                      </label>

                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="block rounded-lg border border-dashed border-slate-300 p-4">
                        <span className="text-sm font-semibold text-slate-700">
                          Replace product file
                        </span>
                        <input
                          className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
                          onChange={(event) =>
                            updateEditingField(
                              product.id,
                              'productFile',
                              event.target.files?.[0] || null
                            )
                          }
                          type="file"
                        />
                        <p className="mt-2 truncate text-xs text-slate-500">
                          Current: {product.fileOriginalName || product.fileType}
                        </p>
                      </label>

                      <label className="block rounded-lg border border-dashed border-slate-300 p-4">
                        <span className="text-sm font-semibold text-slate-700">
                          Replace thumbnail
                        </span>
                        <input
                          accept="image/*"
                          className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 file:ring-1 file:ring-slate-300"
                          onChange={(event) =>
                            updateEditingField(
                              product.id,
                              'thumbnailFile',
                              event.target.files?.[0] || null
                            )
                          }
                          type="file"
                        />
                        <p className="mt-2 text-xs text-slate-500">
                          Leave empty to keep the current thumbnail.
                        </p>
                      </label>
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">
                    {product.description}
                  </p>
                )}
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default SellerProductsPage
