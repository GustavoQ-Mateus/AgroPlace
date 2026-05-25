import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AppContext = createContext(null)

const DEMO_USERS = {
  'vendedor@demo.com':   { id: 'u1', name: 'Fazenda Santa Cruz', email: 'vendedor@demo.com',  role: 'vendedor',     avatar: 'SC' },
  'comprador@demo.com':  { id: 'u2', name: 'Abatedouro Planalto', email: 'comprador@demo.com', role: 'comprador',    avatar: 'AP' },
  'frete@demo.com':      { id: 'u3', name: 'TranSul Logística',   email: 'frete@demo.com',     role: 'transportadora', avatar: 'TL' },
}

let toastId = 0

export function AppProvider({ children }) {
  const [user, setUser]               = useState(null)
  const [savedAnimals, setSaved]      = useState(new Set())
  const [proposals, setProposals]     = useState([])
  const [toasts, setToasts]           = useState([])
  const [listings, setListings]       = useState([])

  function addToast(message, type = 'success') {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => removeToast(id), 4000)
  }
  function removeToast(id) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  function login(email, password, role) {
    const found = DEMO_USERS[email.toLowerCase()] || {
      id: 'u' + Date.now(),
      name: email.split('@')[0],
      email,
      role: role || 'comprador',
      avatar: email.slice(0, 2).toUpperCase(),
    }
    setUser(found)
    addToast(`Bem-vindo, ${found.name.split(' ')[0]}!`)
    return found
  }

  function logout() {
    setUser(null)
    addToast('Sessão encerrada.', 'info')
  }

  function toggleSave(id) {
    setSaved((prev) => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id); addToast('Lote removido dos salvos.', 'info') }
      else              { next.add(id);    addToast('Lote salvo!') }
      return next
    })
  }

  function sendProposal(data) {
    const proposal = { ...data, id: 'prop-' + Date.now(), status: 'Aguardando', createdAt: new Date() }
    setProposals((prev) => [proposal, ...prev])
    addToast('Proposta enviada com sucesso!')
    return proposal
  }

  function addListing(listing) {
    const item = { ...listing, id: 'lst-' + Date.now(), status: 'Ativo', daysListed: 0, traceability: 72 }
    setListings((prev) => [item, ...prev])
    addToast('Anúncio publicado com sucesso!')
    return item
  }

  return (
    <AppContext.Provider value={{ user, login, logout, savedAnimals, toggleSave, proposals, sendProposal, listings, addListing, toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </AppContext.Provider>
  )
}

function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 border px-4 py-3 shadow-lg text-sm font-semibold min-w-64 max-w-sm animate-slide-up ${
            t.type === 'error'   ? 'border-red-200 bg-red-50 text-red-800' :
            t.type === 'info'    ? 'border-slate-200 bg-white text-slate-700' :
                                   'border-emerald-200 bg-emerald-50 text-emerald-800'
          }`}
        >
          <span className="flex-1">{t.message}</span>
          <button onClick={() => onRemove(t.id)} className="text-inherit opacity-50 hover:opacity-100 text-base leading-none">&times;</button>
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
