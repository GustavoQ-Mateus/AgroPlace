import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
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
import ProtectedRoute from './components/ProtectedRoute'
import { SimulatorButton } from './components/IOSSimulator'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Layout />} path="/">
            <Route index element={<LandingPage />} />
            <Route element={<CatalogPage />} path="catalogo" />
            <Route element={<ListingPage />} path="anuncio/:id" />
            <Route element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} path="checkout/:id" />
            <Route element={<LogisticsPage />} path="logistica" />
            <Route element={<ProtectedRoute><SellerDashboard /></ProtectedRoute>} path="vendedor" />
            <Route element={<ProtectedRoute><BuyerDashboard /></ProtectedRoute>} path="comprador" />
            <Route element={<AuthPage />} path="auth" />
            <Route element={<ProtectedRoute><CreateListingPage /></ProtectedRoute>} path="criar-anuncio" />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
        <SimulatorButton />
      </AppProvider>
    </BrowserRouter>
  )
}
