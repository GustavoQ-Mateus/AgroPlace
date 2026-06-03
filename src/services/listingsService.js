import { api } from '../lib/api'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&q=80'

function normalize(a) {
  return {
    ...a,
    image:          a.cover_url || PLACEHOLDER,
    location:       a.city && a.state ? `${a.city}, ${a.state}` : (a.city || a.state || ''),
    price:          Number(a.price_total) || 0,
    traceability:   Number(a.traceability_score) || 0,
    quantity:       Number(a.quantity) || 0,
    weight:         a.weight ? Number(a.weight) : null,
    daysListed:     a.created_at ? Math.floor((Date.now() - new Date(a.created_at)) / 86400000) : 0,
  }
}

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
  const data = await api.get(`/api/listings${qs ? `?${qs}` : ''}`)
  return Array.isArray(data) ? data.map(normalize) : data
}

export async function getListing(id) {
  const data = await api.get(`/api/listings/${id}`)
  return normalize(data)
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
