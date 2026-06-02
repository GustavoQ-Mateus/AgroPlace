import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout'
import AuthPage from './pages/AuthPage'
import BuyerDashboard from './pages/BuyerDashboard'
import CatalogPage from './pages/CatalogPage'
import CheckoutPage from './pages/CheckoutPage'
import CreateListingPage from './pages/CreateListingPage'
import LandingPage from './pages/LandingPage'
import ListingPage from './pages/ListingPage'
import LogisticsPage from './pages/LogisticsPage'
import SellerDashboard from './pages/SellerDashboard'
import NotFoundPage from './pages/NotFoundPage'
import IOSPage from './pages/IOSPage'
import { SimulatorButton } from './components/IOSSimulator'

function ProtectedRoute({ children }) {
  const user = useAuthStore((s) => s.user)
  return user ? children : <Navigate to="/auth" replace />
}

function AppInit() {
  const init = useAuthStore((s) => s.init)
  useEffect(() => { init() }, [init])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AppInit />
      <Routes>
        {/* iOS simulator — standalone, fora do Layout */}
        <Route path="ios" element={<IOSPage />} />

        <Route element={<Layout />} path="/">
          <Route index element={<LandingPage />} />
          <Route path="catalogo" element={<CatalogPage />} />
          <Route path="anuncio/:id" element={<ListingPage />} />
          <Route path="checkout/:id" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="logistica" element={<LogisticsPage />} />
          <Route path="vendedor" element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} />
          <Route path="comprador" element={<ProtectedRoute><BuyerDashboard /></ProtectedRoute>} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="criar-anuncio" element={<ProtectedRoute><CreateListingPage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <SimulatorButton />
    </BrowserRouter>
  )
}
