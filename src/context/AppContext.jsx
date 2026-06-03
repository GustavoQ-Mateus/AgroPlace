import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as authSvc   from '../services/authService'
import * as favSvc    from '../services/favoritesService'
import * as notifSvc  from '../services/notificationsService'

export const AppContext = createContext(null)

let toastId = 0

export function AppProvider({ children }) {
  const [user, setUser]               = useState(null)
  const [profile, setProfile]         = useState(null)
  const [loadingAuth, setLoadingAuth] = useState(true)

  const [savedIds, setSavedIds]       = useState(new Set())
  const [toasts, setToasts]           = useState([])
  const [notifications, setNotifications] = useState([])

  // ── Toast ──────────────────────────────────────────────────
  function addToast(message, type = 'success') {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 4500)
  }
  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // ── Notificações browser ──────────────────────────────────
  function requestBrowserNotifPermission() {
    if (!('Notification' in window)) return
    if (Notification.permission === 'default') Notification.requestPermission()
  }

  function sendBrowserNotif(title, body) {
    if (Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/vite.svg' })
    }
  }

  // ── Auth bootstrap ─────────────────────────────────────────
  useEffect(() => {
    authSvc.getSession().then(async (session) => {
      if (session?.user) {
        setUser(session.user)
        setProfile(buildProfile(session.user))
        await loadFavorites()
        await loadNotifications()
      }
      setLoadingAuth(false)
    })
    requestBrowserNotifPermission()
  }, [])

  function buildProfile(u) {
    return {
      id:       u.id,
      role:     u.role || u.user_metadata?.role || 'comprador',
      name:     u.name || u.user_metadata?.name || u.email?.split('@')[0],
      email:    u.email,
      avatar:   u.avatar || u.email?.slice(0, 2).toUpperCase(),
      verified: u.verified || false,
    }
  }

  async function loadFavorites() {
    try {
      const ids = await favSvc.getFavoriteIds()
      setSavedIds(new Set(ids))
    } catch {}
  }

  async function loadNotifications() {
    try {
      const list = await notifSvc.getNotifications()
      setNotifications(list)
    } catch {}
  }

  // ── Login ──────────────────────────────────────────────────
  async function login(email, password) {
    const { user: u } = await authSvc.login({ email, password })
    setUser(u)
    setProfile(buildProfile(u))
    await loadFavorites()
    await loadNotifications()
    addToast('Bem-vindo de volta!')
    return u
  }

  // ── Register ───────────────────────────────────────────────
  async function register({ email, password, name, phone, role }) {
    const { user: u } = await authSvc.register({ email, password, name, phone, role })
    setUser(u)
    setProfile(buildProfile(u))
    addToast('Conta criada com sucesso!')
    return u
  }

  // ── Logout ─────────────────────────────────────────────────
  async function logout() {
    try { await authSvc.logout() } catch {}
    setUser(null)
    setProfile(null)
    setSavedIds(new Set())
    setNotifications([])
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
      // Reverte em caso de erro
      setSavedIds((prev) => {
        const next = new Set(prev)
        if (nowSaved) next.delete(anuncioId)
        else next.add(anuncioId)
        return next
      })
    }
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

    // Notificações
    notifications,
    unreadCount,
    markNotifsRead,

    // Toast
    toasts,
    addToast,
    removeToast,

    // Notificações browser
    requestBrowserNotifPermission,
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
