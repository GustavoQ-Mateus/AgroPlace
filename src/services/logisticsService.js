import { api } from '../lib/api'

export async function getCarriers({ origin, dest, qty } = {}) {
  const qs = new URLSearchParams()
  if (origin) qs.set('origin', origin)
  if (dest)   qs.set('dest', dest)
  if (qty)    qs.set('qty', qty)
  return api.get(`/api/carriers${qs.toString() ? '?' + qs : ''}`)
}

export async function requestFreight(payload) {
  return api.post('/api/freight', payload)
}
