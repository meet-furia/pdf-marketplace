import { Navigate, Route, Routes } from 'react-router-dom'
import AdminPendingProductsPage from '../pages/AdminPendingProductsPage'
import CartPage from '../pages/CartPage'
import CheckoutPage from '../pages/CheckoutPage'
import HomePage from '../pages/HomePage'
import LibraryPage from '../pages/LibraryPage'
import LoginPage from '../pages/LoginPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import RegisterPage from '../pages/RegisterPage'
import SellerDashboardPage from '../pages/SellerDashboardPage'
import SellerPaymentDetailsPage from '../pages/SellerPaymentDetailsPage'
import SellerProductsPage from '../pages/SellerProductsPage'
import SellerUploadPage from '../pages/SellerUploadPage'
import { useAuth } from './AuthProvider'
import DashboardLayout from './DashboardLayout'
import ProtectedRoute from './ProtectedRoute'
import PublicLayout from './PublicLayout'

function LoadingPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f7fb] px-6 text-slate-900">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-700">
        Loading
      </p>
    </main>
  )
}

function PlaceholderPage({ title, description }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-700">
        MVP
      </p>
      <h2 className="mt-3 text-2xl font-black tracking-tight">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
        {description}
      </p>
    </section>
  )
}

function AppRoutes() {
  const { isLoadingSession } = useAuth()

  if (isLoadingSession) {
    return <LoadingPage />
  }

  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route element={<LoginPage />} path="login" />
        <Route element={<RegisterPage />} path="register" />
        <Route element={<ProductDetailPage />} path="products/:productId" />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            element={<CartPage />}
            path="cart"
          />
          <Route
            element={<CheckoutPage />}
            path="checkout"
          />
          <Route
            element={<LibraryPage />}
            path="library"
          />
          <Route
            element={<SellerDashboardPage />}
            path="seller"
          />
          <Route
            element={<SellerUploadPage />}
            path="seller/upload"
          />
          <Route
            element={<SellerProductsPage />}
            path="seller/products"
          />
          <Route
            element={<SellerPaymentDetailsPage />}
            path="seller/payment-details"
          />
          <Route
            element={<AdminPendingProductsPage />}
            path="admin/products/pending"
          />
        </Route>
      </Route>

      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  )
}

export default AppRoutes
