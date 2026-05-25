import { supabase } from '../lib/supabase'

/**
 * Envia uma proposta de compra.
 * @param {{
 *   anuncio_id:      string,
 *   seller_id:       string,
 *   price_offered:   number,
 *   signal_pct:      number,
 *   withdrawal_date: string,
 *   freight_mode:    string,
 *   message:         string
 * }} data
 */
export async function sendProposal(data) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Faça login para enviar uma proposta')

  const { data: proposta, error } = await supabase
    .from('propostas')
    .insert({ ...data, buyer_id: user.id })
    .select()
    .single()

  if (error) throw error
  return proposta
}

/**
 * Lista propostas do comprador autenticado.
 */
export async function getMyProposals() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data, error } = await supabase
    .from('propostas')
    .select(`
      *,
      anuncios ( id, title, category, breed, city, state ),
      seller:seller_id ( id, name, verified )
    `)
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

/**
 * Lista propostas recebidas no anúncio do vendedor autenticado.
 */
export async function getProposalsForSeller() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data, error } = await supabase
    .from('propostas')
    .select(`
      *,
      anuncios ( id, title, city, state ),
      buyer:buyer_id ( id, name, verified, phone )
    `)
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

/**
 * Vendedor aceita uma proposta.
 * Cria automaticamente um contrato.
 */
export async function acceptProposal(propostaId, sellerNote = '') {
  // 1. Atualiza status da proposta
  const { data: proposta, error: err1 } = await supabase
    .from('propostas')
    .update({ status: 'aceita', seller_note: sellerNote })
    .eq('id', propostaId)
    .select()
    .single()

  if (err1) throw err1

  // 2. Cria contrato vinculado
  const signal = (proposta.price_offered * proposta.signal_pct) / 100
  const { data: contrato, error: err2 } = await supabase
    .from('contratos')
    .insert({
      proposta_id:     proposta.id,
      anuncio_id:      proposta.anuncio_id,
      buyer_id:        proposta.buyer_id,
      seller_id:       proposta.seller_id,
      price_final:     proposta.price_offered,
      signal_value:    signal,
      withdrawal_date: proposta.withdrawal_date,
      status:          'pendente',
    })
    .select()
    .single()

  if (err2) throw err2
  return { proposta, contrato }
}

/**
 * Vendedor recusa uma proposta.
 */
export async function rejectProposal(propostaId, sellerNote = '') {
  const { data, error } = await supabase
    .from('propostas')
    .update({ status: 'recusada', seller_note: sellerNote })
    .eq('id', propostaId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Comprador cancela uma proposta (somente se ainda aguardando).
 */
export async function cancelProposal(propostaId) {
  const { data, error } = await supabase
    .from('propostas')
    .update({ status: 'cancelada' })
    .eq('id', propostaId)
    .eq('status', 'aguardando')
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Retorna detalhes de uma proposta/contrato específico.
 */
export async function getProposal(propostaId) {
  const { data, error } = await supabase
    .from('propostas')
    .select(`
      *,
      anuncios ( * ),
      buyer:buyer_id ( id, name, phone, verified ),
      seller:seller_id ( id, name, phone, verified ),
      contratos ( * )
    `)
    .eq('id', propostaId)
    .single()

  if (error) throw error
  return data
}
