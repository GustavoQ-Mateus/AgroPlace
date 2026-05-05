import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, ClipboardCheck, DollarSign, FilePlus2, MoreHorizontal, PackageCheck, Plus, ShieldCheck } from 'lucide-react'
import Button from '../components/ui/Button'
import { FEATURED_ANIMALS } from '../data/mockAnimals'
import { formatCurrency } from '../utils/formatters'

const metrics = [
  ['Receita em propostas', 'R$ 412.000', DollarSign],
  ['Lotes ativos', '8', PackageCheck],
  ['Score médio', '93%', ShieldCheck],
  ['Documentos pendentes', '3', ClipboardCheck],
]

export default function SellerDashboard() {
  return (
    <section className="min-h-screen bg-slate-50 pt-24">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-600">Dashboard vendedor</p>
            <h1 className="max-w-[21rem] text-3xl font-black leading-tight text-emerald-950 sm:max-w-none sm:text-4xl">
              Gestão de anúncios e propostas
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Acompanhe desempenho dos lotes, documentos, negociações e cadastre animais em etapas.
            </p>
          </div>
          <Button>
            <Plus size={17} />
            Novo anúncio
          </Button>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map(([label, value, Icon]) => (
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={label}>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                <Icon size={21} />
              </div>
              <p className="text-2xl font-black text-emerald-950">{value}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <h2 className="font-black text-emerald-950">Meus anúncios</h2>
              <Button size="sm" variant="outline">
                Exportar
              </Button>
            </div>
            <div className="divide-y divide-slate-100">
              {FEATURED_ANIMALS.slice(0, 5).map((animal) => (
                <div className="grid gap-4 px-5 py-4 md:grid-cols-[72px_1fr_auto]" key={animal.id}>
                  <img alt={animal.title} className="h-20 w-20 rounded-lg object-cover" src={animal.image} />
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-emerald-950">{animal.title}</h3>
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">{animal.status}</span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{animal.location} · {animal.quantity.toLocaleString('pt-BR')} cabeças · {formatCurrency(animal.price)}</p>
                    <div className="mt-3 h-2 max-w-md overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-emerald-600" style={{ width: `${animal.traceability}%` }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:justify-end">
                    <Link to={`/anuncio/${animal.id}`}>
                      <Button size="sm" variant="outline">
                        Ver
                      </Button>
                    </Link>
                    <button aria-label="Mais opções" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100">
                      <MoreHorizontal size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 font-black text-emerald-950">
                <FilePlus2 className="text-emerald-700" size={20} />
                Wizard de cadastro
              </h2>
              <div className="space-y-3">
                {['Dados do lote', 'Fotos e vídeos', 'Rastreabilidade', 'Preço e frete'].map((step, index) => (
                  <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3" key={step}>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-black ${index < 2 ? 'bg-emerald-600 text-white' : 'bg-white text-slate-500'}`}>
                      {index + 1}
                    </span>
                    <span className="text-sm font-bold text-slate-700">{step}</span>
                  </div>
                ))}
              </div>
              <Button className="mt-5 w-full">
                Continuar rascunho
                <ArrowRight size={16} />
              </Button>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 font-black text-emerald-950">
                <BarChart3 className="text-emerald-700" size={20} />
                Funil da semana
              </h2>
              {[
                ['Visualizações', '1.284'],
                ['Propostas recebidas', '23'],
                ['Contratos em aceite', '4'],
                ['Fretes cotados', '11'],
              ].map(([label, value]) => (
                <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0" key={label}>
                  <span className="text-sm font-semibold text-slate-500">{label}</span>
                  <span className="font-black text-emerald-950">{value}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
