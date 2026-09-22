import { useState } from 'react'
import { Link } from 'react-router-dom'
import { validateUploadFile } from '../services/fileService'
import { uploadProduct } from '../services/productService'

const initialForm = {
  title: '',
  description: '',
  price: '',
  category: '',
}

function SellerUploadPage() {
  const [form, setForm] = useState(initialForm)
  const [productFile, setProductFile] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState('')
  const [createdProduct, setCreatedProduct] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateForm = (field, value) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  const handleProductFileChange = (event) => {
    const file = event.target.files?.[0] || null
    setProductFile(file)
    setError('')

    if (file) {
      try {
        validateUploadFile(file, 'PRODUCT')
      } catch (validationError) {
        setError(validationError.message)
      }
    }
  }

  const handleThumbnailChange = (event) => {
    const file = event.target.files?.[0] || null
    setThumbnailFile(file)
    setError('')

    if (file) {
      try {
        validateUploadFile(file, 'THUMBNAIL')
      } catch (validationError) {
        setError(validationError.message)
      }
    }
  }

  const validateProductForm = () => {
    if (!form.title.trim()) {
      throw new Error('Title is required')
    }

    if (!form.description.trim()) {
      throw new Error('Description is required')
    }

    if (!Number(form.price) || Number(form.price) <= 0) {
      throw new Error('Price must be greater than zero')
    }

    validateUploadFile(productFile, 'PRODUCT')

    if (thumbnailFile) {
      validateUploadFile(thumbnailFile, 'THUMBNAIL')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setCreatedProduct(null)

    try {
      validateProductForm()
      setIsSubmitting(true)

      setProgress('Uploading product...')
      const response = await uploadProduct({
        product: {
          title: form.title.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          category: form.category.trim() || undefined,
        },
        productFile,
        thumbnailFile,
      })

      setCreatedProduct(response.data)
      setForm(initialForm)
      setProductFile(null)
      setThumbnailFile(null)
      setProgress('Product submitted for review.')
      event.target.reset()
    } catch (submitError) {
      setError(submitError.message || 'Unable to create product.')
      setProgress('')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <form
        className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
            Seller upload
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight">
            Create a digital product
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Upload a document, image, archive, audio file, or another digital
            file. Video uploads are not supported yet.
          </p>
        </div>

        <div className="mt-6 grid gap-5">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Title</span>
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              onChange={(event) => updateForm('title', event.target.value)}
              required
              type="text"
              value={form.title}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">
              Description
            </span>
            <textarea
              className="mt-2 min-h-36 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
              onChange={(event) =>
                updateForm('description', event.target.value)
              }
              required
              value={form.description}
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Price
              </span>
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                min="1"
                onChange={(event) => updateForm('price', event.target.value)}
                required
                step="0.01"
                type="number"
                value={form.price}
              />
            </label>

            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Category
              </span>
              <input
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 text-base outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-100"
                onChange={(event) =>
                  updateForm('category', event.target.value)
                }
                type="text"
                value={form.category}
              />
            </label>
          </div>

          <label className="block rounded-lg border border-dashed border-slate-300 p-4">
            <span className="text-sm font-semibold text-slate-700">
              Product file
            </span>
            <input
              className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-slate-950 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
              onChange={handleProductFileChange}
              required
              type="file"
            />
            {productFile && (
              <p className="mt-2 text-sm font-medium text-slate-600">
                {productFile.name}
              </p>
            )}
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Any non-video file up to 10 MB.
            </p>
          </label>

          <label className="block rounded-lg border border-dashed border-slate-300 p-4">
            <span className="text-sm font-semibold text-slate-700">
              Thumbnail image
            </span>
            <input
              accept="image/*"
              className="mt-3 block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 file:ring-1 file:ring-slate-300"
              onChange={handleThumbnailChange}
              type="file"
            />
            {thumbnailFile && (
              <p className="mt-2 text-sm font-medium text-slate-600">
                {thumbnailFile.name}
              </p>
            )}
          </label>
        </div>

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {progress && (
          <div className="mt-5 rounded-lg border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800">
            {progress}
          </div>
        )}

        <button
          className="mt-6 w-full rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'Uploading...' : 'Create product'}
        </button>
      </form>

      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-black text-slate-950">Upload flow</h3>
        <ol className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
          <li>1. Select a private digital file.</li>
          <li>2. Send product details to the backend.</li>
          <li>3. Backend stores files in R2.</li>
          <li>4. Backend creates the product for review.</li>
        </ol>

        {createdProduct && (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-black text-emerald-800">
              Product created
            </p>
            <p className="mt-1 text-sm text-emerald-700">
              {createdProduct.title}
            </p>
            <Link
              className="mt-4 inline-flex rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
              to="/seller/products"
            >
              View seller products
            </Link>
          </div>
        )}
      </aside>
    </section>
  )
}

export default SellerUploadPage
