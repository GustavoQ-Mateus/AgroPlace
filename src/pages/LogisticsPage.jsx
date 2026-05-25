import { useState } from 'react'
import { ArrowRight, BadgeCheck, MapPinned, Route, ShieldCheck, Truck } from 'lucide-react'
import Button from '../components/ui/Button'
import { useApp } from '../context/AppContext'

const CARRIERS = [
  { id: 'c1', name: 'Boiadeiro Express', price: 8400, time: '2 dias', score: '98%', detail: 'Carreta boiadeira · 42 cabeças' },
  { id: 'c2', name: 'AgroRota Sul',       price: 9150, time: '3 dias', score: '94%', detail: 'Baú climatizado para aves e suínos' },
  { id: 'c3', name: 'TransCampo Prime',   price: 10200, time: '1 dia', score: '97%', detail: 'Motorista habilitado em bem-estar animal' },
]

const routeDetails = [
  ['Distância', '523 km'],
  ['Pedágios', 'R$ 620'],
  ['Paradas manejo', '2 pontos'],
  ['Risco climático', 'Baixo'],
]

const SPECIES_OPTIONS = ['Bovinos', 'Equinos', 'Suínos', 'Aves', 'Ovinos', 'Caprinos']

export default function LogisticsPage() {
  const { addToast } = useApp()
  const [form, setForm] = useState({ origin: 'Uberaba, MG', dest: 'Campinas, SP', species: 'Bovinos', qty: '40', window: '7 a 12 de maio' })
  const [selectedCarrier, setSelectedCarrier] = useState(null)
  const [loading, setLoading] = useState(false)
  const [calculated, setCalculated] = useState(true)

  function field(key, value) { setForm((f) => ({ ...f, [key]: value })) }

  async function handleCalculate(e) {
    e.preventDefault()
    if (!form.origin || !form.dest) { addToast('Informe origem e destino.', 'error'); return }
    setLoading(true)
    setSelectedCarrier(null)
    await new Promise((r) => setTimeout(r, 800))
    setCalculated(true)
    setLoading(false)
    addToast('Rota calculada com sucesso!')
  }

  function handleSelect(carrier) {
    setSelectedCarrier(carrier.id)
    addToast(`${carrier.name} selecionada. Cotação vinculada à proposta.`)
  }

  return (
    <section className="min-h-screen bg-slate-50 pt-14">
      {/* Page header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 py-6 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <p className="section-label mb-1">Logística e frete</p>
              <h1 className="text-2xl font-black text-emerald-950 sm:text-3xl">
                Match de rotas para transporte animal
              </h1>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">
                Simule origem, destino, quantidade, espécie e janela de coleta para comparar transportadoras.
              </p>
            </div>
            <div className="border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="prop-label mb-1">SLA médio de cotação</p>
              <p className="text-3xl font-black text-emerald-950">18 min</p>
              <p className="mt-0.5 text-sm text-slate-500">com transportadoras verificadas</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Route form */}
          <aside className="h-fit border border-slate-200 bg-white">
            <div className="panel-header">
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-600">
                <Route size={14} className="text-emerald-700" />
                Simular rota
              </h2>
            </div>
            <form onSubmit={handleCalculate}>
              <div className="divide-y divide-slate-100">
                <label className="grid gap-1.5 px-4 py-3.5">
                  <span className="prop-label">Origem</span>
                  <input
                    className="h-9 border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                    value={form.origin}
                    onChange={(e) => field('origin', e.target.value)}
                    placeholder="Cidade, UF"
                  />
                </label>
                <label className="grid gap-1.5 px-4 py-3.5">
                  <span className="prop-label">Destino</span>
                  <input
                    className="h-9 border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                    value={form.dest}
                    onChange={(e) => field('dest', e.target.value)}
                    placeholder="Cidade, UF"
                  />
                </label>
                <label className="grid gap-1.5 px-4 py-3.5">
                  <span className="prop-label">Espécie</span>
                  <select
                    className="h-9 border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                    value={form.species}
                    onChange={(e) => field('species', e.target.value)}
                  >
                    {SPECIES_OPTIONS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
                <label className="grid gap-1.5 px-4 py-3.5">
                  <span className="prop-label">Quantidade (cabeças)</span>
                  <input
                    type="number" min="1"
                    className="h-9 border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                    value={form.qty}
                    onChange={(e) => field('qty', e.target.value)}
                  />
                </label>
                <label className="grid gap-1.5 px-4 py-3.5">
                  <span className="prop-label">Janela de coleta</span>
                  <input
                    className="h-9 border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                    value={form.window}
                    onChange={(e) => field('window', e.target.value)}
                    placeholder="ex.: 7 a 12 de maio"
                  />
                </label>
              </div>
              <div className="border-t border-slate-200 p-4">
                <Button type="submit" className="w-full" loading={loading}>
                  Recalcular frete
                  {!loading && <ArrowRight size={14} />}
                </Button>
              </div>
            </form>
          </aside>

          <div className="space-y-6">
            {/* Route map */}
            <div className="border border-slate-200 bg-white">
              <div className="panel-header">
                <h2 className="flex items-center gap-2 font-black text-emerald-950">
                  <MapPinned className="text-emerald-700" size={17} />
                  Rota sugerida
                </h2>
                {calculated && (
                  <span className="text-xs font-bold text-emerald-700 border border-emerald-200 bg-emerald-50 px-2 py-0.5">
                    {form.origin} → {form.dest}
                  </span>
                )}
              </div>
              <div className="grid gap-0 sm:grid-cols-[1fr_220px] sm:divide-x divide-slate-200">
                <div className="relative min-h-56 bg-[linear-gradient(135deg,#dcfce7_25%,#f8fafc_25%,#f8fafc_50%,#dcfce7_50%,#dcfce7_75%,#f8fafc_75%)] bg-[length:28px_28px]">
                  <div className="absolute left-8 top-8 border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <p className="prop-label mb-0.5">Origem</p>
                    <p className="font-black text-emerald-950">{form.origin || '—'}</p>
                  </div>
                  <div className="absolute bottom-8 right-8 border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <p className="prop-label mb-0.5">Destino</p>
                    <p className="font-black text-emerald-950">{form.dest || '—'}</p>
                  </div>
                  <div className="absolute left-[18%] top-1/2 h-1 w-[62%] -translate-y-1/2 rotate-[-8deg] bg-emerald-600" />
                </div>
                <div className="divide-y divide-slate-100">
                  {routeDetails.map(([label, value]) => (
                    <div className="px-5 py-4" key={label}>
                      <p className="prop-label mb-1">{label}</p>
                      <p className="text-sm font-black text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Carrier comparison table */}
            <div className="border border-slate-200 bg-white">
              <div className="panel-header">
                <h2 className="flex items-center gap-2 font-black text-emerald-950">
                  <Truck className="text-emerald-700" size={16} />
                  Transportadoras disponíveis
                </h2>
                <span className="text-xs font-semibold text-slate-400">{CARRIERS.length} opções</span>
              </div>

              <div className="hidden grid-cols-[auto_1fr_auto_auto_auto_auto] items-center gap-4 border-b border-slate-100 bg-slate-50 px-5 py-2.5 sm:grid">
                <span />
                <span className="prop-label">Transportadora</span>
                <span className="prop-label text-right">Score</span>
                <span className="prop-label text-right">Prazo</span>
                <span className="prop-label text-right">Cotação</span>
                <span />
              </div>

              <div className="divide-y divide-slate-100">
                {CARRIERS.map((carrier, index) => {
                  const isSelected = selectedCarrier === carrier.id
                  return (
                    <div
                      key={carrier.id}
                      className={`grid items-center gap-4 px-5 py-4 transition sm:grid-cols-[auto_1fr_auto_auto_auto_auto] ${isSelected ? 'bg-emerald-50' : ''}`}
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center border text-emerald-700 ${isSelected ? 'border-emerald-400 bg-emerald-100' : 'border-slate-200 bg-emerald-50'}`}>
                        <Truck size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-emerald-950">{carrier.name}</h3>
                          {index === 0 && (
                            <span className="border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                              Melhor preço
                            </span>
                          )}
                          {isSelected && (
                            <span className="border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                              Selecionada
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500">{carrier.detail}</p>
                      </div>
                      <div className="hidden text-right sm:block">
                        <p className="flex items-center justify-end gap-1 text-sm font-bold text-emerald-700">
                          <ShieldCheck size={12} />
                          {carrier.score}
                        </p>
                      </div>
                      <div className="hidden text-right sm:block">
                        <p className="text-sm font-bold text-slate-800">{carrier.time}</p>
                      </div>
                      <div className="hidden text-right sm:block">
                        <p className="text-sm font-black text-emerald-950">
                          R$ {carrier.price.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={isSelected ? 'outline' : 'primary'}
                        onClick={() => handleSelect(carrier)}
                      >
                        {isSelected ? 'Selecionada' : 'Selecionar'}
                        {isSelected && <BadgeCheck size={13} />}
                      </Button>
                    </div>
                  )
                })}
              </div>

              {selectedCarrier && (
                <div className="border-t border-emerald-200 bg-emerald-50 px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-emerald-950">
                        {CARRIERS.find((c) => c.id === selectedCarrier)?.name} selecionada
                      </p>
                      <p className="mt-0.5 text-xs text-emerald-700">Cotação vinculada. Confirme no painel do comprador após aceite da proposta.</p>
                    </div>
                    <Button size="sm">
                      Confirmar frete
                      <ArrowRight size={13} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
