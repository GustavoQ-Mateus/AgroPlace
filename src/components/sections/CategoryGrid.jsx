import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES } from '../../data/mockAnimals'

export default function CategoryGrid() {
  return (
    <section className="border-b border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="section-label mb-1">Cobertura de mercado</p>
            <h2 className="text-2xl font-black text-emerald-950">Espécies disponíveis no marketplace</h2>
          </div>
          <Link
            to="/catalogo"
            className="flex items-center gap-1.5 text-sm font-bold text-emerald-600 transition hover:text-emerald-800"
          >
            Ver catálogo completo
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="border border-slate-200">
          {/* Table header */}
          <div className="hidden grid-cols-[2fr_3fr_1fr_1fr_1fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 sm:grid">
            <span className="prop-label">Espécie</span>
            <span className="prop-label">Descrição</span>
            <span className="prop-label">Anúncios</span>
            <span className="prop-label">Mercado</span>
            <span className="prop-label">Cobertura</span>
            <span />
          </div>

          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="grid gap-3 border-b border-slate-100 px-5 py-4 last:border-0 sm:grid-cols-[2fr_3fr_1fr_1fr_1fr_auto] sm:items-center"
            >
              <div>
                <p className="font-bold text-emerald-950">{cat.label}</p>
                <p className="mt-0.5 text-xs text-slate-400 sm:hidden">{cat.description}</p>
              </div>
              <p className="hidden text-sm text-slate-600 sm:block">{cat.description}</p>
              <div>
                <p className="text-sm font-bold text-slate-800">{cat.count.toLocaleString('pt-BR')}</p>
                <p className="text-[11px] text-slate-400 sm:hidden">anúncios</p>
              </div>
              <p className="hidden text-sm font-bold text-slate-800 sm:block">{cat.stats[1]}</p>
              <p className="hidden text-sm font-bold text-slate-800 sm:block">{cat.stats[2]}</p>
              <Link
                to={`/catalogo?cat=${cat.id}`}
                className="flex items-center gap-1.5 whitespace-nowrap text-sm font-bold text-emerald-600 transition hover:text-emerald-800"
              >
                Ver lotes
                <ArrowRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
