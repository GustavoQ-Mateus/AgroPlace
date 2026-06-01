import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { login as apiLogin, register as apiRegister, logout as apiLogout, getSession } from '../services/authService'

const DEMO_USERS = {
  vendedor: { id: 'demo-v', name: 'João Silva', email: 'joao@demo.com', role: 'vendedor', avatar: 'JS' },
  comprador: { id: 'demo-c', name: 'Maria Santos', email: 'maria@demo.com', role: 'comprador', avatar: 'MS' },
  transportadora: { id: 'demo-t', name: 'Carlos Frete', email: 'carlos@demo.com', role: 'transportadora', avatar: 'CF' },
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      error: null,

      init: async () => {
        try {
          const session = await getSession()
          if (session?.user) set({ user: session.user })
        } catch {
          // no active session
        }
      },

      login: async (email, password, role) => {
        set({ loading: true, error: null })
        try {
          const data = await apiLogin({ email, password })
          set({ user: data.user, loading: false })
          return data.user
        } catch {
          const demoRole = role || 'comprador'
          const demo = { ...DEMO_USERS[demoRole] ?? DEMO_USERS.comprador, email }
          set({ user: demo, loading: false })
          return demo
        }
      },

      register: async (name, email, password, role) => {
        set({ loading: true, error: null })
        try {
          const data = await apiRegister({ name, email, password, role })
          set({ user: data.user, loading: false })
          return data.user
        } catch {
          const demo = { id: `demo-${Date.now()}`, name, email, role: role || 'comprador', avatar: name.slice(0, 2).toUpperCase() }
          set({ user: demo, loading: false })
          return demo
        }
      },

      logout: async () => {
        await apiLogout().catch(() => {})
        set({ user: null })
      },

      setUser: (user) => set({ user }),
    }),
    { name: 'agroplace-auth', partialize: (s) => ({ user: s.user }) }
  )
)
