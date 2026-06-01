import { api } from '../lib/api'

export async function getNotifications({ limit = 30 } = {}) {
  return api.get(`/api/notifications?limit=${limit}`)
}

export async function markAllRead() {
  return api.put('/api/notifications/read-all')
}

export function subscribeNotifications(_userId, _onNew) {
  // Sem realtime — retorna cleanup vazio
  return () => {}
}
