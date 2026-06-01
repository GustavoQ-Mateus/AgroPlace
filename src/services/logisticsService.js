import { api } from '../lib/api'

export async function getCarriers() {
  try {
    return await api.get('/api/carriers')
  } catch {
    return [
      { id: 1, nome_empresa: 'TransAgro Sul',    nota_media: 4.8, preco_estimado: 2850, tempo_estimado: '2-3 dias', veiculo: 'Boiadeiro 24m', capacidade: 40 },
      { id: 2, nome_empresa: 'Frete Pecuário',   nota_media: 4.6, preco_estimado: 3100, tempo_estimado: '1-2 dias', veiculo: 'Bitrem 30m',    capacidade: 55 },
      { id: 3, nome_empresa: 'AgroFrete Express', nota_media: 4.5, preco_estimado: 3400, tempo_estimado: '1 dia',   veiculo: 'Bitrem 30m',    capacidade: 48 },
    ]
  }
}

export async function requestFreight(payload) {
  try {
    return await api.post('/api/freight', payload)
  } catch {
    return { id: 'demo-freight-' + Date.now(), status: 'AGUARDANDO' }
  }
}
