import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  ChevronDown,
  Leaf,
  Menu,
  Search,
  ShoppingBag,
  X,
} from 'lucide-react'
import Button from './ui/Button'

const NAV_LINKS = [
  { to: '/catalogo', label: 'Catálogo' },
  {
    label: 'Espécies',
    children: [
      { to: '/catalogo?cat=bovinos', label: 'Bovinos' },
      { to: '/catalogo?cat=equinos', label: 'Equinos' },
      { to: '/catalogo?cat=aves', label: 'Aves' },
      { to: '/catalogo?cat=suinos', label: 'Suínos' },
      { to: '/catalogo?cat=ovinos', label: 'Ovinos' },
      { to: '/catalogo?cat=caprinos', label: 'Caprinos' },
    ],
  },
  { to: '/logistica', label: 'Frete' },
  { to: '/vendedor', label: 'Vender' },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [speciesOpen, setSpeciesOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setSpeciesOpen(false)
  }, [location.pathname, location.search])

  return (
    <header
      className={[
        'fixed inset-x-0 top-0 z-50 border-b transition-all duration-300',
        scrolled
          ? 'border-white/30 bg-white/80 shadow-sm shadow-slate-900/5 backdrop-blur-xl'
          : 'border-white/20 bg-white/60 backdrop-blur-md',
      ].join(' ')}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-900/20">
              <Leaf size={19} />
            </span>
            <span className="hidden text-xl font-black tracking-tight text-emerald-950 sm:block">
              Agro<span className="text-emerald-600">Place</span>
            </span>
          </Link>

          <div className="hidden max-w-md flex-1 md:block">
            <label className="relative block">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                placeholder="Buscar raça, espécie, cidade..."
                className="h-10 w-full rounded-lg border border-white/60 bg-white/70 pl-9 pr-3 text-sm text-slate-700 shadow-sm outline-none backdrop-blur transition focus:border-emerald-300 focus:bg-white focus:ring-2 focus:ring-emerald-500/20"
              />
            </label>
          </div>

          <nav className="ml-auto hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    className="flex h-10 items-center gap-1 rounded-lg px-3 text-sm font-semibold text-slate-700 transition hover:bg-white/70 hover:text-emerald-700"
                    onClick={() => setSpeciesOpen((value) => !value)}
                  >
                    {link.label}
                    <ChevronDown size={14} className={speciesOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>
                  <AnimatePresence>
                    {speciesOpen && (
                      <motion.div
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute left-0 top-full mt-2 min-w-44 overflow-hidden rounded-xl border border-white/70 bg-white/95 py-1 shadow-xl shadow-slate-900/10 backdrop-blur-xl"
                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                        initial={{ opacity: 0, y: 5, scale: 0.98 }}
                        transition={{ duration: 0.16 }}
                      >
                        {link.children.map((child) => (
                          <Link
                            className="block px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                            key={child.to}
                            to={child.to}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  className="flex h-10 items-center rounded-lg px-3 text-sm font-semibold text-slate-700 transition hover:bg-white/70 hover:text-emerald-700"
                  key={link.to}
                  to={link.to}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              aria-label="Notificações"
              className="hidden h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white/70 hover:text-emerald-700 sm:flex"
              to="/comprador"
            >
              <Bell size={18} />
            </Link>
            <Link
              aria-label="Carrinho"
              className="relative hidden h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-white/70 hover:text-emerald-700 sm:flex"
              to="/checkout"
            >
              <ShoppingBag size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
            </Link>
            <Link to="/auth">
              <Button className="hidden sm:inline-flex" size="sm" variant="outline">
                Entrar
              </Button>
            </Link>
            <Link to="/auth?tab=register">
              <Button size="sm">Cadastrar</Button>
            </Link>
            <button
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-white/70 lg:hidden"
              onClick={() => setMobileOpen((value) => !value)}
            >
              {mobileOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden border-t border-white/50 bg-white/95 backdrop-blur-xl lg:hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <div className="space-y-2 px-4 py-4">
              <label className="relative block">
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Buscar animais..."
                  className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </label>
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.label} className="pt-1">
                    <p className="px-2 py-2 text-xs font-bold uppercase tracking-wide text-slate-400">{link.label}</p>
                    <div className="grid grid-cols-2 gap-1">
                      {link.children.map((child) => (
                        <Link
                          className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                          key={child.to}
                          to={child.to}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                    key={link.to}
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
