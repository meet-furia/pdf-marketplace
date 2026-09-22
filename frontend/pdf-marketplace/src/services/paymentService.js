import { apiRequest } from './apiClient'

const CHECKOUT_API = '/api/v1/customer/checkout'
const RAZORPAY_CHECKOUT_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js'

export const createCheckout = () =>
  apiRequest(CHECKOUT_API, {
    method: 'POST',
  })

export const verifyPayment = (paymentDetails) =>
  apiRequest(`${CHECKOUT_API}/verify`, {
    method: 'POST',
    body: JSON.stringify(paymentDetails),
  })

export const loadRazorpayCheckout = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve()
      return
    }

    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_CHECKOUT_SCRIPT}"]`
    )

    if (existingScript) {
      existingScript.addEventListener('load', resolve, { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Unable to load Razorpay checkout')),
        { once: true }
      )
      return
    }

    const script = document.createElement('script')
    script.src = RAZORPAY_CHECKOUT_SCRIPT
    script.async = true
    script.onload = resolve
    script.onerror = () => reject(new Error('Unable to load Razorpay checkout'))
    document.body.appendChild(script)
  })
