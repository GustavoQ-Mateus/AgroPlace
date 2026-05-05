import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter, MapPin, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import AnimalCard from '../components/AnimalCard'
import Button from '../components/ui/Button'
import { CATEGORIES, FEATURED_ANIMALS } from '../data/mockAnimals'

const filters = [
  ['Preço', 'Até R$ 200 mil'],
  ['Peso médio', 'Acima de 45 kg'],
  ['Documentação', 'GTA e vacinação'],
  ['Entrega', 'Frete cotado'],
]

export default function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const activeCategory = params.get('cat')
  const animals = activeCategory
    ? FEATURED_ANIMALS.filter((animal) => animal.category === activeCategory)
    : FEATURED_ANIMALS

  function clearCategory() {
    const next = new URLSearchParams(params)
    next.delete('cat')
    setParams(next)
  }

  return (
    <section className="min-h-screen bg-slate-50 pt-24">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-emerald-600">
              <Sparkles size={16} />
              Catálogo de busca
            </p>
            <h1 className="max-w-[21rem] text-3xl font-black leading-tight text-emerald-950 sm:max-w-none sm:text-4xl">
              Marketplace com filtros de compra
            </h1>
            <p className="mt-2 max-w-[21rem] text-sm leading-6 text-slate-600 sm:max-w-2xl">
              Busque por espécie, raça, estado, rastreabilidade, preço e janela logística.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="relative block w-full sm:min-w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                className="h-11 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-500/15"
                placeholder="Nelore, Santa Inês, Chapecó..."
              />
            </label>
            <Button className="w-full sm:w-auto" variant="outline">
              <SlidersHorizontal size={16} />
              Ordenar
            </Button>
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          <button
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${!activeCategory ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200'}`}
            onClick={clearCategory}
          >
            Todas
          </button>
          {CATEGORIES.map((category) => (
            <Link
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-bold transition ${activeCategory === category.id ? 'border-emerald-300 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200'}`}
              key={category.id}
              to={`/catalogo?cat=${category.id}`}
            >
              {category.label}
            </Link>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-950">
                <Filter size={16} />
                Filtros
              </h2>
              {activeCategory && (
                <button className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-700" onClick={clearCategory}>
                  <X size={13} />
                  Limpar
                </button>
              )}
            </div>

            <div className="space-y-5">
              <label className="grid gap-2">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Localização</span>
                <span className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                  <input className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15" placeholder="Estado ou cidade" />
                </span>
              </label>

              {filters.map(([label, value]) => (
                <label className="grid gap-2" key={label}>
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
                  <select className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/15">
                    <option>{value}</option>
                    <option>Sem preferência</option>
                    <option>Somente verificados</option>
                  </select>
                </label>
              ))}
            </div>

            <Button className="mt-6 w-full">Aplicar filtros</Button>
          </aside>

          <div>
            <div className="mb-4 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3">
              <p className="text-sm font-semibold text-slate-700">
                {animals.length} lote{animals.length === 1 ? '' : 's'} encontrado{animals.length === 1 ? '' : 's'}
              </p>
              <p className="text-xs font-medium text-slate-500">Atualizado agora</p>
            </div>

            <motion.div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {animals.map((animal, index) => (
                <AnimalCard animal={animal} index={index} key={animal.id} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
