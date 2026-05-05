import { Link } from 'react-router-dom'
import { CalendarCheck2, CheckCircle2, Clock3, FileText, MapPinned, PackageSearch, Search, Truck } from 'lucide-react'
import Button from '../components/ui/Button'
import { FEATURED_ANIMALS, ORDERS } from '../data/mockAnimals'

const timeline = [
  ['Proposta enviada', 'Hoje, 09:12', CheckCircle2, 'done'],
  ['Aceite do vendedor', 'Aguardando retorno', Clock3, 'active'],
  ['Contrato e sinal', 'Após aceite', FileText, 'idle'],
  ['Frete e retirada', '7 a 12 de maio', Truck, 'idle'],
]

export default function BuyerDashboard() {
  return (
    <section className="min-h-screen bg-slate-50 pt-24">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-600">Dashboard comprador</p>
            <h1 className="max-w-[21rem] text-3xl font-black leading-tight text-emerald-950 sm:max-w-none sm:text-4xl">
              Pedidos, buscas e documentos
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Acompanhe negociações, status de frete, documentos fiscais e lotes salvos.
            </p>
          </div>
          <Link to="/catalogo">
            <Button>
              <Search size={17} />
              Nova busca
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-emerald-950">
                <PackageSearch className="text-emerald-700" size={22} />
                Timeline da negociação
              </h2>
              <div className="grid gap-4 md:grid-cols-4">
                {timeline.map(([title, date, Icon, state], index) => (
                  <div className="relative rounded-lg border border-slate-200 bg-slate-50 p-4" key={title}>
                    <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${state === 'done' ? 'bg-emerald-600 text-white' : state === 'active' ? 'bg-amber-100 text-amber-700' : 'bg-white text-slate-500'}`}>
                      <Icon size={19} />
                    </div>
                    <p className="font-black text-emerald-950">{title}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">{date}</p>
                    <span className="absolute right-3 top-3 text-xs font-black text-slate-300">0{index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <h2 className="font-black text-emerald-950">Pedidos recentes</h2>
                <Button size="sm" variant="outline">
                  Ver todos
                </Button>
              </div>
              <div className="divide-y divide-slate-100">
                {ORDERS.map((order) => (
                  <div className="grid gap-3 px-5 py-4 sm:grid-cols-[1fr_auto]" key={order.id}>
                    <div>
                      <p className="font-black text-emerald-950">{order.id}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-700">{order.animal}</p>
                      <p className="mt-1 text-xs text-slate-500">{order.date} · {order.status}</p>
                    </div>
                    <div className="flex items-center gap-3 sm:justify-end">
                      <span className="font-black text-slate-800">{order.amount}</span>
                      <Button size="sm" variant="outline">
                        Abrir
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 font-black text-emerald-950">
                <CalendarCheck2 className="text-emerald-700" size={20} />
                Próximas ações
              </h2>
              {[
                ['Assinar contrato digital', 'Hoje até 18h'],
                ['Enviar comprovante do sinal', 'Após aceite'],
                ['Confirmar janela de coleta', 'Até 06 mai'],
              ].map(([title, date]) => (
                <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0" key={title}>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{title}</p>
                    <p className="text-xs text-slate-500">{date}</p>
                  </div>
                  <Clock3 size={16} className="text-slate-400" />
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 font-black text-emerald-950">
                <MapPinned className="text-emerald-700" size={20} />
                Lotes salvos
              </h2>
              <div className="space-y-3">
                {FEATURED_ANIMALS.slice(1, 4).map((animal) => (
                  <Link className="flex gap-3 rounded-lg border border-slate-200 p-3 transition hover:border-emerald-200" key={animal.id} to={`/anuncio/${animal.id}`}>
                    <img alt={animal.title} className="h-14 w-14 rounded-md object-cover" src={animal.image} />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-emerald-950">{animal.title}</p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">{animal.location}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
