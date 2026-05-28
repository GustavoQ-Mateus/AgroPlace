import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, BarChart3, CheckCircle2, ClipboardCheck, DollarSign,
  Edit2, Eye, FilePlus2, MoreHorizontal, PackageCheck, Plus,
  ShieldCheck, Trash2, TrendingUp,
} from 'lucide-react'
import Button from '../components/ui/Button'
import { FEATURED_ANIMALS } from '../data/mockAnimals'
import { formatCurrency } from '../utils/formatters'
import { useApp } from '../context/AppContext'
import { deleteListing, updateListingStatus } from '../services/listingsService'

const metrics = [
  ['Receita em propostas', 'R$ 412.000', DollarSign, '+12% vs. mês anterior'],
  ['Lotes ativos', '8', PackageCheck, '3 com proposta aberta'],
  ['Score médio', '93%', ShieldCheck, 'Acima da média da plataforma'],
  ['Documentos pendentes', '3', ClipboardCheck, 'Requer ação'],
]

export default function SellerDashboard() {
  const { listings, addToast } = useApp()
  const [openMenu, setOpenMenu] = useState(null)
  const [localListings, setLocalListings] = useState(null)

  const allListings = localListings !== null
    ? localListings
    : [...listings, ...FEATURED_ANIMALS.slice(0, 5)]

  async function handleDelete(id) {
    try {
      await deleteListing(id)
      setLocalListings((prev) => (prev !== null ? prev : allListings).filter((l) => String(l.id) !== String(id)))
      addToast('Anúncio excluído com sucesso')
    } catch {
      addToast('Erro ao excluir anúncio', 'error')
    }
    setOpenMenu(null)
  }

  async function handlePause(id) {
    const current = (localListings !== null ? localListings : allListings).find((l) => String(l.id) === String(id))
    const newStatus = current?.status === 'PAUSADO' ? 'ATIVO' : 'PAUSADO'
    try {
      await updateListingStatus(id, newStatus)
      setLocalListings((prev) => (prev !== null ? prev : allListings).map((l) =>
        String(l.id) === String(id) ? { ...l, status: newStatus } : l
      ))
      addToast(newStatus === 'PAUSADO' ? 'Anúncio pausado.' : 'Anúncio reativado.', 'info')
    } catch {
      addToast('Erro ao atualizar anúncio.', 'error')
    }
    setOpenMenu(null)
  }

  function handleExport() {
    const rows = [
      ['Especie', 'Quantidade', 'Preco Unitario', 'Cidade', 'Estado', 'Status'],
      ...allListings.map(l => [l.especie || l.category || '', l.quantidade || l.quantity || '', l.preco_unitario || l.pricePerHead || '', l.cidade || '', l.estado || '', l.status || ''])
    ]
    const csv = rows.map(r => r.map(v => '"' + v + '"').join(',')).join('\n')
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'meus-anuncios.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <section className="min-h-screen bg-slate-50 pt-14">
      {/* Page header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-label mb-1">Dashboard vendedor</p>
              <h1 className="text-2xl font-black text-emerald-950 sm:text-3xl">
                Gestão de anúncios e propostas
              </h1>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">
                Acompanhe desempenho dos lotes, documentos, negociações e cadastre animais em etapas.
              </p>
            </div>
            <Link to="/criar-anuncio">
              <Button>
                <Plus size={15} />
                Novo anúncio
              </Button>
            </Link>
          </div>

          {/* Metrics strip */}
          <div className="grid grid-cols-2 gap-px border-t border-slate-200 bg-slate-200 lg:grid-cols-4">
            {metrics.map(([label, value, Icon, sub]) => (
              <div key={label} className="bg-white px-5 py-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
                  <Icon className="text-emerald-600" size={15} />
                </div>
                <p className="mt-2 text-2xl font-black text-emerald-950">{value}</p>
                <p className="mt-0.5 text-xs text-slate-500">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Listings table */}
          <div className="border border-slate-200 bg-white">
            <div className="panel-header">
              <h2 className="font-black text-emerald-950">
                Meus anúncios
                <span className="ml-2 text-sm font-semibold text-slate-400">({allListings.length})</span>
              </h2>
              <div className="flex gap-2">
                <Link to="/criar-anuncio">
                  <Button size="sm">
                    <Plus size={13} />
                    Novo
                  </Button>
                </Link>
                <Button size="sm" variant="outline" onClick={handleExport}>Exportar</Button>
              </div>
            </div>

            {/* Table header */}
            <div className="hidden grid-cols-[72px_1fr_auto_auto] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-2.5 sm:grid">
              <span />
              <span className="prop-label">Lote / Status</span>
              <span className="prop-label text-right">Rastreab.</span>
              <span />
            </div>

            <div className="divide-y divide-slate-100">
              {allListings.map((animal) => (
                <div
                  className="grid items-center gap-4 px-5 py-4 sm:grid-cols-[72px_1fr_auto_auto]"
                  key={animal.id}
                >
                  <img alt={animal.title} className="h-16 w-16 bg-slate-200 object-cover" src={animal.image} />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-bold text-emerald-950">{animal.title}</h3>
                      <span className={`px-2 py-0.5 text-xs font-bold ${
                        animal.status === 'Ativo'
                          ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                          : animal.status === 'Proposta'
                            ? 'border border-amber-200 bg-amber-50 text-amber-700'
                            : 'border border-slate-200 bg-slate-50 text-slate-500'
                      }`}>
                        {animal.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      {animal.location} · {animal.quantity?.toLocaleString('pt-BR')} cabeças · {formatCurrency(animal.price)}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-black text-emerald-700">{animal.traceability}%</p>
                    <div className="mt-1.5 h-1.5 w-20 overflow-hidden bg-slate-100">
                      <div className="h-full bg-emerald-600" style={{ width: `${animal.traceability}%` }} />
                    </div>
                  </div>
                  <div className="relative flex items-center gap-2">
                    <Link to={`/anuncio/${animal.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye size={13} />
                        Ver
                      </Button>
                    </Link>
                    <div className="relative">
                      <button
                        aria-label="Mais opções"
                        className="flex h-8 w-8 items-center justify-center text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        onClick={() => setOpenMenu(openMenu === animal.id ? null : animal.id)}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openMenu === animal.id && (
                        <div className="absolute right-0 top-full z-10 mt-1 min-w-40 border border-slate-200 bg-white py-1 shadow-lg">
                          <button className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                            <Edit2 size={13} /> Editar anúncio
                          </button>
                          <button
                            onClick={() => handlePause(animal.id)}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                          >
                            <TrendingUp size={13} /> Pausar
                          </button>
                          <button
                            onClick={() => handleDelete(animal.id)}
                            className="flex w-full items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={13} /> Remover
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {allListings.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <PackageCheck size={32} className="mb-3 text-slate-300" />
                <p className="font-black text-slate-600">Nenhum anúncio ainda</p>
                <p className="mt-1 text-sm text-slate-500">Publique seu primeiro lote agora.</p>
                <Link to="/criar-anuncio" className="mt-4">
                  <Button size="sm">
                    <Plus size={13} /> Criar anúncio
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Quick action */}
            <div className="border border-emerald-200 bg-emerald-50">
              <div className="flex items-start gap-3 px-5 py-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={18} />
                <div>
                  <p className="font-black text-emerald-950">Publique mais lotes</p>
                  <p className="mt-0.5 text-sm text-emerald-700">Vendedores com 3+ lotes ativos recebem 4x mais propostas.</p>
                </div>
              </div>
              <div className="border-t border-emerald-200 px-5 py-3">
                <Link to="/criar-anuncio">
                  <Button className="w-full" size="sm">
                    <Plus size={13} />
                    Criar novo anúncio
                  </Button>
                </Link>
              </div>
            </div>

            {/* Wizard */}
            <div className="border border-slate-200 bg-white">
              <div className="panel-header">
                <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-600">
                  <FilePlus2 size={14} className="text-emerald-700" />
                  Wizard de cadastro
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {['Dados do lote', 'Fotos e vídeos', 'Rastreabilidade', 'Preço e frete'].map((step, index) => (
                  <div className="flex items-center gap-3 px-4 py-3.5" key={step}>
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center text-xs font-black ${index < 2 ? 'bg-emerald-600 text-white' : 'border border-slate-200 bg-white text-slate-400'}`}>
                      {index + 1}
                    </span>
                    <span className={`text-sm font-semibold ${index < 2 ? 'text-slate-800' : 'text-slate-400'}`}>
                      {step}
                    </span>
                    {index < 2 && <ShieldCheck className="ml-auto text-emerald-600" size={14} />}
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-200 p-4">
                <Link to="/criar-anuncio">
                  <Button className="w-full">
                    Continuar cadastro
                    <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Funnel */}
            <div className="border border-slate-200 bg-white">
              <div className="panel-header">
                <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-600">
                  <BarChart3 size={14} className="text-emerald-700" />
                  Funil da semana
                </h2>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  ['Visualizações', '1.284', 100],
                  ['Propostas recebidas', '23', 78],
                  ['Contratos em aceite', '4', 45],
                  ['Fretes cotados', '11', 60],
                ].map(([label, value, pct]) => (
                  <div className="px-4 py-3" key={label}>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{label}</span>
                      <span className="text-sm font-black text-emerald-950">{value}</span>
                    </div>
                    <div className="mt-2 h-1 bg-slate-100">
                      <div className="h-full bg-emerald-600 transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
