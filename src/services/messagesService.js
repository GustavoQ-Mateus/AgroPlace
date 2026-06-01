import { api } from '../lib/api'

export async function sendMessage({ anuncio_id, receiver_id, content }) {
  return api.post('/api/messages', { anuncio_id, receiver_id, content })
}

export async function getConversation(anuncio_id) {
  return api.get(`/api/messages/${anuncio_id}`)
}

export function subscribeToConversation(_anuncio_id, _onMessage) {
  // Sem realtime — polling deve ser implementado no componente se necessário
  return () => {}
}
