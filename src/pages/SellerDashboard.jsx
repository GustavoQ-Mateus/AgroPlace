import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, CheckCircle2, DollarSign, Edit2, Eye, FilePlus2, MoreHorizontal, PackageCheck, Plus, ShieldCheck, Trash2, TrendingUp } from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { FEATURED_ANIMALS } from '../data/mockAnimals'
import { formatCurrency } from '../lib/utils'
import { useUiStore } from '../stores/uiStore'
import { useMyListings, useDeleteListing } from '../hooks/useAnimals'
import { updateListingStatus } from '../services/listingsService'

const METRICS = [
  ['Receita em propostas', 'R$ 412.000', DollarSign, '+12% vs. mês anterior'],
  ['Lotes ativos', '8', PackageCheck, '3 com proposta aberta'],
  ['Score médio', '93%', ShieldCheck, 'Acima da média da plataforma'],
  ['Documentos pendentes', '3', CheckCircle2, 'Requer ação'],
]

const FUNNEL = [
  ['Visualizações',        '1.284', 100],
  ['Propostas recebidas',  '23',    78],
  ['Contratos em aceite',  '4',     45],
  ['Fretes cotados',       '11',    60],
]

const WIZARD_STEPS = ['Dados do lote', 'Fotos e vídeos', 'Rastreabilidade', 'Preço e frete']

export default function SellerDashboard() {
  const addToast = useUiStore((s) => s.addToast)
  const { data: apiListings = [] } = useMyListings()
  const deleteMutation = useDeleteListing()

  const listings = apiListings.length ? apiListings : FEATURED_ANIMALS.slice(0, 5)
  const [localListings, setLocalListings] = useState(null)
  const [openMenu, setOpenMenu] = useState(null)

  const all = localListings ?? listings

  async function handleDelete(id) {
    try {
      await deleteMutation.mutateAsync(id)
      setLocalListings((prev) => (prev ?? all).filter((l) => String(l.id) !== String(id)))
      addToast('Anúncio excluído com sucesso')
    } catch {
      addToast('Erro ao excluir anúncio', 'error')
    }
    setOpenMenu(null)
  }

  async function handlePause(id) {
    const item = (localListings ?? all).find((l) => String(l.id) === String(id))
    const next = item?.status === 'PAUSADO' ? 'ATIVO' : 'PAUSADO'
    try {
      await updateListingStatus(id, next)
      setLocalListings((prev) => (prev ?? all).map((l) => String(l.id) === String(id) ? { ...l, status: next } : l))
      addToast(next === 'PAUSADO' ? 'Anúncio pausado.' : 'Anúncio reativado.', 'info')
    } catch {
      addToast('Erro ao atualizar anúncio.', 'error')
    }
    setOpenMenu(null)
  }

  function handleExport() {
    const rows = [
      ['Especie', 'Quantidade', 'Preco', 'Cidade', 'Estado', 'Status'],
      ...all.map((l) => [l.especie || l.category || '', l.quantidade || l.quantity || '', l.preco_unitario || l.pricePerHead || '', l.cidade || '', l.estado || '', l.status || ''])
    ]
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'meus-anuncios.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  function statusVariant(status) {
    if (!status) return 'paused'
    const s = status.toLowerCase()
    if (s === 'ativo' || s === 'disponível') return 'active'
    if (s === 'proposta' || s === 'aceita') return 'pending'
    return 'paused'
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))]">
      {/* Page header + metrics */}
      <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
        <div className="page-container">
          <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-eyebrow mb-1">Dashboard vendedor</p>
              <h1 className="text-2xl font-black text-[hsl(var(--text))]">Gestão de anúncios e propostas</h1>
              <p className="mt-1 text-sm text-[hsl(var(--muted-fg))]">Acompanhe desempenho dos lotes, documentos e negociações.</p>
            </div>
            <Link to="/criar-anuncio">
              <Button size="md"><Plus size={14} /> Novo anúncio</Button>
            </Link>
          </div>

          {/* Metric cards */}
          <div className="grid grid-cols-2 gap-px border-t border-[hsl(var(--border))] bg-[hsl(var(--border))] lg:grid-cols-4">
            {METRICS.map(([label, value, Icon, sub]) => (
              <div key={label} className="bg-[hsl(var(--surface))] px-5 py-4">
                <div className="flex items-center justify-between">
                  <p className="field-label">{label}</p>
                  <Icon className="text-brand-600" size={14} />
                </div>
                <p className="mt-2 text-2xl font-black text-[hsl(var(--text))]">{value}</p>
                <p className="mt-0.5 text-xs text-[hsl(var(--muted-fg))]">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="page-container py-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          {/* Listings table */}
          <div className="card">
            <div className="panel-header">
              <h2 className="font-bold text-[hsl(var(--text))]">
                Meus anúncios <span className="text-sm font-semibold text-[hsl(var(--muted-fg))]">({all.length})</span>
              </h2>
              <div className="flex gap-2">
                <Link to="/criar-anuncio"><Button size="sm"><Plus size={12} /> Novo</Button></Link>
                <Button size="sm" variant="outline" onClick={handleExport}>Exportar</Button>
              </div>
            </div>

            <div className="hidden grid-cols-[64px_1fr_auto_auto] gap-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-5 py-2 sm:grid">
              <span /><span className="field-label">Lote / Status</span><span className="field-label text-right">Rastreab.</span><span />
            </div>

            <div className="divide-y divide-[hsl(var(--border))]">
              {all.map((a) => (
                <div key={a.id} className="grid items-center gap-4 px-5 py-4 sm:grid-cols-[64px_1fr_auto_auto]">
                  <img alt={a.title} className="h-14 w-14 object-cover rounded-sm" src={a.image} />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-[hsl(var(--text))]">{a.title}</p>
                      <Badge variant={statusVariant(a.status)}>{a.status}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-[hsl(var(--muted-fg))]">
                      {a.location} · {a.quantity?.toLocaleString('pt-BR')} cabeças · {formatCurrency(a.price)}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-black text-brand-600">{a.traceability}%</p>
                    <div className="mt-1.5 h-1.5 w-20 overflow-hidden bg-[hsl(var(--muted))] rounded-full">
                      <div className="h-full bg-brand-600 rounded-full" style={{ width: `${a.traceability}%` }} />
                    </div>
                  </div>
                  <div className="relative flex items-center gap-2">
                    <Link to={`/anuncio/${a.id}`}>
                      <Button size="sm" variant="outline"><Eye size={12} /> Ver</Button>
                    </Link>
                    <div className="relative">
                      <button
                        aria-label="Mais opções"
                        onClick={() => setOpenMenu(openMenu === a.id ? null : a.id)}
                        className="flex h-8 w-8 items-center justify-center text-[hsl(var(--muted-fg))] transition hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--text))] rounded-sm"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openMenu === a.id && (
                        <div className="absolute right-0 top-full z-10 mt-1 min-w-[160px] border border-[hsl(var(--border))] bg-[hsl(var(--surface))] py-1 shadow-card rounded-sm">
                          <button onClick={() => handlePause(a.id)}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-[hsl(var(--text-sub))] hover:bg-[hsl(var(--muted))]">
                            <TrendingUp size={13} /> {a.status === 'PAUSADO' ? 'Reativar' : 'Pausar'}
                          </button>
                          <button onClick={() => handleDelete(a.id)}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50">
                            <Trash2 size={13} /> Remover
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {all.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <PackageCheck size={32} className="mb-3 text-[hsl(var(--border))]" />
                <p className="font-bold text-[hsl(var(--text))]">Nenhum anúncio ainda</p>
                <p className="mt-1 text-sm text-[hsl(var(--muted-fg))]">Publique seu primeiro lote agora.</p>
                <Link to="/criar-anuncio" className="mt-4">
                  <Button size="sm"><Plus size={13} /> Criar anúncio</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Quick CTA */}
            <div className="card border-brand-200 bg-brand-50">
              <div className="flex items-start gap-3 px-4 py-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-brand-600" size={17} />
                <div>
                  <p className="font-bold text-brand-950 text-sm">Publique mais lotes</p>
                  <p className="mt-0.5 text-xs text-brand-700">Vendedores com 3+ lotes ativos recebem 4x mais propostas.</p>
                </div>
              </div>
              <div className="border-t border-brand-200 px-4 py-3">
                <Link to="/criar-anuncio"><Button className="w-full" size="sm"><Plus size={13} /> Criar novo anúncio</Button></Link>
              </div>
            </div>

            {/* Wizard */}
            <div className="card">
              <div className="panel-header">
                <h2 className="flex items-center gap-2 field-label"><FilePlus2 size={13} className="text-brand-600" /> Wizard de cadastro</h2>
              </div>
              <div className="divide-y divide-[hsl(var(--border))]">
                {WIZARD_STEPS.map((step, i) => (
                  <div key={step} className="flex items-center gap-3 px-4 py-3.5">
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center text-xs font-black rounded-sm ${i < 2 ? 'bg-brand-600 text-white' : 'border border-[hsl(var(--border))] text-[hsl(var(--muted-fg))]'}`}>
                      {i + 1}
                    </span>
                    <span className={`text-sm font-semibold ${i < 2 ? 'text-[hsl(var(--text))]' : 'text-[hsl(var(--muted-fg))]'}`}>{step}</span>
                    {i < 2 && <ShieldCheck className="ml-auto text-brand-600" size={13} />}
                  </div>
                ))}
              </div>
              <div className="border-t border-[hsl(var(--border))] p-4">
                <Link to="/criar-anuncio"><Button className="w-full">Continuar cadastro <ArrowRight size={14} /></Button></Link>
              </div>
            </div>

            {/* Funnel */}
            <div className="card">
              <div className="panel-header">
                <h2 className="flex items-center gap-2 field-label"><BarChart3 size={13} className="text-brand-600" /> Funil da semana</h2>
              </div>
              <div className="divide-y divide-[hsl(var(--border))]">
                {FUNNEL.map(([label, value, pct]) => (
                  <div key={label} className="px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[hsl(var(--text-sub))]">{label}</span>
                      <span className="text-sm font-black text-[hsl(var(--text))]">{value}</span>
                    </div>
                    <div className="mt-2 h-1 bg-[hsl(var(--muted))] rounded-full">
                      <div className="h-full bg-brand-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
