import { create } from 'zustand'

let toastId = 0

export const useUiStore = create((set) => ({
  toasts: [],
  addToast: (message, type = 'success', duration = 3500) => {
    const id = ++toastId
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }))
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), duration)
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),

  mobileMenuOpen: false,
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),

  compareList: [],
  addToCompare: (id) => set((s) => s.compareList.includes(id) ? s : { compareList: [...s.compareList.slice(-2), id] }),
  removeFromCompare: (id) => set((s) => ({ compareList: s.compareList.filter((x) => x !== id) })),
  clearCompare: () => set({ compareList: [] }),
}))
