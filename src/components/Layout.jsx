import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'
import ToastContainer from './ui/Toast'

export default function Layout() {
  const { pathname } = useLocation()
  return (
    <div className="flex min-h-dvh flex-col bg-[hsl(var(--bg))]">
      <Header />
      <main className="flex-1 pt-14">
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
    </div>
  )
}
