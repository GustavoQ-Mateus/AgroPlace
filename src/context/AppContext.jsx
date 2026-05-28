import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authSvc   from '../services/authService'
import * as favSvc    from '../services/favoritesService'
import * as notifSvc  from '../services/notificationsService'

export const AppContext = createContext(null)

let toastId = 0

export function AppProvider({ children }) {
  const [user, setUser]             = useState(null)
  const [profile, setProfile]       = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  // Favoritos locais (sincronizados com Supabase quando autenticado)
  const [savedIds, setSavedIds]     = useState(new Set())

  // Propostas locais (fallback offline)
  const [proposals, setProposals]   = useState([])
  const [listings, setListings]     = useState([])

  const [toasts, setToasts]         = useState([])
  const [notifications, setNotifications]  = useState([])
  const unsubNotifs                 = useRef(null)

  // ── Toast ──────────────────────────────────────────────────
  function addToast(message, type = 'success') {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 4500)
  }
  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // ── Notificações ───────────────────────────────────────────
  function setupNotifSubscription(userId) {
    if (unsubNotifs.current) unsubNotifs.current()
    unsubNotifs.current = notifSvc.subscribeNotifications(userId, (notif) => {
      setNotifications((prev) => [notif, ...prev])
      addToast(notif.title, 'info')
    })
  }

  // ── Auth bootstrap ─────────────────────────────────────────
  useEffect(() => {
    // Carrega sessão inicial
    authSvc.getSession().then(async (session) => {
      if (session?.user) {
        setUser(session.user)
        await loadProfile(session.user.id)
        setupNotifSubscription(session.user.id)
      }
      setLoadingAuth(false)
    })

    // Listener de mudanças de auth
    const unsub = authSvc.onAuthChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user)
        await loadProfile(session.user.id)
        await loadFavorites()
        setupNotifSubscription(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
        setSavedIds(new Set())
        setProposals([])
        if (unsubNotifs.current) { unsubNotifs.current(); unsubNotifs.current = null }
      }
    })

    return unsub
  }, [])

  async function loadProfile(userId) {
    try {
      const p = await authSvc.getMyProfile()
      setProfile(p)
    } catch {}
  }

  async function loadFavorites() {
    try {
      const ids = await favSvc.getFavoriteIds()
      setSavedIds(new Set(ids))
    } catch {}
  }

  // ── Login ──────────────────────────────────────────────────
  async function login(email, password, role) {
    try {
      const { user: u } = await authSvc.login({ email, password })
      // profile será carregado pelo listener onAuthChange
      addToast('Bem-vindo de volta!')
      return u
    } catch (err) {
      // Modo demo: aceita qualquer email/senha
      const demo = {
        id:    'demo-' + Date.now(),
        email,
        user_metadata: { role: role || 'comprador', name: email.split('@')[0] },
      }
      const demoProfile = {
        id:      demo.id,
        role:    role || 'comprador',
        name:    email.split('@')[0],
        email,
        avatar:  email.slice(0, 2).toUpperCase(),
        verified: false,
      }
      setUser(demo)
      setProfile(demoProfile)
      addToast(`Bem-vindo, ${demoProfile.name}! (modo demo)`)
      return demo
    }
  }

  // ── Register ───────────────────────────────────────────────
  async function register({ email, password, name, phone, role }) {
    const { user: u } = await authSvc.register({ email, password, name, phone, role })
    addToast('Conta criada! Verifique seu e-mail se necessário.')
    return u
  }

  // ── Logout ─────────────────────────────────────────────────
  async function logout() {
    try { await authSvc.logout() } catch {}
    setUser(null)
    setProfile(null)
    setSavedIds(new Set())
    setProposals([])
    addToast('Sessão encerrada.', 'info')
  }

  // ── Favoritos ──────────────────────────────────────────────
  async function toggleSave(anuncioId) {
    if (!user) { addToast('Faça login para salvar lotes.', 'info'); return }
    const nowSaved = !savedIds.has(anuncioId)
    setSavedIds((prev) => {
      const next = new Set(prev)
      if (prev.has(anuncioId)) next.delete(anuncioId)
      else next.add(anuncioId)
      return next
    })
    addToast(nowSaved ? 'Lote salvo!' : 'Lote removido dos salvos.', nowSaved ? 'success' : 'info')
    try {
      await favSvc.toggleFavorite(anuncioId)
    } catch {
      // Reverte estado local em caso de erro
      setSavedIds((prev) => {
        const next = new Set(prev)
        if (nowSaved) next.delete(anuncioId)
        else next.add(anuncioId)
        return next
      })
    }
  }

  // ── Propostas (local fallback) ─────────────────────────────
  function sendProposalLocal(data) {
    const proposal = { ...data, id: 'prop-' + Date.now(), status: 'Aguardando', createdAt: new Date() }
    setProposals((prev) => [proposal, ...prev])
    addToast('Proposta enviada com sucesso!')
    return proposal
  }

  // ── Anúncios locais (criados sem Supabase configurado) ─────
  function addListing(listing) {
    const item = { ...listing, id: 'lst-' + Date.now(), status: 'Ativo', daysListed: 0 }
    setListings((prev) => [item, ...prev])
    addToast('Anúncio publicado com sucesso!')
    return item
  }

  // ── Notificações lidas ─────────────────────────────────────
  async function markNotifsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    try { await notifSvc.markAllRead() } catch {}
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  const value = {
    // Auth
    user, profile, loadingAuth, login, register, logout,
    isAuthenticated: !!user,

    // Favoritos
    savedAnimals: savedIds,
    toggleSave,

    // Propostas
    proposals,
    sendProposal: sendProposalLocal,

    // Anúncios locais
    listings,
    addListing,

    // Notificações
    notifications,
    unreadCount,
    markNotifsRead,

    // Toast
    toasts,
    addToast,
    removeToast,
  }

  return (
    <AppContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AppContext.Provider>
  )
}

// ── Toast UI ────────────────────────────────────────────────
function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex min-w-64 max-w-sm animate-slide-up items-center gap-3 border px-4 py-3 text-sm font-semibold shadow-lg ${
            t.type === 'error'
              ? 'border-red-200 bg-red-50 text-red-800'
              : t.type === 'info'
                ? 'border-yellow-200 bg-yellow-50 text-yellow-800'
                : 'border-emerald-200 bg-emerald-50 text-emerald-800'
          }`}
        >
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => onRemove(t.id)}
            className="text-base leading-none opacity-50 hover:opacity-100"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be inside AppProvider')
  return ctx
}
