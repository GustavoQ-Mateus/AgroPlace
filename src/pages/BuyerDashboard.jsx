import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { CalendarCheck2, CheckCircle2, Clock3, FileText, Heart, MapPinned, PackageSearch, Search, Truck } from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { formatCurrency } from '../lib/utils'
import { useFavorites, useToggleFavorite } from '../hooks/useFavorites'
import { useAnimals } from '../hooks/useAnimals'
import { getMyProposals } from '../services/proposalsService'

const STEPS = [
  [CheckCircle2, 'Proposta enviada',    'Concluído',        'done'],
  [Clock3,       'Aceite do vendedor',  'Aguardando',       'active'],
  [FileText,     'Contrato e sinal',    'Após aceite',      'idle'],
  [Truck,        'Frete e retirada',    'A definir',        'idle'],
]

const stateStyle = {
  done:   'bg-brand-600 text-white border-brand-600',
  active: 'bg-accent-50 text-accent-700 border-accent-300',
  idle:   'bg-[hsl(var(--surface))] text-[hsl(var(--muted-fg))] border-[hsl(var(--border))]',
}

export default function BuyerDashboard() {
  const { data: favIds = [] } = useFavorites()
  const toggle = useToggleFavorite()
  const { data: allAnimals = [] } = useAnimals()
  const { data: proposals = [], isLoading: proposalsLoading } = useQuery({
    queryKey: ['my-proposals'],
    queryFn: getMyProposals,
  })

  const savedList = allAnimals.filter((a) => favIds.includes(a.id))

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))]">
      {/* Header */}
      <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
        <div className="page-container">
          <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow mb-1">Dashboard comprador</p>
              <h1 className="text-2xl font-black text-[hsl(var(--text))]">Pedidos, buscas e documentos</h1>
              <p className="mt-1 text-sm text-[hsl(var(--muted-fg))]">Acompanhe negociações, status de frete e lotes salvos.</p>
            </div>
            <Link to="/catalogo"><Button size="md"><Search size={15} /> Explorar catálogo</Button></Link>
          </div>
        </div>
      </div>

      <div className="page-container py-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          {/* Main */}
          <div className="space-y-5">
            {/* Proposals */}
            <div className="card">
              <div className="panel-header">
                <h2 className="font-bold text-[hsl(var(--text))]">
                  Minhas propostas{' '}
                  {!proposalsLoading && <span className="text-sm font-semibold text-[hsl(var(--muted-fg))]">({proposals.length})</span>}
                </h2>
              </div>
              {proposalsLoading ? (
                <div className="px-5 py-8 text-center text-sm text-[hsl(var(--muted-fg))]">Carregando…</div>
              ) : proposals.length > 0 ? (
                <div className="divide-y divide-[hsl(var(--border))]">
                  {proposals.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-4">
                      <div>
                        <p className="font-semibold text-[hsl(var(--text))]">{p.animal || p.anuncio?.title || p.anuncio_id}</p>
                        <p className="mt-0.5 text-xs text-[hsl(var(--muted-fg))]">
                          {p.date || new Date(p.created_at).toLocaleDateString('pt-BR')} · {formatCurrency(p.amount || p.price_offered)}
                        </p>
                      </div>
                      <Badge variant={p.status === 'Aceita' || p.status === 'ACEITA' ? 'active' : 'pending'}>
                        {p.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <PackageSearch size={28} className="mb-3 text-[hsl(var(--border))]" />
                  <p className="font-bold text-[hsl(var(--text))]">Nenhuma proposta enviada</p>
                  <p className="mt-1 text-xs text-[hsl(var(--muted-fg))]">Explore o catálogo e faça sua primeira oferta.</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            {proposals.length > 0 && (
              <div className="card">
                <div className="panel-header">
                  <h2 className="font-bold text-[hsl(var(--text))]">Progresso da negociação ativa</h2>
                </div>
                <div className="px-5 py-5">
                  <div className="relative">
                    <div className="absolute left-5 top-5 bottom-5 w-px bg-[hsl(var(--border))]" />
                    <div className="space-y-5">
                      {STEPS.map(([Icon, label, sub, state]) => (
                        <div key={label} className="relative flex items-start gap-4">
                          <span className={`relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 ${stateStyle[state]}`}>
                            <Icon size={15} />
                          </span>
                          <div className="pt-1.5">
                            <p className="font-semibold text-sm text-[hsl(var(--text))]">{label}</p>
                            <p className="text-xs text-[hsl(var(--muted-fg))]">{sub}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Saved animals */}
            <div className="card">
              <div className="panel-header">
                <h2 className="flex items-center gap-2 font-bold text-[hsl(var(--text))] text-sm"><Heart size={13} className="text-red-400" /> Lotes salvos ({savedList.length})</h2>
              </div>
              {savedList.length > 0 ? (
                <div className="divide-y divide-[hsl(var(--border))]">
                  {savedList.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 px-4 py-3">
                      <img src={a.image ?? '/assets/hero-farm.jpg'} alt={a.title} className="h-12 w-14 object-cover rounded-sm shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-[hsl(var(--text))] line-clamp-1">{a.title}</p>
                        <p className="text-[11px] font-black text-brand-600">{formatCurrency(a.price)}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Link to={`/anuncio/${a.id}`}><Button size="xs" variant="outline">Ver</Button></Link>
                        <button onClick={() => toggle.mutate(a.id)} className="text-[hsl(var(--muted-fg))] hover:text-red-500 p-1">
                          <Heart size={13} className="fill-red-500 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                  <Heart size={24} className="mb-2 text-[hsl(var(--border))]" />
                  <p className="text-xs font-bold text-[hsl(var(--text))]">Nenhum lote salvo</p>
                  <p className="mt-1 text-[11px] text-[hsl(var(--muted-fg))]">Salve lotes do catálogo para ver aqui.</p>
                  <Link to="/catalogo" className="mt-3"><Button size="xs">Explorar catálogo</Button></Link>
                </div>
              )}
            </div>

            {/* Quick links */}
            <div className="card">
              <div className="panel-header">
                <h2 className="font-bold text-[hsl(var(--text))] text-sm">Ações rápidas</h2>
              </div>
              <div className="divide-y divide-[hsl(var(--border))]">
                {[
                  ['/catalogo',  <Search size={14} />,      'Buscar lotes'],
                  ['/logistica', <Truck size={14} />,       'Cotar frete'],
                  ['/catalogo',  <MapPinned size={14} />,   'Ver no mapa'],
                  ['/catalogo',  <CalendarCheck2 size={14}/>, 'Agenda de retirada'],
                ].map(([to, icon, label]) => (
                  <Link key={label} to={to} className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-[hsl(var(--text-sub))] transition hover:bg-[hsl(var(--muted))] hover:text-brand-700">
                    <span className="text-brand-600">{icon}</span> {label}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
