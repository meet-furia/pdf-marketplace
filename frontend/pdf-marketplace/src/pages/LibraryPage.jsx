import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getMyLibrary,
  getPurchasedPdfDownloadUrl,
  openSignedDownloadUrl,
} from '../services/libraryService'

const formatDate = (value) => {
  if (!value) {
    return 'Available'
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function LibraryPage() {
  const [library, setLibrary] = useState([])
  const [downloadingProductId, setDownloadingProductId] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCurrent = true

    const loadLibrary = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await getMyLibrary()

        if (isCurrent) {
          setLibrary(response.data || [])
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(loadError.message || 'Unable to load your library.')
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    loadLibrary()

    return () => {
      isCurrent = false
    }
  }, [])

  const handleDownload = async (productId) => {
    setError('')
    setDownloadingProductId(productId)

    try {
      const downloadUrl = await getPurchasedPdfDownloadUrl(productId)
      openSignedDownloadUrl(downloadUrl)
    } catch (downloadError) {
      setError(downloadError.message || 'Unable to start download.')
    } finally {
      setDownloadingProductId(null)
    }
  }

  if (isLoading) {
    return (
      <section className="grid min-h-72 place-items-center rounded-lg border border-slate-200 bg-white">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
          Loading library
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
          Library
        </p>
        <h2 className="mt-3 text-2xl font-black tracking-tight">
          Purchased products
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Download your purchased files through secure temporary links.
        </p>
      </div>

      {error && (
        <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {!library.length ? (
        <div className="mt-8 rounded-lg border border-dashed border-slate-300 p-8 text-center">
          <h3 className="text-xl font-black text-slate-950">
            Your library is empty
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Purchased products will appear here after payment is verified.
          </p>
          <Link
            className="mt-5 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            to="/"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {library.map((item) => (
            <article
              className="flex flex-col rounded-lg border border-slate-200 p-5"
              key={item.id}
            >
              <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-md bg-slate-100">
                <div className="rounded-md border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-black uppercase tracking-[0.18em] text-cyan-700">
                  {item.fileType || 'FILE'}
                </div>
                {item.thumbnailUrl && (
                  <img
                    alt={`${item.title} thumbnail`}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.style.display = 'none'
                    }}
                    src={item.thumbnailUrl}
                  />
                )}
              </div>

              <div className="mt-4 flex flex-1 flex-col">
                <div className="flex flex-wrap items-center gap-2">
                  {item.category && (
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                      {item.category}
                    </span>
                  )}
                  <span className="text-xs font-semibold text-slate-500">
                    {formatDate(item.accessGrantedAt)}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-black leading-snug text-slate-950">
                  {item.title}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">
                  {item.description}
                </p>
                {item.fileOriginalName && (
                  <p className="mt-2 truncate text-xs font-semibold text-slate-500">
                    {item.fileOriginalName}
                  </p>
                )}

                <button
                  className="mt-5 w-full rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
                  disabled={downloadingProductId === item.productId}
                  onClick={() => handleDownload(item.productId)}
                  type="button"
                >
                  {downloadingProductId === item.productId
                    ? 'Preparing...'
                    : 'Download'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default LibraryPage
