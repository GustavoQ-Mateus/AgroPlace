import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, ChevronDown, Leaf, LogOut, Menu, Plus, Search, ShoppingBag, User, X } from 'lucide-react'
import Button from './ui/Button'
import { useApp } from '../context/AppContext'

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
]

export default function Header() {
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [speciesOpen, setSpeciesOpen] = useState(false)
  const [userOpen, setUserOpen]       = useState(false)
  const [search, setSearch]           = useState('')
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user, logout, proposals }   = useApp()
  const userRef   = useRef(null)

  useEffect(() => {
    setMobileOpen(false)
    setSpeciesOpen(false)
    setUserOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    function handler(e) {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) navigate(`/catalogo?q=${encodeURIComponent(search.trim())}`)
  }

  const dashboardLink = user?.role === 'vendedor' ? '/vendedor' : user?.role === 'transportadora' ? '/logistica' : '/comprador'
  const pendingCount  = proposals.filter((p) => p.status === 'Aguardando').length

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex min-w-0 shrink-0 items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-emerald-600 text-white">
              <Leaf size={15} />
            </span>
            <span className="hidden text-base font-black tracking-tight text-emerald-950 sm:block">
              Agro<span className="text-emerald-600">Place</span>
            </span>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="hidden max-w-sm flex-1 md:block">
            <label className="relative block">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar raça, espécie, cidade..."
                className="h-9 w-full border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-500/15"
              />
            </label>
          </form>

          {/* Desktop nav */}
          <nav className="ml-auto hidden items-center gap-0.5 lg:flex">
            {NAV_LINKS.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    className="flex h-9 items-center gap-1 px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-emerald-700"
                    onClick={() => setSpeciesOpen((v) => !v)}
                  >
                    {link.label}
                    <ChevronDown size={13} className={speciesOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>
                  <AnimatePresence>
                    {speciesOpen && (
                      <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute left-0 top-full mt-px min-w-40 border border-slate-200 bg-white py-1 shadow-lg shadow-slate-900/8"
                        exit={{ opacity: 0, y: -4 }}
                        initial={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.14 }}
                      >
                        {link.children.map((child) => (
                          <Link
                            className="block px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
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
                  className="flex h-9 items-center px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-emerald-700"
                  key={link.to}
                  to={link.to}
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Vender — always visible */}
            {user?.role === 'vendedor' ? (
              <Link
                to="/criar-anuncio"
                className="ml-1 flex h-9 items-center gap-1.5 bg-emerald-600 px-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                <Plus size={14} />
                Anunciar
              </Link>
            ) : (
              <Link
                className="flex h-9 items-center px-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-emerald-700"
                to="/vendedor"
              >
                Vender
              </Link>
            )}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1.5">
            {user && (
              <Link
                aria-label="Notificações"
                className="relative hidden h-9 w-9 items-center justify-center text-slate-500 transition hover:bg-slate-100 hover:text-emerald-700 sm:flex"
                to={dashboardLink}
              >
                <Bell size={16} />
                {pendingCount > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center bg-emerald-600 text-[9px] font-black text-white">
                    {pendingCount}
                  </span>
                )}
              </Link>
            )}
            {!user && (
              <Link
                aria-label="Carrinho"
                className="relative hidden h-9 w-9 items-center justify-center text-slate-500 transition hover:bg-slate-100 hover:text-emerald-700 sm:flex"
                to="/checkout"
              >
                <ShoppingBag size={16} />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </Link>
            )}

            {user ? (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserOpen((v) => !v)}
                  className="hidden h-9 items-center gap-2 border border-slate-200 px-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:flex"
                >
                  <span className="flex h-6 w-6 items-center justify-center bg-emerald-600 text-xs font-black text-white">
                    {user.avatar}
                  </span>
                  <span className="max-w-28 truncate">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={12} className={userOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                </button>
                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute right-0 top-full mt-px w-52 border border-slate-200 bg-white py-1 shadow-lg"
                      exit={{ opacity: 0, y: -4 }}
                      initial={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.14 }}
                    >
                      <div className="border-b border-slate-100 px-4 py-3">
                        <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      <Link to={dashboardLink} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-700">
                        <User size={14} />
                        Meu painel
                      </Link>
                      {user.role === 'vendedor' && (
                        <Link to="/criar-anuncio" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-emerald-700">
                          <Plus size={14} />
                          Novo anúncio
                        </Link>
                      )}
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={14} />
                        Sair
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link to="/auth">
                  <Button className="hidden sm:inline-flex" size="sm" variant="outline">Entrar</Button>
                </Link>
                <Link to="/auth?tab=register">
                  <Button size="sm">Cadastrar</Button>
                </Link>
              </>
            )}

            <button
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              className="flex h-9 w-9 items-center justify-center text-slate-700 transition hover:bg-slate-100 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            animate={{ height: 'auto', opacity: 1 }}
            className="overflow-hidden border-t border-slate-200 bg-white lg:hidden"
            exit={{ height: 0, opacity: 0 }}
            initial={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="divide-y divide-slate-100 px-4">
              <form onSubmit={handleSearch} className="relative block py-3">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar animais..."
                  className="h-10 w-full border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none"
                />
              </form>
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.label} className="py-2">
                    <p className="py-1.5 text-xs font-bold uppercase tracking-wide text-slate-400">{link.label}</p>
                    <div className="grid grid-cols-2">
                      {link.children.map((child) => (
                        <Link
                          className="py-2 text-sm font-medium text-slate-700 transition hover:text-emerald-700"
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
                    className="block py-3 text-sm font-semibold text-slate-700 transition hover:text-emerald-700"
                    key={link.to}
                    to={link.to}
                  >
                    {link.label}
                  </Link>
                )
              )}
              <div className="py-3">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center bg-emerald-600 text-xs font-black text-white">{user.avatar}</span>
                      <span className="text-sm font-bold text-slate-800">{user.name}</span>
                    </div>
                    <Link to={dashboardLink} className="text-sm font-semibold text-emerald-700">Meu painel</Link>
                    {user.role === 'vendedor' && (
                      <Link to="/criar-anuncio" className="text-sm font-semibold text-emerald-700">Novo anúncio</Link>
                    )}
                    <button onClick={logout} className="text-left text-sm font-semibold text-red-600">Sair</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Link to="/auth" className="flex-1"><Button className="w-full" variant="outline" size="sm">Entrar</Button></Link>
                    <Link to="/auth?tab=register" className="flex-1"><Button className="w-full" size="sm">Cadastrar</Button></Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
