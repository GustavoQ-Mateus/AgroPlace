import { supabase } from '../lib/supabase'

/**
 * Busca anúncios com filtros e full-text search.
 * Usa a função RPC search_anuncios definida no schema.
 *
 * @param {{
 *   query?:     string,
 *   category?:  string,
 *   state?:     string,
 *   priceMin?:  number,
 *   priceMax?:  number,
 *   traceMin?:  number,
 *   limit?:     number,
 *   offset?:    number
 * }} filters
 */
export async function searchListings(filters = {}) {
  const { data, error } = await supabase.rpc('search_anuncios', {
    p_query:     filters.query     || null,
    p_category:  filters.category  || null,
    p_state:     filters.state     || null,
    p_price_min: filters.priceMin  || null,
    p_price_max: filters.priceMax  || null,
    p_trace_min: filters.traceMin  || null,
    p_limit:     filters.limit     ?? 50,
    p_offset:    filters.offset    ?? 0,
  })
  if (error) throw error
  return data ?? []
}

/**
 * Retorna um anúncio completo com fotos e rastreabilidade.
 */
export async function getListing(id) {
  const { data, error } = await supabase
    .from('anuncios')
    .select(`
      *,
      profiles:seller_id ( id, name, verified, avatar_url ),
      fotos_anuncio ( id, url, is_cover, order_index ),
      rastreabilidade ( * )
    `)
    .eq('id', id)
    .single()

  if (error) throw error

  // Incrementa visualizações (fire-and-forget)
  supabase.rpc('increment_view', { p_anuncio_id: id }).catch(() => {})

  return data
}

/**
 * Lista anúncios do vendedor autenticado.
 */
export async function getMyListings() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data, error } = await supabase
    .from('anuncios')
    .select(`
      *,
      fotos_anuncio ( url, is_cover ),
      rastreabilidade ( traceability_score:gta )
    `)
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

/**
 * Cria um novo anúncio completo (anuncio + rastreabilidade).
 * @param {{ listing: object, traceability: object, photos: string[] }} payload
 */
export async function createListing({ listing, traceability, photos = [] }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  // 1. Insere anúncio
  const { data: anuncio, error: errAn } = await supabase
    .from('anuncios')
    .insert({ ...listing, seller_id: user.id })
    .select()
    .single()

  if (errAn) throw errAn

  // 2. Insere rastreabilidade
  if (traceability) {
    const { error: errTr } = await supabase
      .from('rastreabilidade')
      .insert({ anuncio_id: anuncio.id, ...traceability })

    if (errTr) throw errTr
  }

  // 3. Insere fotos (apenas URLs, upload feito via uploadsService)
  if (photos.length > 0) {
    const fotoRows = photos.map((url, i) => ({
      anuncio_id:  anuncio.id,
      url,
      storage_path: url,
      is_cover:    i === 0,
      order_index: i,
    }))

    const { error: errFt } = await supabase.from('fotos_anuncio').insert(fotoRows)
    if (errFt) throw errFt
  }

  return anuncio
}

/**
 * Atualiza status do anúncio (pausar, reativar, marcar vendido).
 */
export async function updateListingStatus(id, status) {
  const { data, error } = await supabase
    .from('anuncios')
    .update({ status })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Atualiza campos do anúncio.
 */
export async function updateListing(id, updates) {
  const { data, error } = await supabase
    .from('anuncios')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Remove anúncio (soft delete via status='cancelado').
 */
export async function deleteListing(id) {
  const { error } = await supabase
    .from('anuncios')
    .update({ status: 'cancelado' })
    .eq('id', id)

  if (error) throw error
}

/**
 * Atualiza rastreabilidade de um anúncio.
 */
export async function updateTraceability(anuncioId, data) {
  const { data: result, error } = await supabase
    .from('rastreabilidade')
    .upsert({ anuncio_id: anuncioId, ...data })
    .select()
    .single()

  if (error) throw error
  return result
}
