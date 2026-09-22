import { apiRequest } from './apiClient'

const ADMIN_PRODUCT_API = '/api/v1/admin/products'

export const getPendingProducts = () =>
  apiRequest(`${ADMIN_PRODUCT_API}/pending`)

export const approveProduct = (productId) =>
  apiRequest(`${ADMIN_PRODUCT_API}/${productId}/approve`, {
    method: 'PATCH',
  })

export const rejectProduct = (productId, reason) =>
  apiRequest(`${ADMIN_PRODUCT_API}/${productId}/reject`, {
    method: 'PATCH',
    body: JSON.stringify({ reason }),
  })

export const canAccessAdminProducts = async () => {
  try {
    await getPendingProducts()
    return true
  } catch (error) {
    if (error.status === 403) {
      return false
    }

    throw error
  }
}
