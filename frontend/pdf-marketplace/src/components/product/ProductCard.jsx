import { useState } from 'react'
import { Link } from 'react-router-dom'

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN', {
    currency: 'INR',
    maximumFractionDigits: 2,
    style: 'currency',
  }).format(Number(price || 0))

function ProductCard({ product }) {
  const [thumbnailFailed, setThumbnailFailed] = useState(false)
  const showThumbnail = product.thumbnailUrl && !thumbnailFailed

  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/80">
      <Link
        className="flex h-full flex-col p-5"
        to={`/products/${product.id}`}
      >
        <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-md bg-slate-100">
          {showThumbnail ? (
            <img
              alt={`${product.title} thumbnail`}
              className="h-full w-full object-cover"
              onError={() => setThumbnailFailed(true)}
              src={product.thumbnailUrl}
            />
          ) : (
            <div className="rounded-md border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-cyan-700">
              {product.fileType || 'FILE'}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-1 flex-col">
          <div className="flex items-start justify-between gap-3">
            <h2 className="line-clamp-2 text-lg font-black leading-snug text-slate-950">
              {product.title}
            </h2>
            {product.category && (
              <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                {product.category}
              </span>
            )}
          </div>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
            {product.description}
          </p>

          <div className="mt-auto pt-5">
            <p className="text-xs font-semibold text-slate-500">
              {product.sellerName || 'Marketplace seller'}
            </p>
            <p className="mt-1 text-xl font-black text-slate-950">
              {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default ProductCard
