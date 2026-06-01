import { api, setToken } from '../lib/api'

export async function register({ email, password, name, phone, role }) {
  const data = await api.post('/api/auth/register', { email, password, name, phone, role })
  setToken(data.token)
  return data
}

export async function login({ email, password }) {
  const data = await api.post('/api/auth/login', { email, password })
  setToken(data.token)
  return data
}

export async function logout() {
  setToken(null)
}

export async function getSession() {
  const token = localStorage.getItem('agroplace_token')
  if (!token) return null
  try {
    const user = await api.get('/api/auth/me')
    return user ? { user } : null
  } catch {
    setToken(null)
    return null
  }
}

export async function getMyProfile() {
  return api.get('/api/auth/me')
}

export async function updateProfile(updates) {
  return api.put('/api/auth/me', updates)
}

export async function resetPassword(_email) {
  // Sem suporte a e-mail em modo local — noop
}

export function onAuthChange(_callback) {
  // Sem realtime — retorna cleanup vazio
  return () => {}
}
