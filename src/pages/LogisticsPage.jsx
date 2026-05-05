import { ArrowRight, BadgeCheck, MapPinned, Route, ShieldCheck, Truck } from 'lucide-react'
import Button from '../components/ui/Button'

const carriers = [
  { name: 'Boiadeiro Express', price: 'R$ 8.400', time: '2 dias', score: '98%', detail: 'Carreta boiadeira · 42 cabeças' },
  { name: 'AgroRota Sul', price: 'R$ 9.150', time: '3 dias', score: '94%', detail: 'Baú climatizado para aves e suínos' },
  { name: 'TransCampo Prime', price: 'R$ 10.200', time: '1 dia', score: '97%', detail: 'Motorista habilitado em bem-estar animal' },
]

export default function LogisticsPage() {
  return (
    <section className="min-h-screen bg-slate-50 pt-24">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-600">Logística e frete</p>
            <h1 className="max-w-[21rem] text-3xl font-black leading-tight text-emerald-950 sm:max-w-none sm:text-4xl">
              Match de rotas para transporte animal
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Simule origem, destino, quantidade, espécie e janela de coleta para comparar transportadoras e frete próprio.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">SLA médio de cotação</p>
            <p className="mt-1 text-3xl font-black text-emerald-950">18 min</p>
            <p className="mt-1 text-sm font-semibold text-slate-500">com transportadoras verificadas</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-black text-emerald-950">
              <Route size={21} className="text-emerald-700" />
              Simular rota
            </h2>
            <div className="grid gap-4">
              {[
                ['Origem', 'Uberaba, MG'],
                ['Destino', 'Campinas, SP'],
                ['Espécie', 'Bovinos'],
                ['Quantidade', '40 cabeças'],
                ['Janela de coleta', '7 a 12 de maio'],
              ].map(([label, value]) => (
                <label className="grid gap-1.5" key={label}>
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
                  <input className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15" defaultValue={value} />
                </label>
              ))}
            </div>
            <Button className="mt-5 w-full">
              Recalcular frete
              <ArrowRight size={16} />
            </Button>
          </aside>

          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-lg font-black text-emerald-950">
                <MapPinned className="text-emerald-700" size={21} />
                Rota sugerida
              </h2>
              <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
                <div className="relative min-h-72 overflow-hidden rounded-lg border border-slate-200 bg-[linear-gradient(135deg,#dcfce7_25%,#f8fafc_25%,#f8fafc_50%,#dcfce7_50%,#dcfce7_75%,#f8fafc_75%)] bg-[length:32px_32px]">
                  <div className="absolute left-8 top-10 rounded-lg bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Origem</p>
                    <p className="font-black text-emerald-950">Uberaba, MG</p>
                  </div>
                  <div className="absolute bottom-10 right-8 rounded-lg bg-white px-4 py-3 shadow-sm">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Destino</p>
                    <p className="font-black text-emerald-950">Campinas, SP</p>
                  </div>
                  <div className="absolute left-[20%] top-1/2 h-1 w-[58%] -translate-y-1/2 rotate-[-8deg] rounded-full bg-emerald-600" />
                </div>
                <div className="grid gap-3">
                  {[
                    ['Distância', '523 km'],
                    ['Pedágios', 'R$ 620'],
                    ['Paradas manejo', '2 pontos'],
                    ['Risco climático', 'Baixo'],
                  ].map(([label, value]) => (
                    <div className="rounded-lg bg-slate-50 p-4" key={label}>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
                      <p className="mt-1 font-black text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {carriers.map((carrier) => (
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={carrier.name}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                        <Truck size={23} />
                      </div>
                      <div>
                        <h3 className="font-black text-emerald-950">{carrier.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">{carrier.detail}</p>
                        <p className="mt-2 flex items-center gap-2 text-xs font-bold text-emerald-700">
                          <ShieldCheck size={14} />
                          Score operacional {carrier.score}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Prazo</p>
                        <p className="font-black text-slate-800">{carrier.time}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Cotação</p>
                        <p className="font-black text-emerald-950">{carrier.price}</p>
                      </div>
                      <Button>
                        Selecionar
                        <BadgeCheck size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
