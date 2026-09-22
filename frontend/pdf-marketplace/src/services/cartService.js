import { apiRequest } from './apiClient'

const CART_API = '/api/v1/customer/cart'

export const getMyCart = () => apiRequest(CART_API)

export const addCartItem = (productId) =>
  apiRequest(`${CART_API}/items`, {
    method: 'POST',
    body: JSON.stringify({ productId }),
  })

export const removeCartItem = (cartItemId) =>
  apiRequest(`${CART_API}/items/${cartItemId}`, {
    method: 'DELETE',
  })

export const clearCart = () =>
  apiRequest(`${CART_API}/items`, {
    method: 'DELETE',
  })
