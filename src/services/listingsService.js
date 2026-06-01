import { api } from '../lib/api'

export async function searchListings(filters = {}) {
  const params = new URLSearchParams()
  if (filters.query)    params.set('q',        filters.query)
  if (filters.category) params.set('category',  filters.category)
  if (filters.state)    params.set('state',     filters.state)
  if (filters.priceMin) params.set('priceMin',  filters.priceMin)
  if (filters.priceMax) params.set('priceMax',  filters.priceMax)
  if (filters.traceMin) params.set('traceMin',  filters.traceMin)
  if (filters.limit)    params.set('limit',     filters.limit)
  if (filters.offset)   params.set('offset',    filters.offset)
  const qs = params.toString()
  return api.get(`/api/listings${qs ? `?${qs}` : ''}`)
}

export async function getListing(id) {
  return api.get(`/api/listings/${id}`)
}

export async function getMyListings() {
  return api.get('/api/listings/mine')
}

export async function createListing({ listing, photos = [] }) {
  const data = await api.post('/api/listings', listing)
  return data
}

export async function updateListing(id, updates) {
  return api.put(`/api/listings/${id}`, updates)
}

export async function updateListingStatus(id, status) {
  return api.put(`/api/listings/${id}`, { status })
}

export async function deleteListing(id) {
  return api.put(`/api/listings/${id}`, { status: 'cancelado' })
}
