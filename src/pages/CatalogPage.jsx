import { useMemo, useState, lazy, Suspense } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowUpDown, Filter, GitCompareArrows, Map, List, MapPin, Search, X } from 'lucide-react'
import AnimalCard from '../components/AnimalCard'
import Button from '../components/ui/Button'
import { SkeletonList } from '../components/SkeletonCard'
import CompareModal from '../components/CompareModal'
import { CATEGORIES, FEATURED_ANIMALS } from '../data/mockAnimals'
import { useApp } from '../context/AppContext'

const MapaCatalogo = lazy(() => import('../components/MapaCatalogo'))

const PRICE_OPTIONS = [
  { label: 'Qualquer preço',   min: 0,        max: Infinity },
  { label: 'Até R$ 50 mil',    min: 0,        max: 50000 },
  { label: 'R$ 50k – R$ 150k', min: 50000,    max: 150000 },
  { label: 'R$ 150k – R$ 300k',min: 150000,   max: 300000 },
  { label: 'Acima de R$ 300k', min: 300000,   max: Infinity },
]

const WEIGHT_OPTIONS = [
  { label: 'Qualquer peso',   min: 0,   max: Infinity },
  { label: 'Até 30 kg',       min: 0,   max: 30 },
  { label: '30 – 100 kg',     min: 30,  max: 100 },
  { label: '100 – 350 kg',    min: 100, max: 350 },
  { label: 'Acima de 350 kg', min: 350, max: Infinity },
]

const TRACE_OPTIONS = [
  { label: 'Qualquer rastreab.',  min: 0  },
  { label: 'Acima de 50%',       min: 50 },
  { label: 'Acima de 75%',       min: 75 },
  { label: 'Acima de 90%',       min: 90 },
]

const SORT_OPTIONS = [
  { label: 'Mais recentes',          fn: (a, b) => b.daysListed - a.daysListed },
  { label: 'Menor preço',            fn: (a, b) => a.price - b.price },
  { label: 'Maior preço',            fn: (a, b) => b.price - a.price },
  { label: 'Maior rastreabilidade',  fn: (a, b) => b.traceability - a.traceability },
]

export default function CatalogPage() {
  const [params, setParams]     = useSearchParams()
  const { listings }            = useApp()
  const activeCategory          = params.get('cat')
  const searchQuery             = params.get('q') || ''

  const [location, setLocation] = useState('')
  const [priceIdx, setPriceIdx] = useState(0)
  const [weightIdx, setWeightIdx]= useState(0)
  const [traceIdx, setTraceIdx] = useState(0)
  const [sortIdx, setSortIdx]   = useState(0)
  const [sortOpen, setSortOpen] = useState(false)
  const [applied, setApplied]   = useState({ location: '', priceIdx: 0, weightIdx: 0, traceIdx: 0 })
  const [localSearch, setLocalSearch] = useState(searchQuery)
  const [page, setPage] = useState(1)
  const [isFiltering, setIsFiltering] = useState(false)
  const [viewMode, setViewMode] = useState('list') // 'list' | 'map'
  const [compareIds, setCompareIds] = useState(new Set())
  const [showCompare, setShowCompare] = useState(false)
  const PER_PAGE = 12

  function toggleCompare(animal) {
    setCompareIds((prev) => {
      const next = new Set(prev)
      if (next.has(animal.id)) { next.delete(animal.id) }
      else if (next.size < 3) { next.add(animal.id) }
      return next
    })
  }
  const compareAnimals = filtered.filter((a) => compareIds.has(a.id))

  const ALL = useMemo(() => [...listings, ...FEATURED_ANIMALS], [listings])

  const filtered = useMemo(() => {
    let result = ALL

    const q = (params.get('q') || '').toLowerCase()
    if (q) result = result.filter((a) =>
      a.title.toLowerCase().includes(q) ||
      a.breed?.toLowerCase().includes(q) ||
      a.location?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q)
    )

    if (activeCategory) result = result.filter((a) => a.category === activeCategory)

    if (applied.location) {
      const loc = applied.location.toLowerCase()
      result = result.filter((a) => a.location?.toLowerCase().includes(loc))
    }

    const price = PRICE_OPTIONS[applied.priceIdx]
    result = result.filter((a) => a.price >= price.min && a.price <= price.max)

    const weight = WEIGHT_OPTIONS[applied.weightIdx]
    result = result.filter((a) => !a.weight || (a.weight >= weight.min && a.weight <= weight.max))

    const trace = TRACE_OPTIONS[applied.traceIdx]
    result = result.filter((a) => (a.traceability || 0) >= trace.min)

    return [...result].sort(SORT_OPTIONS[sortIdx].fn)
  }, [ALL, params, activeCategory, applied, sortIdx])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function clearCategory() {
    const next = new URLSearchParams(params)
    next.delete('cat')
    setParams(next)
  }

  function clearSearch() {
    const next = new URLSearchParams(params)
    next.delete('q')
    setParams(next)
    setLocalSearch('')
  }

  function handleSearch(e) {
    e.preventDefault()
    const next = new URLSearchParams(params)
    if (localSearch.trim()) next.set('q', localSearch.trim())
    else next.delete('q')
    setParams(next)
  }

  function applyFilters() {
    setIsFiltering(true)
    setTimeout(() => {
      setApplied({ location, priceIdx, weightIdx, traceIdx })
      setPage(1)
      setIsFiltering(false)
    }, 350)
  }

  function clearFilters() {
    setLocation('')
    setPriceIdx(0)
    setWeightIdx(0)
    setTraceIdx(0)
    setApplied({ location: '', priceIdx: 0, weightIdx: 0, traceIdx: 0 })
    setPage(1)
    clearSearch()
    clearCategory()
  }

  const hasActiveFilters = applied.location || applied.priceIdx || applied.weightIdx || applied.traceIdx || activeCategory || searchQuery

  return (
    <section className="min-h-screen bg-slate-50 pt-14">
      {/* Page header strip */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 py-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="section-label mb-1">Catálogo de busca</p>
              <h1 className="text-2xl font-black text-emerald-950 sm:text-3xl">
                Marketplace com filtros de compra
              </h1>
              <p className="mt-1.5 text-sm leading-6 text-slate-600">
                Busque por espécie, raça, estado, rastreabilidade, preço e janela logística.
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {/* View mode toggle */}
              <div className="flex border border-slate-200">
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex h-10 items-center gap-2 px-3 text-sm font-semibold transition ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <List size={14} /> Lista
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`flex h-10 items-center gap-2 px-3 text-sm font-semibold transition ${viewMode === 'map' ? 'bg-emerald-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                  <Map size={14} /> Mapa
                </button>
              </div>
              <form onSubmit={handleSearch} className="relative block w-full sm:min-w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  className="h-10 w-full border border-slate-200 bg-slate-50 pl-9 pr-9 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15"
                  placeholder="Nelore, Santa Inês, Chapecó..."
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                />
                {localSearch && (
                  <button type="button" onClick={() => { setLocalSearch(''); clearSearch() }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X size={13} />
                  </button>
                )}
              </form>

              <div className="relative">
                <Button
                  className="w-full sm:w-auto"
                  variant="outline"
                  onClick={() => setSortOpen((v) => !v)}
                >
                  <ArrowUpDown size={14} />
                  {SORT_OPTIONS[sortIdx].label}
                </Button>
                {sortOpen && (
                  <div className="absolute right-0 top-full z-20 mt-1 min-w-52 border border-slate-200 bg-white py-1 shadow-lg">
                    {SORT_OPTIONS.map((opt, i) => (
                      <button
                        key={opt.label}
                        onClick={() => { setSortIdx(i); setSortOpen(false) }}
                        className={`block w-full px-4 py-2.5 text-left text-sm font-medium transition hover:bg-slate-50 ${i === sortIdx ? 'text-emerald-700 font-bold' : 'text-slate-600'}`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active filters chips */}
          {(searchQuery || activeCategory) && (
            <div className="flex flex-wrap items-center gap-2 pb-3">
              {searchQuery && (
                <span className="flex items-center gap-1.5 border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  Busca: {searchQuery}
                  <button onClick={clearSearch}><X size={11} /></button>
                </span>
              )}
              {activeCategory && (
                <span className="flex items-center gap-1.5 border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  {CATEGORIES.find((c) => c.id === activeCategory)?.label || activeCategory}
                  <button onClick={clearCategory}><X size={11} /></button>
                </span>
              )}
              <button onClick={clearFilters} className="text-xs font-bold text-slate-400 hover:text-slate-700">
                Limpar tudo
              </button>
            </div>
          )}

          {/* Category filter tabs */}
          <div className="flex gap-0 overflow-x-auto border-t border-slate-100">
            <button
              className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-bold transition ${!activeCategory ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
              onClick={clearCategory}
            >
              Todas espécies
            </button>
            {CATEGORIES.map((category) => (
              <Link
                className={`shrink-0 border-b-2 px-4 py-2.5 text-sm font-bold transition ${activeCategory === category.id ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                key={category.id}
                to={`/catalogo?cat=${category.id}`}
              >
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar filters */}
          <aside className="h-fit border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
              <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-600">
                <Filter size={13} />
                Filtros
              </h2>
              {hasActiveFilters && (
                <button
                  className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-700"
                  onClick={clearFilters}
                >
                  <X size={12} />
                  Limpar
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-100">
              <label className="grid gap-2 px-4 py-4">
                <span className="prop-label">Localização</span>
                <span className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                  <input
                    className="h-9 w-full border border-slate-200 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                    placeholder="Estado ou cidade"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </span>
              </label>

              <label className="grid gap-2 px-4 py-4">
                <span className="prop-label">Faixa de preço</span>
                <select
                  className="h-9 border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/15"
                  value={priceIdx}
                  onChange={(e) => setPriceIdx(+e.target.value)}
                >
                  {PRICE_OPTIONS.map((opt, i) => <option key={opt.label} value={i}>{opt.label}</option>)}
                </select>
              </label>

              <label className="grid gap-2 px-4 py-4">
                <span className="prop-label">Peso médio</span>
                <select
                  className="h-9 border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/15"
                  value={weightIdx}
                  onChange={(e) => setWeightIdx(+e.target.value)}
                >
                  {WEIGHT_OPTIONS.map((opt, i) => <option key={opt.label} value={i}>{opt.label}</option>)}
                </select>
              </label>

              <label className="grid gap-2 px-4 py-4">
                <span className="prop-label">Rastreabilidade mínima</span>
                <select
                  className="h-9 border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/15"
                  value={traceIdx}
                  onChange={(e) => setTraceIdx(+e.target.value)}
                >
                  {TRACE_OPTIONS.map((opt, i) => <option key={opt.label} value={i}>{opt.label}</option>)}
                </select>
              </label>
            </div>

            <div className="border-t border-slate-200 p-4">
              <Button className="w-full" onClick={applyFilters}>Aplicar filtros</Button>
            </div>
          </aside>

          {/* Results */}
          <div>
            {/* Result count bar */}
            <div className="mb-4 flex items-center justify-between border border-slate-200 bg-white px-4 py-3">
              <p className="text-sm font-semibold text-slate-700">
                {filtered.length} lote{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
              </p>
              <p className="text-xs font-medium text-slate-400">Atualizado agora</p>
            </div>

            {/* Compare bar */}
            {compareIds.size > 0 && (
              <div className="mb-4 flex items-center justify-between border border-emerald-200 bg-emerald-50 px-4 py-3">
                <p className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                  <GitCompareArrows size={15} />
                  {compareIds.size} lote{compareIds.size > 1 ? 's' : ''} selecionado{compareIds.size > 1 ? 's' : ''} para comparação
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setCompareIds(new Set())} className="text-xs font-semibold text-emerald-600 hover:text-emerald-800">
                    Limpar
                  </button>
                  <Button size="sm" onClick={() => setShowCompare(true)} disabled={compareIds.size < 2}>
                    Comparar agora
                  </Button>
                </div>
              </div>
            )}

            {viewMode === 'map' ? (
              <Suspense fallback={<div className="flex h-96 items-center justify-center border border-slate-200 bg-white text-sm text-slate-400">Carregando mapa…</div>}>
                <MapaCatalogo animals={filtered} />
              </Suspense>
            ) : isFiltering ? (
              <div className="border border-slate-200 bg-white">
                <div className="hidden grid-cols-[56px_1fr_auto_auto_auto_auto] items-center gap-4 border-b border-slate-200 bg-slate-50 px-5 py-2.5 sm:grid">
                  <span /><span className="prop-label">Lote / Produtor</span>
                  <span className="prop-label text-right">Cabeças</span>
                  <span className="prop-label text-right">Rastreab.</span>
                  <span className="prop-label text-right">Preço total</span>
                  <span />
                </div>
                <SkeletonList count={8} />
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-slate-200 bg-white py-16 text-center">
                <Search size={32} className="mb-4 text-slate-300" />
                <p className="font-black text-slate-700">Nenhum lote encontrado</p>
                <p className="mt-1 text-sm text-slate-500">Tente ajustar os filtros ou ampliar a busca.</p>
                <button onClick={clearFilters} className="mt-4 text-sm font-bold text-emerald-700 hover:text-emerald-800">
                  Limpar todos os filtros
                </button>
              </div>
            ) : (
              <div className="border border-slate-200 bg-white">
                <div className="hidden grid-cols-[56px_1fr_auto_auto_auto_auto] items-center gap-4 border-b border-slate-200 bg-slate-50 px-5 py-2.5 sm:grid">
                  <span />
                  <span className="prop-label">Lote / Produtor</span>
                  <span className="prop-label text-right">Cabeças</span>
                  <span className="prop-label text-right">Rastreab.</span>
                  <span className="prop-label text-right">Preço total</span>
                  <span />
                </div>
                <div>
                  {paginated.map((animal, index) => (
                    <AnimalCard
                      animal={animal}
                      index={index}
                      key={animal.id}
                      onCompare={toggleCompare}
                      compareSelected={compareIds.has(animal.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-zinc-200 text-zinc-600 disabled:opacity-40 hover:bg-zinc-50 transition-colors"
                >
                  ← Anterior
                </button>
                <span className="text-sm text-zinc-500">Página {page} de {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-zinc-200 text-zinc-600 disabled:opacity-40 hover:bg-zinc-50 transition-colors"
                >
                  Próximo →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showCompare && compareAnimals.length >= 2 && (
        <CompareModal animals={compareAnimals} onClose={() => setShowCompare(false)} />
      )}
    </section>
  )
}
