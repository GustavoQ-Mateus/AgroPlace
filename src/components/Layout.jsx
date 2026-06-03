import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'
import ToastContainer from './ui/Toast'
import CookieBanner from './ui/CookieBanner'
import { isEmbedded } from '../lib/utils'

export default function Layout() {
  const { pathname } = useLocation()
  return (
    <div className="flex min-h-dvh flex-col bg-[hsl(var(--bg))]">
      <Header />
      {/* pt-14 = header height; add 54px for iOS status bar when in simulator */}
      <main className={isEmbedded ? 'flex-1 pt-[110px]' : 'flex-1 pt-14'}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ToastContainer />
      <CookieBanner />
    </div>
  )
}
