import { api } from '../lib/api'

export async function getFavoriteIds() {
  return api.get('/api/favorites')
}

export async function toggleFavorite(anuncioId) {
  const result = await api.post(`/api/favorites/${anuncioId}`)
  return result.saved
}
