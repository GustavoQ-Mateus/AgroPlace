import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFavoriteIds, toggleFavorite } from '../services/favoritesService'
import { useAuthStore } from '../stores/authStore'

export function useFavorites() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['favorites', user?.id],
    queryFn: async () => {
      try { return await getFavoriteIds() } catch { return [] }
    },
    enabled: !!user,
    initialData: [],
  })
}

export function useToggleFavorite() {
  const qc = useQueryClient()
  const user = useAuthStore((s) => s.user)
  return useMutation({
    mutationFn: toggleFavorite,
    onMutate: async (id) => {
      const key = ['favorites', user?.id]
      await qc.cancelQueries({ queryKey: key })
      const prev = qc.getQueryData(key) ?? []
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      qc.setQueryData(key, next)
      return { prev }
    },
    onError: (_, __, ctx) => {
      if (ctx?.prev) qc.setQueryData(['favorites', user?.id], ctx.prev)
    },
  })
}
