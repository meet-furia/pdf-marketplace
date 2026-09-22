import { apiMultipartRequest, apiRequest } from './apiClient'

const CUSTOMER_PRODUCT_API = '/api/v1/customer/products'
const SELLER_PRODUCT_API = '/api/v1/seller/products'

// Converts defined filter values into a URL query string.
const buildQueryString = (params = {}) => {
  const query = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.set(key, value)
    }
  })

  const queryString = query.toString()
  return queryString ? `?${queryString}` : ''
}

// Fetches one paginated page of published marketplace products.
export const getPublishedProductPage = (params = {}) =>
  apiRequest(
    `${CUSTOMER_PRODUCT_API}${buildQueryString({
      page: 0,
      size: 12,
      sortField: 'createdAt',
      sortDirection: 'DESC',
      ...params,
    })}` 
  )

// Creates a product by sending its metadata and files as multipart form data.
export const uploadProduct = ({ product, productFile, thumbnailFile }) => {
  const formData = new FormData()

  formData.append('title', product.title)
  formData.append('description', product.description)
  formData.append('price', String(product.price))

  if (product.category) {
    formData.append('category', product.category)
  }

  formData.append('productFile', productFile)

  if (thumbnailFile) {
    formData.append('thumbnailFile', thumbnailFile)
  }

  return apiMultipartRequest(`${SELLER_PRODUCT_API}/upload`, formData)
}

// Updates product metadata and includes replacement files only when selected.
export const updateProduct = (
  productId,
  { product, productFile, thumbnailFile }
) => {
  const formData = new FormData()

  formData.append('title', product.title)
  formData.append('description', product.description)
  formData.append('price', String(product.price))

  if (product.category) {
    formData.append('category', product.category)
  }

  // Optional files are omitted entirely so the backend preserves existing objects.
  if (productFile) {
    formData.append('productFile', productFile)
  }

  if (thumbnailFile) {
    formData.append('thumbnailFile', thumbnailFile)
  }

  return apiMultipartRequest(`${SELLER_PRODUCT_API}/${productId}`, formData, {
    method: 'PUT',
  })
}

// Fetches one published product for its public detail page.
export const getProductById = (productId) =>
  apiRequest(`${CUSTOMER_PRODUCT_API}/${productId}`)

// Fetches the complete published-product list.
export const getPublishedProducts = () =>
  apiRequest(CUSTOMER_PRODUCT_API)

// Fetches all products owned by the current seller.
export const getMyProducts = () => apiRequest(SELLER_PRODUCT_API)
