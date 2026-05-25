import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Search, ShieldCheck } from 'lucide-react'
import Button from '../ui/Button'
import { CATEGORIES, STATS } from '../../data/mockAnimals'

export default function HeroSection() {
  return (
    <section className="border-b border-slate-200 bg-emerald-950 pt-14">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-[1fr_380px]">
          {/* Left panel: dark emerald */}
          <div className="flex flex-col justify-between px-8 py-14 sm:px-12 lg:px-16">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 border border-emerald-700 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                <ShieldCheck size={13} />
                Marketplace B2B/B2C · animais de produção
              </div>
              <h1 className="max-w-xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">
                Compre e venda genética animal direto da fonte
              </h1>
              <p className="mt-5 max-w-lg text-base leading-7 text-emerald-100/70">
                Conecte fazendas, frigoríficos, granjas e transportadoras em um fluxo transparente com dados de genética, sanidade, nutrição e frete.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/catalogo">
                  <Button size="lg" className="bg-emerald-500 shadow-none hover:bg-emerald-400">
                    Buscar lotes
                    <ArrowRight size={17} />
                  </Button>
                </Link>
                <Link to="/vendedor">
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Anunciar lote
                  </Button>
                </Link>
              </div>
            </div>

            {/* Stats strip */}
            <div className="mt-12 grid grid-cols-2 gap-px bg-emerald-800 sm:grid-cols-4">
              {STATS.map((stat) => (
                <div className="bg-emerald-950 px-4 py-5" key={stat.label}>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-wide text-emerald-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: white */}
          <div className="flex flex-col border-l border-emerald-800 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">Busca por espécie</p>
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  placeholder="Raça, espécie, estado ou produtor"
                  className="h-10 w-full border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15"
                />
              </div>
            </div>

            <div className="flex-1 divide-y divide-slate-100">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/catalogo?cat=${cat.id}`}
                  className="flex items-center justify-between px-5 py-3.5 text-sm transition hover:bg-emerald-50"
                >
                  <span className="font-semibold text-slate-700">{cat.label}</span>
                  <span className="flex items-center gap-2 text-xs text-slate-400">
                    {cat.count.toLocaleString('pt-BR')} anúncios
                    <ArrowRight size={12} />
                  </span>
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 space-y-2.5">
              {[
                ['Rastreabilidade', 'Genética, saúde e nutrição em uma ficha'],
                ['Contrato digital', 'Propostas, aceite e documentos em linha'],
                ['Frete integrado', 'Cotação por rota, capacidade e manejo'],
              ].map(([title, text]) => (
                <div className="flex gap-2.5" key={title}>
                  <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={13} />
                  <p className="text-xs text-slate-600">
                    <span className="font-bold text-slate-800">{title} — </span>
                    {text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
