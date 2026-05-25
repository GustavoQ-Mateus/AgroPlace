import { supabase } from '../lib/supabase'

/**
 * Retorna os IDs dos anúncios salvos pelo usuário autenticado.
 * @returns {string[]}
 */
export async function getFavoriteIds() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('favoritos')
    .select('anuncio_id')
    .eq('user_id', user.id)

  if (error) throw error
  return (data ?? []).map((f) => f.anuncio_id)
}

/**
 * Retorna os anúncios salvos completos do usuário autenticado.
 */
export async function getFavorites() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('favoritos')
    .select(`
      anuncio_id,
      anuncios (
        id, title, category, breed, quantity,
        price_total, price_per_head, city, state,
        traceability_score, status,
        fotos_anuncio ( url, is_cover )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map((f) => f.anuncios).filter(Boolean)
}

/**
 * Salva um anúncio (idempotente).
 */
export async function saveListing(anuncioId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Faça login para salvar lotes')

  const { error } = await supabase
    .from('favoritos')
    .upsert({ user_id: user.id, anuncio_id: anuncioId })

  if (error) throw error
}

/**
 * Remove um anúncio dos salvos.
 */
export async function unsaveListing(anuncioId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { error } = await supabase
    .from('favoritos')
    .delete()
    .eq('user_id', user.id)
    .eq('anuncio_id', anuncioId)

  if (error) throw error
}

/**
 * Toggle: salva se não salvo, remove se já salvo.
 * @returns {boolean} true = agora salvo, false = removido
 */
export async function toggleFavorite(anuncioId) {
  const ids = await getFavoriteIds()
  if (ids.includes(anuncioId)) {
    await unsaveListing(anuncioId)
    return false
  } else {
    await saveListing(anuncioId)
    return true
  }
}
