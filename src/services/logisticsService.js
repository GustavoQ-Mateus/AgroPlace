import { supabase } from '../lib/supabase'

/**
 * Cria uma solicitação de frete e retorna cotações disponíveis.
 * @param {{
 *   anuncio_id?:       string,
 *   proposta_id?:      string,
 *   origin_city:       string,
 *   origin_state:      string,
 *   dest_city:         string,
 *   dest_state:        string,
 *   species:           string,
 *   quantity:          number,
 *   collection_window: string,
 *   notes?:            string
 * }} data
 */
export async function createFreightRequest(data) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data: solicitacao, error } = await supabase
    .from('solicitacoes_frete')
    .insert({ ...data, requester_id: user.id, status: 'aberta' })
    .select()
    .single()

  if (error) throw error
  return solicitacao
}

/**
 * Lista transportadoras disponíveis para uma rota.
 * Filtra por estado de origem e destino, e por tipo de veículo.
 */
export async function getAvailableCarriers({ originState, destState, species = null }) {
  let query = supabase
    .from('perfis_transportadora')
    .select(`
      id, razao_social, nome_fantasia, vehicle_types,
      max_capacity_kg, score, city, state,
      profiles:profile_id ( name, verified ),
      regioes_atendimento ( state, city )
    `)
    .eq('live_transport', true)
    .order('score', { ascending: false })

  const { data, error } = await query
  if (error) throw error

  // Filtra por cobertura geográfica no cliente
  return (data ?? []).filter((c) => {
    const regioes = c.regioes_atendimento ?? []
    if (regioes.length === 0) return true // sem restrição de região
    const states = regioes.map((r) => r.state)
    return states.includes(originState) || states.includes(destState)
  })
}

/**
 * Lista solicitações de frete do usuário autenticado.
 */
export async function getMyFreightRequests() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data, error } = await supabase
    .from('solicitacoes_frete')
    .select(`
      *,
      cotacoes_frete (
        id, price, deadline_days, status,
        carrier:carrier_id ( razao_social, nome_fantasia, score )
      )
    `)
    .eq('requester_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}

/**
 * Transportadora envia cotação para uma solicitação.
 */
export async function submitQuote({ solicitacaoId, price, deadlineDays, notes }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  // Busca o perfil de transportadora do usuário
  const { data: carrier, error: errC } = await supabase
    .from('perfis_transportadora')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  if (errC) throw new Error('Perfil de transportadora não encontrado')

  const { data: cotacao, error } = await supabase
    .from('cotacoes_frete')
    .insert({
      solicitacao_id: solicitacaoId,
      carrier_id:     carrier.id,
      price,
      deadline_days:  deadlineDays,
      notes,
      status:         'enviada',
    })
    .select()
    .single()

  if (error) throw error

  // Atualiza status da solicitação para 'cotando'
  await supabase
    .from('solicitacoes_frete')
    .update({ status: 'cotando' })
    .eq('id', solicitacaoId)
    .eq('status', 'aberta')

  return cotacao
}

/**
 * Comprador seleciona uma cotação.
 */
export async function acceptQuote(cotacaoId, solicitacaoId) {
  // Aceita a cotação selecionada
  const { error: err1 } = await supabase
    .from('cotacoes_frete')
    .update({ status: 'aceita' })
    .eq('id', cotacaoId)

  if (err1) throw err1

  // Confirma solicitação
  const { data, error: err2 } = await supabase
    .from('solicitacoes_frete')
    .update({ status: 'confirmada' })
    .eq('id', solicitacaoId)
    .select()
    .single()

  if (err2) throw err2
  return data
}

/**
 * Lista cotações recebidas por uma transportadora autenticada.
 */
export async function getMyQuotes() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Não autenticado')

  const { data: carrier } = await supabase
    .from('perfis_transportadora')
    .select('id')
    .eq('profile_id', user.id)
    .single()

  if (!carrier) return []

  const { data, error } = await supabase
    .from('cotacoes_frete')
    .select(`
      *,
      solicitacoes_frete (
        origin_city, origin_state, dest_city, dest_state,
        species, quantity, collection_window
      )
    `)
    .eq('carrier_id', carrier.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data ?? []
}
