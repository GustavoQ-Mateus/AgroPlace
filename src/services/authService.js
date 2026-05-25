import { supabase } from '../lib/supabase'

/**
 * Cadastro de novo usuário.
 * @param {{ email, password, name, phone, role }} data
 */
export async function register({ email, password, name, phone, role }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, phone, role },
    },
  })
  if (error) throw error
  return data
}

/**
 * Login com e-mail e senha.
 */
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

/**
 * Logout.
 */
export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Sessão atual (null se não autenticado).
 */
export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

/**
 * Retorna o perfil completo do usuário autenticado.
 */
export async function getMyProfile() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) throw error
  return data
}

/**
 * Atualiza campos básicos do perfil.
 */
export async function updateProfile(updates) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', user.id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Salva/atualiza o perfil específico por role.
 * @param {'produtor'|'comprador'|'transportadora'} role
 * @param {object} profileData
 */
export async function upsertRoleProfile(role, profileData) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const table = {
    produtor:       'perfis_produtor',
    comprador:      'perfis_corporativa',
    transportadora: 'perfis_transportadora',
  }[role]

  if (!table) throw new Error('Role inválido')

  const { data, error } = await supabase
    .from(table)
    .upsert({ profile_id: user.id, ...profileData })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Recuperação de senha por e-mail.
 */
export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth?tab=reset`,
  })
  if (error) throw error
}

/**
 * Listener de mudança de estado de autenticação.
 */
export function onAuthChange(callback) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
  return () => subscription.unsubscribe()
}
