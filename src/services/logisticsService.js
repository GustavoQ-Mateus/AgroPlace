import { supabase } from '../lib/supabase'

export async function getCarriers() {
  try {
    const { data, error } = await supabase
      .from('perfis_transportadora')
      .select('*')
      .limit(10)
    if (error) throw error
    return data || []
  } catch {
    return [
      { id: 1, nome_empresa: 'TransAgro Sul', nota_media: 4.8, preco_estimado: 2850, tempo_estimado: '2-3 dias', veiculo: 'Boiadeiro 24m', capacidade: 40 },
      { id: 2, nome_empresa: 'Frete Pecuário', nota_media: 4.6, preco_estimado: 3100, tempo_estimado: '1-2 dias', veiculo: 'Bitrem 30m', capacidade: 55 },
      { id: 3, nome_empresa: 'AgroFrete Express', nota_media: 4.5, preco_estimado: 3400, tempo_estimado: '1 dia', veiculo: 'Bitrem 30m', capacidade: 48 },
    ]
  }
}

export async function requestFreight({ anuncio_id, transportadora_id, origem, destino, data_coleta }) {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    const { data, error } = await supabase
      .from('solicitacoes_frete')
      .insert({ anuncio_id, transportadora_id, comprador_id: user?.id, origem, destino, data_coleta, status: 'AGUARDANDO' })
      .select()
      .single()
    if (error) throw error
    return data
  } catch {
    return { id: 'demo-freight-' + Date.now(), status: 'AGUARDANDO' }
  }
}
