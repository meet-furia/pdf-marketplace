import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getMyCart } from '../services/cartService'
import {
  createCheckout,
  loadRazorpayCheckout,
  verifyPayment,
} from '../services/paymentService'

const formatPrice = (price, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    currency,
    maximumFractionDigits: 2,
    style: 'currency',
  }).format(Number(price || 0))

function CheckoutPage() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [completedPayment, setCompletedPayment] = useState(null)
  const [error, setError] = useState('')
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState('')

  useEffect(() => {
    let isCurrent = true

    const loadCart = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await getMyCart()

        if (isCurrent) {
          setCart(response.data)
        }
      } catch (loadError) {
        if (isCurrent) {
          setError(loadError.message || 'Unable to load checkout summary.')
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    loadCart()

    return () => {
      isCurrent = false
    }
  }, [])

  const toRazorpayAmount = (amount) => Math.round(Number(amount || 0) * 100)

  const openRazorpayCheckout = async (payment) => {
    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID || payment.keyId

    if (!keyId) {
      throw new Error('Razorpay key is not configured')
    }

    await loadRazorpayCheckout()

    return new Promise((resolve, reject) => {
      const checkout = new window.Razorpay({
        key: keyId,
        amount: toRazorpayAmount(payment.amount),
        currency: payment.currency || 'INR',
        name: 'PDF Marketplace',
        description: 'Digital product purchase',
        order_id: payment.razorpayOrderId,
        handler: resolve,
        modal: {
          ondismiss: () => reject(new Error('Payment was cancelled')),
        },
      })

      checkout.on('payment.failed', (failure) => {
        reject(
          new Error(
            failure.error?.description ||
              failure.error?.reason ||
              'Payment failed'
          )
        )
      })

      checkout.open()
    })
  }

  const handleCheckoutAndPay = async () => {
    setError('')
    setPaymentStatus('')
    setIsProcessingPayment(true)

    try {
      setPaymentStatus('Preparing payment...')
      const paymentResponse = await createCheckout()
      const payment = paymentResponse.data

      setPaymentStatus('Waiting for Razorpay checkout...')
      const razorpayResult = await openRazorpayCheckout(payment)

      setPaymentStatus('Verifying payment...')
      const verifyResponse = await verifyPayment({
        razorpayOrderId: razorpayResult.razorpay_order_id,
        razorpayPaymentId: razorpayResult.razorpay_payment_id,
        razorpaySignature: razorpayResult.razorpay_signature,
      })

      setCompletedPayment(verifyResponse.data)
      navigate('/library', { replace: true })
    } catch (checkoutError) {
      setError(checkoutError.message || 'Unable to complete checkout.')
      setPaymentStatus('')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const items = cart?.items || []
  const hasItems = items.length > 0

  if (isLoading) {
    return (
      <section className="grid min-h-72 place-items-center rounded-lg border border-slate-200 bg-white">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
          Loading checkout
        </p>
      </section>
    )
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
            Checkout
          </p>
          <h2 className="mt-3 text-2xl font-black tracking-tight">
            Review your order
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Pay securely through Razorpay. Your order and invoice are created
            after successful payment.
          </p>
        </div>

        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {!hasItems ? (
          <div className="mt-8 rounded-lg border border-dashed border-slate-300 p-8 text-center">
            <h3 className="text-xl font-black text-slate-950">
              Nothing to checkout
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Add digital products to your cart before creating an order.
            </p>
            <Link
              className="mt-5 inline-flex rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
              to="/"
            >
              Browse products
            </Link>
          </div>
        ) : (
          <div className="mt-6 divide-y divide-slate-200">
            {items.map((item) => (
              <article
                className="flex items-center justify-between gap-4 py-5"
                key={item.id}
              >
                <div className="min-w-0">
                  <Link
                    className="font-black text-slate-950 transition hover:text-cyan-700"
                    to={`/products/${item.productId}`}
                  >
                    {item.productTitle}
                  </Link>
                  <p className="mt-1 text-sm text-slate-600">
                    Digital {item.fileType || 'file'}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-black text-slate-950">
                  {formatPrice(item.currentPrice)}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>

      <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold text-slate-500">Cart total</p>
        <p className="mt-1 text-3xl font-black text-slate-950">
          {formatPrice(cart?.totalAmount)}
        </p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {items.length} {items.length === 1 ? 'item' : 'items'} ready for
          payment.
        </p>

        <button
          className="mt-6 w-full rounded-lg bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          disabled={!hasItems || isProcessingPayment}
          onClick={handleCheckoutAndPay}
          type="button"
        >
          {isProcessingPayment
            ? 'Processing...'
            : 'Pay now'}
        </button>

        {paymentStatus && (
          <div className="mt-6 rounded-lg border border-cyan-200 bg-cyan-50 p-4">
            <p className="text-sm font-black text-cyan-800">{paymentStatus}</p>
          </div>
        )}

        {completedPayment && (
          <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-sm font-black text-emerald-800">
              Payment successful
            </p>
            <p className="mt-2 text-sm leading-6 text-emerald-700">
              Order: {completedPayment.orderId}
            </p>
            <p className="mt-1 text-sm leading-6 text-emerald-700">
              Invoice: {completedPayment.invoiceNumber}
            </p>
          </div>
        )}
      </aside>
    </section>
  )
}

export default CheckoutPage
