import { lazy, Suspense, useState } from 'react'
import { ArrowRight, BadgeCheck, MapPinned, Route, ShieldCheck, Truck } from 'lucide-react'

const MapaRota = lazy(() => import('../components/MapaRota'))
import Button from '../components/ui/Button'
import { FieldGroup } from '../components/ui/Input'
import { useUiStore } from '../stores/uiStore'
import { getCarriers, requestFreight } from '../services/logisticsService'

const SPECIES = ['Bovinos', 'Equinos', 'Suínos', 'Aves', 'Ovinos', 'Caprinos']

export default function LogisticsPage() {
  const addToast = useUiStore((s) => s.addToast)
  const [form, setForm] = useState({ origin: '', dest: '', species: 'Bovinos', qty: '', window: '' })
  const [carriers, setCarriers] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [calculated, setCalculated] = useState(false)

  function field(k, v) { setForm((f) => ({ ...f, [k]: v })) }

  async function handleCalc(e) {
    e.preventDefault()
    if (!form.origin || !form.dest) { addToast('Informe origem e destino.', 'error'); return }
    setLoading(true)
    setSelected(null)
    try {
      const data = await getCarriers({ origin: form.origin, dest: form.dest, qty: form.qty })
      setCarriers(data ?? [])
      setCalculated(true)
      addToast('Rota calculada com sucesso!')
    } catch {
      addToast('Erro ao buscar transportadoras. Tente novamente.', 'error')
    }
    setLoading(false)
  }

  async function handleConfirm() {
    const carrier = carriers.find((c) => c.id === selected)
    if (!carrier) return
    setConfirmLoading(true)
    try {
      await requestFreight({ ...form, carrier_id: carrier.id })
      addToast('Frete confirmado com sucesso!')
    } catch {
      addToast('Erro ao confirmar frete.', 'error')
    }
    setConfirmLoading(false)
  }

  function handleSelect(carrier) {
    setSelected(carrier.id)
    addToast(`${carrier.nome_empresa || carrier.name} selecionada. Cotação vinculada à proposta.`)
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))]">
      {/* Header */}
      <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
        <div className="page-container">
          <div className="grid gap-5 py-5 lg:grid-cols-[1fr_240px] lg:items-end">
            <div>
              <p className="section-eyebrow mb-1">Logística e frete</p>
              <h1 className="text-2xl font-black text-[hsl(var(--text))]">Match de rotas para transporte animal</h1>
              <p className="mt-1 text-sm text-[hsl(var(--muted-fg))]">Compare transportadoras por origem, destino, espécie e janela de coleta.</p>
            </div>
            <div className="card px-4 py-4">
              <p className="field-label mb-1">SLA médio de cotação</p>
              <p className="text-3xl font-black text-brand-600">18 min</p>
              <p className="mt-0.5 text-xs text-[hsl(var(--muted-fg))]">com transportadoras verificadas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-6">
        <div className="grid gap-5 lg:grid-cols-[256px_1fr]">
          {/* Route form */}
          <aside className="h-fit card">
            <div className="panel-header">
              <h2 className="flex items-center gap-2 field-label"><Route size={13} className="text-brand-600" /> Simular rota</h2>
            </div>
            <form onSubmit={handleCalc}>
              <div className="divide-y divide-[hsl(var(--border))]">
                {[
                  ['origin', 'Origem', 'text', 'Cidade, UF'],
                  ['dest',   'Destino','text', 'Cidade, UF'],
                ].map(([key, label, type, ph]) => (
                  <div key={key} className="px-4 py-3.5">
                    <FieldGroup label={label}>
                      <input type={type} className="field-input h-9" placeholder={ph} value={form[key]} onChange={(e) => field(key, e.target.value)} />
                    </FieldGroup>
                  </div>
                ))}
                <div className="px-4 py-3.5">
                  <FieldGroup label="Espécie">
                    <select className="field-input h-9 bg-[hsl(var(--surface))]" value={form.species} onChange={(e) => field('species', e.target.value)}>
                      {SPECIES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </FieldGroup>
                </div>
                <div className="px-4 py-3.5">
                  <FieldGroup label="Quantidade (cabeças)">
                    <input type="number" min="1" className="field-input h-9" value={form.qty} onChange={(e) => field('qty', e.target.value)} />
                  </FieldGroup>
                </div>
                <div className="px-4 py-3.5">
                  <FieldGroup label="Janela de coleta">
                    <input className="field-input h-9" placeholder="ex.: 7 a 12 de junho" value={form.window} onChange={(e) => field('window', e.target.value)} />
                  </FieldGroup>
                </div>
              </div>
              <div className="border-t border-[hsl(var(--border))] p-4">
                <Button type="submit" className="w-full" loading={loading}>
                  {!loading && <><Route size={14} /> Calcular rota</>}
                </Button>
              </div>
            </form>
          </aside>

          <div className="space-y-5">
            {/* Route map placeholder */}
            {!calculated ? (
              <div className="card flex flex-col items-center justify-center py-16 text-center">
                <Route size={32} className="mb-3 text-[hsl(var(--border))]" />
                <p className="font-bold text-[hsl(var(--text))]">Simule sua rota</p>
                <p className="mt-1 text-sm text-[hsl(var(--muted-fg))]">Preencha origem, destino e clique em "Calcular rota".</p>
              </div>
            ) : (
              <div className="card overflow-hidden">
                <div className="panel-header">
                  <h2 className="flex items-center gap-2 font-bold text-[hsl(var(--text))]">
                    <MapPinned className="text-brand-600" size={16} /> Rota sugerida
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-700 border border-brand-200 bg-brand-50 px-2 py-0.5 rounded-sm">
                      {form.origin} → {form.dest}
                    </span>
                    {carriers[0]?.distancia_km && (
                      <span className="text-xs text-[hsl(var(--muted-fg))]">
                        ~{carriers[0].distancia_km.toLocaleString('pt-BR')} km
                      </span>
                    )}
                  </div>
                </div>
                <Suspense fallback={
                  <div className="flex items-center justify-center py-16">
                    <p className="text-sm text-[hsl(var(--muted-fg))]">Carregando mapa…</p>
                  </div>
                }>
                  <MapaRota origin={form.origin} destination={form.dest} />
                </Suspense>
              </div>
            )}

            {/* Carriers */}
            {calculated && (
              <div className="card">
                <div className="panel-header">
                  <h2 className="flex items-center gap-2 font-bold text-[hsl(var(--text))]">
                    <Truck className="text-brand-600" size={15} /> Transportadoras disponíveis
                  </h2>
                  <span className="text-xs font-semibold text-[hsl(var(--muted-fg))]">{carriers.length} opções</span>
                </div>

                {carriers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Truck size={28} className="mb-3 text-[hsl(var(--border))]" />
                    <p className="font-bold text-[hsl(var(--text))]">Nenhuma transportadora disponível</p>
                    <p className="mt-1 text-sm text-[hsl(var(--muted-fg))]">Tente outra rota ou espécie.</p>
                  </div>
                ) : (
                  <>
                    <div className="hidden grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-5 py-2 sm:grid">
                      <span />
                      <span className="field-label">Transportadora</span>
                      <span className="field-label text-right">Score</span>
                      <span className="field-label text-right">Prazo</span>
                      <span className="field-label text-right">Cotação</span>
                      <span />
                    </div>

                    <div className="divide-y divide-[hsl(var(--border))]">
                      {carriers.map((c, i) => {
                        const isSel = selected === c.id
                        const name = c.nome_empresa || c.name
                        const score = c.nota_media ? `${c.nota_media}/5` : c.score
                        const time = c.tempo_estimado || c.time
                        const price = c.preco_estimado || c.price
                        const detail = c.veiculo ? `${c.veiculo} · ${c.capacidade} cabeças` : c.detail
                        return (
                          <div key={c.id} className={`flex items-center gap-3 px-4 py-3 sm:grid sm:items-center sm:gap-4 sm:grid-cols-[auto_1fr_auto_auto_auto_auto] sm:px-5 sm:py-4 transition ${isSel ? 'bg-brand-50' : ''}`}>
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center border rounded-sm ${isSel ? 'border-brand-400 bg-brand-100 text-brand-700' : 'border-[hsl(var(--border))] bg-brand-50 text-brand-600'}`}>
                              <Truck size={17} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-bold text-[hsl(var(--text))] truncate">{name}</p>
                                {i === 0 && <span className="text-[10px] font-bold uppercase tracking-wide text-brand-700 border border-brand-200 bg-brand-50 px-1.5 py-0.5 rounded-sm">Melhor preço</span>}
                                {isSel && <span className="text-[10px] font-bold uppercase tracking-wide text-sky-700 border border-sky-200 bg-sky-50 px-1.5 py-0.5 rounded-sm">Selecionada</span>}
                              </div>
                              {detail && <p className="mt-0.5 text-xs text-[hsl(var(--muted-fg))]">{detail}</p>}
                            </div>
                            <div className="hidden text-right sm:block">
                              <p className="flex items-center justify-end gap-1 text-sm font-bold text-brand-700">
                                <ShieldCheck size={12} /> {score}
                              </p>
                            </div>
                            <div className="hidden text-right sm:block">
                              <p className="text-sm font-bold text-[hsl(var(--text))]">{time}</p>
                            </div>
                            <div className="hidden text-right sm:block">
                              <p className="text-sm font-black text-[hsl(var(--text))]">
                                {typeof price === 'number' ? `R$ ${price.toLocaleString('pt-BR')}` : price}
                              </p>
                            </div>
                            <Button size="sm" variant={isSel ? 'outline' : 'primary'} onClick={() => handleSelect(c)}>
                              {isSel ? <><BadgeCheck size={13} /> Selecionada</> : 'Selecionar'}
                            </Button>
                          </div>
                        )
                      })}
                    </div>

                    {selected && (
                      <div className="border-t border-brand-200 bg-brand-50 px-5 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-brand-950">{carriers.find((c) => c.id === selected)?.nome_empresa || carriers.find((c) => c.id === selected)?.name} selecionada</p>
                            <p className="mt-0.5 text-xs text-brand-700">Cotação vinculada. Confirme no painel do comprador após aceite da proposta.</p>
                          </div>
                          <Button size="sm" loading={confirmLoading} onClick={handleConfirm}>
                            {!confirmLoading && <>Confirmar frete <ArrowRight size={13} /></>}
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
