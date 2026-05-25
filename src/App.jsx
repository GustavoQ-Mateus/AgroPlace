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

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<Layout />} path="/">
            <Route index element={<LandingPage />} />
            <Route element={<CatalogPage />} path="catalogo" />
            <Route element={<ListingPage />} path="anuncio/:id" />
            <Route element={<CheckoutPage />} path="checkout" />
            <Route element={<LogisticsPage />} path="logistica" />
            <Route element={<SellerDashboard />} path="vendedor" />
            <Route element={<BuyerDashboard />} path="comprador" />
            <Route element={<AuthPage />} path="auth" />
            <Route element={<CreateListingPage />} path="criar-anuncio" />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
