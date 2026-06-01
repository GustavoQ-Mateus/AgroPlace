import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, ChevronDown, LogOut, Menu, Plus, Search, User, X } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { cn, initials } from '../lib/utils'
import Button from './ui/Button'

const NAV = [
  { to: '/catalogo', label: 'Catálogo' },
  {
    label: 'Espécies',
    children: [
      { to: '/catalogo?cat=bovinos',  label: 'Bovinos' },
      { to: '/catalogo?cat=equinos',  label: 'Equinos' },
      { to: '/catalogo?cat=aves',     label: 'Aves' },
      { to: '/catalogo?cat=suinos',   label: 'Suínos' },
      { to: '/catalogo?cat=ovinos',   label: 'Ovinos' },
      { to: '/catalogo?cat=caprinos', label: 'Caprinos' },
    ],
  },
  { to: '/logistica', label: 'Frete' },
]

function BullLogo() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect width="28" height="28" fill="#3A5F3A" />
      <path d="M7 9c0 0-1-3 2-4s5 1 5 1 2-1 5-1 3 3 2 4c1 0 3 1 3 4s-2 4-4 4h-1l-1 3h-4l-1-3h-1c-2 0-4-1-4-4s2-4 3-4z" fill="white" />
      <path d="M6 8c-1-2-3-1-3-1s1 3 3 3" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      <path d="M22 8c1-2 3-1 3-1s-1 3-3 3" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
      <circle cx="11.5" cy="14" r="1.2" fill="#3A5F3A"/>
      <circle cx="16.5" cy="14" r="1.2" fill="#3A5F3A"/>
    </svg>
  )
}

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [speciesOpen, setSpeciesOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [scrolled, setScrolled] = useState(false)

  const userRef = useRef(null)

  useEffect(() => {
    setMobileOpen(false); setSpeciesOpen(false); setUserOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    function onClickOutside(e) {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 4) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    if (search.trim()) navigate(`/catalogo?q=${encodeURIComponent(search.trim())}`)
  }

  const isSeller = user?.role === 'vendedor' || user?.role === 'produtor'
  const dashLink = isSeller ? '/vendedor' : user?.role === 'transportadora' ? '/logistica' : '/comprador'

  return (
    <header className={cn(
      'fixed inset-x-0 top-0 z-50 transition-shadow duration-200',
      'border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]',
      scrolled && 'shadow-sm'
    )}>
      <div className="page-container">
        <div className="flex h-14 items-center gap-3">
          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <BullLogo />
            <span className="hidden text-[15px] font-black tracking-tight sm:block" style={{ color: 'hsl(var(--text))' }}>
              Agro<span className="text-brand-600">Place</span>
            </span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden max-w-xs flex-1 md:block lg:max-w-sm">
            <label className="relative block">
              <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-fg))]" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Raça, espécie, cidade…"
                className="h-9 w-full border border-[hsl(var(--border))] bg-[hsl(var(--muted))] pl-9 pr-3 text-sm text-[hsl(var(--text))] outline-none transition focus:border-brand-500 focus:bg-[hsl(var(--surface))] focus:ring-2 focus:ring-brand-600/12 rounded-[var(--radius)]"
              />
            </label>
          </form>

          {/* Desktop nav */}
          <nav className="ml-auto hidden items-center gap-0.5 lg:flex">
            {NAV.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    onClick={() => setSpeciesOpen((v) => !v)}
                    className="flex h-9 items-center gap-1 px-3 text-sm font-semibold text-[hsl(var(--text-sub))] transition hover:bg-[hsl(var(--muted))] hover:text-brand-600 rounded-[var(--radius)]"
                  >
                    {link.label}
                    <ChevronDown size={13} className={cn('transition-transform', speciesOpen && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {speciesOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.14 }}
                        className="absolute left-0 top-full mt-1 min-w-[160px] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-1 shadow-card rounded-[var(--radius)]"
                      >
                        {link.children.map((c) => (
                          <Link key={c.to} to={c.to} className="block px-4 py-2 text-sm font-medium text-[hsl(var(--text-sub))] transition hover:bg-brand-50 hover:text-brand-700">
                            {c.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex h-9 items-center px-3 text-sm font-semibold text-[hsl(var(--text-sub))] transition hover:bg-[hsl(var(--muted))] hover:text-brand-600 rounded-[var(--radius)]"
                >
                  {link.label}
                </Link>
              )
            )}

            {isSeller ? (
              <Link to="/criar-anuncio" className="ml-1 flex h-9 items-center gap-1.5 bg-brand-600 px-3 text-sm font-bold text-white transition hover:bg-brand-700 rounded-[var(--radius)]">
                <Plus size={14} /> Anunciar
              </Link>
            ) : (
              <Link to="/vendedor" className="flex h-9 items-center px-3 text-sm font-semibold text-[hsl(var(--text-sub))] transition hover:bg-[hsl(var(--muted))] hover:text-brand-600 rounded-[var(--radius)]">
                Vender
              </Link>
            )}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-1">
            {user ? (
              <>
                <Link
                  to={dashLink}
                  aria-label="Notificações"
                  className="relative hidden h-9 w-9 items-center justify-center text-[hsl(var(--text-sub))] transition hover:bg-[hsl(var(--muted))] hover:text-brand-600 sm:flex rounded-[var(--radius)]"
                >
                  <Bell size={16} />
                </Link>
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => setUserOpen((v) => !v)}
                    className="hidden h-9 items-center gap-2 border border-[hsl(var(--border))] px-2.5 text-sm font-semibold text-[hsl(var(--text))] transition hover:bg-[hsl(var(--muted))] sm:flex rounded-[var(--radius)]"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-[11px] font-black text-white">
                      {initials(user.name || user.email || '?')}
                    </span>
                    <span className="max-w-[100px] truncate">{(user.name || user.email || '?').split(' ')[0]}</span>
                    <ChevronDown size={12} className={cn('transition-transform', userOpen && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {userOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.14 }}
                        className="absolute right-0 top-full mt-1 w-52 border border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-1 shadow-card rounded-[var(--radius)]"
                      >
                        <div className="border-b border-[hsl(var(--border))] px-4 py-3">
                          <p className="text-xs font-bold text-[hsl(var(--text))] truncate">{user.name || user.email}</p>
                          <p className="text-xs text-[hsl(var(--text-sub))] truncate">{user.email}</p>
                        </div>
                        <Link to={dashLink} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[hsl(var(--text-sub))] hover:bg-[hsl(var(--muted))] hover:text-brand-700">
                          <User size={14} /> Meu painel
                        </Link>
                        {isSeller && (
                          <Link to="/criar-anuncio" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-[hsl(var(--text-sub))] hover:bg-[hsl(var(--muted))] hover:text-brand-700">
                            <Plus size={14} /> Novo anúncio
                          </Link>
                        )}
                        <button
                          onClick={logout}
                          className="flex w-full items-center gap-2 border-t border-[hsl(var(--border))] px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                        >
                          <LogOut size={14} /> Sair
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link to="/auth" className="hidden sm:block">
                  <Button size="sm" variant="outline">Entrar</Button>
                </Link>
                <Link to="/auth?tab=register">
                  <Button size="sm">Cadastrar</Button>
                </Link>
              </>
            )}

            <button
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center text-[hsl(var(--text))] transition hover:bg-[hsl(var(--muted))] lg:hidden rounded-[var(--radius)]"
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
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[hsl(var(--border))] bg-[hsl(var(--surface))] lg:hidden"
          >
            <div className="divide-y divide-[hsl(var(--border))] px-4">
              <form onSubmit={handleSearch} className="relative py-3">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-fg))]" />
                <input
                  type="search" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar animais…"
                  className="h-10 w-full border border-[hsl(var(--border))] bg-[hsl(var(--muted))] pl-9 pr-3 text-sm outline-none rounded-[var(--radius)]"
                />
              </form>

              {NAV.map((link) =>
                link.children ? (
                  <div key={link.label} className="py-2">
                    <p className="py-1.5 text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-fg))]">{link.label}</p>
                    <div className="grid grid-cols-2 gap-1">
                      {link.children.map((c) => (
                        <Link key={c.to} to={c.to} className="py-2 text-sm font-medium text-[hsl(var(--text))] transition hover:text-brand-700">
                          {c.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link key={link.to} to={link.to} className="block py-3 text-sm font-semibold text-[hsl(var(--text))] transition hover:text-brand-700">
                    {link.label}
                  </Link>
                )
              )}

              <div className="py-3">
                {user ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-[11px] font-black text-white">{initials(user.name || user.email)}</span>
                      <span className="text-sm font-bold text-[hsl(var(--text))]">{user.name || user.email}</span>
                    </div>
                    <Link to={dashLink} className="text-sm font-semibold text-brand-600">Meu painel</Link>
                    {isSeller && <Link to="/criar-anuncio" className="text-sm font-semibold text-brand-600">Novo anúncio</Link>}
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
