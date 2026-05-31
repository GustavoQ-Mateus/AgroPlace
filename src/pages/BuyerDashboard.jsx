import { Link } from 'react-router-dom'
import { CalendarCheck2, CheckCircle2, Clock3, FileText, MapPinned, PackageSearch, Search, Truck } from 'lucide-react'
import Button from '../components/ui/Button'
import { FEATURED_ANIMALS, ORDERS } from '../data/mockAnimals'
import { useApp } from '../context/AppContext'
import OnboardingModal from '../components/OnboardingModal'
import { useState } from 'react'

const OB_KEY_BUYER = 'agroplace_onboarding_buyer_done'

const stateStyle = {
  done:   'bg-emerald-600 text-white border-emerald-600',
  active: 'bg-amber-50 text-amber-700 border-amber-300',
  idle:   'bg-white text-slate-400 border-slate-200',
}

export default function BuyerDashboard() {
  const { proposals, savedAnimals, toggleSave, addToast } = useApp()
  const [showOnboarding, setShowOnboarding] = useState(() => !localStorage.getItem(OB_KEY_BUYER))
  function closeOnboarding() { localStorage.setItem(OB_KEY_BUYER, '1'); setShowOnboarding(false) }

  // Lotes salvos reais: busca nos FEATURED_ANIMALS pelo ID
  const savedList = FEATURED_ANIMALS.filter((a) => savedAnimals.has(a.id))

  const allOrders = [
    ...proposals.map((p) => ({
      id: p.id,
      animal: p.animal,
      date: new Date(p.createdAt).toLocaleDateString('pt-BR'),
      status: p.status,
      amount: p.price,
    })),
    ...ORDERS,
  ]

  const timeline = [
    ['Proposta enviada', proposals.length > 0 ? 'Enviada' : 'Aguardando', CheckCircle2, proposals.length > 0 ? 'done' : 'idle'],
    ['Aceite do vendedor', 'Aguardando retorno', Clock3, proposals.length > 0 ? 'active' : 'idle'],
    ['Contrato e sinal', 'Após aceite', FileText, 'idle'],
    ['Frete e retirada', '7 a 12 de maio', Truck, 'idle'],
  ]

  return (
    <section className="min-h-screen bg-slate-50 pt-14">
      {/* Page header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label mb-1">Dashboard comprador</p>
              <h1 className="text-2xl font-black text-emerald-950 sm:text-3xl">
                Pedidos, buscas e documentos
              </h1>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">
                Acompanhe negociações, status de frete, documentos fiscais e lotes salvos.
              </p>
            </div>
            <Link to="/catalogo">
              <Button>
                <Search size={15} />
                Nova busca
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            {/* Timeline */}
            <div className="border border-slate-200 bg-white">
              <div className="panel-header">
                <h2 className="flex items-center gap-2 font-black text-emerald-950">
                  <PackageSearch className="text-emerald-700" size={17} />
                  Timeline da negociação
                </h2>
                {proposals.length > 0 && (
                  <span className="border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                    {proposals.length} proposta{proposals.length > 1 ? 's' : ''} ativa{proposals.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="grid divide-y divide-slate-100 sm:grid-cols-4 sm:divide-x sm:divide-y-0">
                {timeline.map(([title, date, Icon, state], index) => (
                  <div className="px-5 py-4" key={title}>
                    <div className="mb-3 flex items-center gap-2">
                      <span className={`flex h-7 w-7 items-center justify-center border text-xs font-black ${stateStyle[state]}`}>
                        {index + 1}
                      </span>
                      <Icon
                        className={state === 'done' ? 'text-emerald-600' : state === 'active' ? 'text-amber-600' : 'text-slate-300'}
                        size={15}
                      />
                    </div>
                    <p className="font-bold text-emerald-950">{title}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Orders table */}
            <div className="border border-slate-200 bg-white">
              <div className="panel-header">
                <h2 className="font-black text-emerald-950">
                  Pedidos recentes
                  <span className="ml-2 text-sm font-semibold text-slate-400">({allOrders.length})</span>
                </h2>
                <Button size="sm" variant="outline">Ver todos</Button>
              </div>

              <div className="hidden grid-cols-[auto_1fr_auto_auto] items-center gap-4 border-b border-slate-100 bg-slate-50 px-5 py-2.5 sm:grid">
                <span className="prop-label">ID</span>
                <span className="prop-label">Lote</span>
                <span className="prop-label text-right">Valor</span>
                <span />
              </div>

              <div className="divide-y divide-slate-100">
                {allOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <PackageSearch size={28} className="mb-3 text-slate-300" />
                    <p className="font-semibold text-slate-500">Nenhum pedido ainda</p>
                    <Link to="/catalogo" className="mt-3 text-sm font-bold text-emerald-700 hover:text-emerald-800">
                      Explorar catálogo
                    </Link>
                  </div>
                ) : (
                  allOrders.map((order) => (
                    <div className="grid items-center gap-4 px-5 py-4 sm:grid-cols-[auto_1fr_auto_auto]" key={order.id}>
                      <div className="hidden sm:block">
                        <p className="font-mono text-sm font-bold text-slate-500">{order.id}</p>
                      </div>
                      <div>
                        <p className="font-bold text-emerald-950">{order.animal}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {order.date} ·{' '}
                          <span className={`font-bold ${order.status === 'Aguardando' ? 'text-amber-600' : 'text-emerald-600'}`}>
                            {order.status}
                          </span>
                        </p>
                      </div>
                      <span className="hidden text-right sm:block">
                        <p className="font-black text-slate-800">{order.amount}</p>
                      </span>
                      <Button size="sm" variant="outline">Abrir</Button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Upcoming actions */}
            <div className="border border-slate-200 bg-white">
              <div className="panel-header">
                <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-600">
                  <CalendarCheck2 size={14} className="text-emerald-700" />
                  Próximas ações
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {proposals.length > 0 ? (
                  <div className="flex items-start justify-between px-4 py-3.5">
                    <div>
                      <p className="text-sm font-bold text-amber-700">Aguardar aceite do vendedor</p>
                      <p className="mt-0.5 text-xs text-slate-500">{proposals[0].animal} · Enviado agora</p>
                    </div>
                    <Clock3 size={14} className="mt-0.5 text-amber-400" />
                  </div>
                ) : null}
                {[
                  ['Assinar contrato digital', 'Hoje até 18h', 'urgent'],
                  ['Enviar comprovante do sinal', 'Após aceite', 'normal'],
                  ['Confirmar janela de coleta', 'Até 06 mai', 'normal'],
                ].map(([title, date, priority]) => (
                  <div className="flex items-start justify-between px-4 py-3.5" key={title}>
                    <div>
                      <p className={`text-sm font-bold ${priority === 'urgent' ? 'text-red-700' : 'text-slate-800'}`}>
                        {title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">{date}</p>
                    </div>
                    <Clock3 size={14} className={priority === 'urgent' ? 'mt-0.5 text-red-400' : 'mt-0.5 text-slate-300'} />
                  </div>
                ))}
              </div>
            </div>

            {/* Saved lots */}
            <div className="border border-slate-200 bg-white">
              <div className="panel-header">
                <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-600">
                  <MapPinned size={14} className="text-emerald-700" />
                  Lotes salvos
                </h2>
                <span className="text-xs font-semibold text-slate-400">{savedAnimals.size} salvo{savedAnimals.size !== 1 ? 's' : ''}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {savedList.length === 0 && (
                  <div className="px-4 py-6 text-center">
                    <p className="text-sm text-slate-500">Nenhum lote salvo ainda.</p>
                    <Link to="/catalogo" className="mt-2 block text-xs font-bold text-emerald-700">
                      Explorar catálogo
                    </Link>
                  </div>
                )}
                {savedList.slice(0, 4).map((animal) => (
                  <div
                    className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-slate-50"
                    key={animal.id}
                  >
                    <Link to={`/anuncio/${animal.id}`} className="flex flex-1 items-center gap-3 min-w-0">
                      <img alt={animal.title} className="h-12 w-12 shrink-0 bg-slate-200 object-cover" src={animal.image} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-emerald-950">{animal.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{animal.location}</p>
                      </div>
                    </Link>
                    <button
                      onClick={() => toggleSave(animal.id)}
                      className="shrink-0 text-xs font-bold text-slate-400 hover:text-red-500"
                    >
                      {savedAnimals.has(animal.id) ? '✕' : '♡'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
      {showOnboarding && (
        <OnboardingModal role="comprador" onClose={closeOnboarding} />
      )}
    </section>
  )
}
