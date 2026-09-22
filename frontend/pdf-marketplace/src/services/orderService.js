import { apiRequest } from './apiClient'

const ORDER_API = '/api/v1/customer/orders'

export const getMyOrders = () => apiRequest(ORDER_API)

export const getOrderById = (orderId) => apiRequest(`${ORDER_API}/${orderId}`)
