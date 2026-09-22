import { apiRequest } from './apiClient'

const SELLER_API = '/api/v1/seller'

export const saveSellerPaymentDetails = (paymentDetails) =>
  apiRequest(`${SELLER_API}/payment-details`, {
    method: 'POST',
    body: JSON.stringify(paymentDetails),
  })

export const getSellerPaymentDetails = () =>
  apiRequest(`${SELLER_API}/payment-details`)

export const getSellerDashboard = () => apiRequest(`${SELLER_API}/dashboard`)
