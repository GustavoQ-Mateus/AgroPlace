import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { login as apiLogin, register as apiRegister, logout as apiLogout, getSession } from '../services/authService'

export const useAuthStore = create(
  persist(
    (set) => ({
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

      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const data = await apiLogin({ email, password })
          set({ user: data.user, loading: false })
          return data.user
        } catch (err) {
          set({ loading: false, error: err?.message || 'Credenciais inválidas' })
          throw err
        }
      },

      register: async (name, email, password, role) => {
        set({ loading: true, error: null })
        try {
          const data = await apiRegister({ name, email, password, role })
          set({ user: data.user, loading: false })
          return data.user
        } catch (err) {
          set({ loading: false, error: err?.message || 'Erro ao criar conta' })
          throw err
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
