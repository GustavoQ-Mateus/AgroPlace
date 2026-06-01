import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight, Filter, MapPin, Search, ShieldCheck, SlidersHorizontal, X } from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { CATEGORIES, FEATURED_ANIMALS } from '../data/mockAnimals'
import { formatCurrency } from '../lib/utils'
import { useToggleFavorite, useFavorites } from '../hooks/useFavorites'
import { useAuthStore } from '../stores/authStore'
import { Heart } from 'lucide-react'

const PRICE_OPTS = [
  { label: 'Qualquer preço',    min: 0,      max: Infinity },
  { label: 'Até R$ 50k',        min: 0,      max: 50000 },
  { label: 'R$ 50k – R$ 150k',  min: 50000,  max: 150000 },
  { label: 'R$ 150k – R$ 300k', min: 150000, max: 300000 },
  { label: 'Acima de R$ 300k',  min: 300000, max: Infinity },
]

const SORT_OPTS = [
  { label: 'Mais recentes',         fn: (a, b) => a.daysListed - b.daysListed },
  { label: 'Menor preço',           fn: (a, b) => a.price - b.price },
  { label: 'Maior preço',           fn: (a, b) => b.price - a.price },
  { label: 'Maior rastreabilidade', fn: (a, b) => b.traceability - a.traceability },
]

const PER_PAGE = 12

function AnimalRow({ animal }) {
  const { data: favs = [] } = useFavorites()
  const toggle = useToggleFavorite()
  const user = useAuthStore((s) => s.user)
  const isFav = favs.includes(animal.id)

  return (
    <div className="group relative card card-hover flex gap-4 p-4 transition">
      <Link to={`/anuncio/${animal.id}`} className="absolute inset-0" aria-label={animal.title} />
      <div className="relative h-[88px] w-[120px] shrink-0 overflow-hidden rounded-sm">
        <img src={animal.image} alt={animal.title} className="h-full w-full object-cover transition group-hover:scale-105 duration-300" />
      </div>
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-bold text-[hsl(var(--text))] leading-snug line-clamp-1">{animal.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[hsl(var(--muted-fg))]">
              <span className="flex items-center gap-1"><MapPin size={11} />{animal.location}</span>
              <span>{animal.quantity} cabeças</span>
              {animal.weight && <span>{animal.weight} kg</span>}
            </div>
          </div>
          {user && (
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle.mutate(animal.id) }}
              className="relative z-10 shrink-0 text-[hsl(var(--muted-fg))] transition hover:text-red-500"
            >
              <Heart size={16} className={isFav ? 'fill-red-500 text-red-500' : ''} />
            </button>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {animal.tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-brand-700 bg-brand-50 border border-brand-200 px-1.5 py-0.5 rounded-sm">
                <ShieldCheck size={9} /> {tag}
              </span>
            ))}
          </div>
          <div className="text-right shrink-0">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[hsl(var(--muted-fg))]">Preço total</p>
            <p className="font-black text-brand-600">{formatCurrency(animal.price)}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CatalogPage() {
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat') || ''
  const q   = params.get('q')  || ''

  const [search, setSearch]   = useState(q)
  const [priceIdx, setPriceIdx] = useState(0)
  const [sortIdx, setSortIdx]   = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [page, setPage] = useState(1)

  const ALL = FEATURED_ANIMALS

  const filtered = useMemo(() => {
    let r = [...ALL]
    if (cat)  r = r.filter((a) => a.category === cat)
    if (q)    r = r.filter((a) => a.title?.toLowerCase().includes(q.toLowerCase()) || a.location?.toLowerCase().includes(q.toLowerCase()) || a.breed?.toLowerCase().includes(q.toLowerCase()))
    const p = PRICE_OPTS[priceIdx]
    r = r.filter((a) => a.price >= p.min && a.price <= p.max)
    return [...r].sort(SORT_OPTS[sortIdx].fn)
  }, [ALL, cat, q, priceIdx, sortIdx])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  function handleSearch(e) {
    e.preventDefault()
    const next = new URLSearchParams(params)
    if (search.trim()) next.set('q', search.trim()); else next.delete('q')
    setParams(next)
    setPage(1)
  }

  function setCat(id) {
    const next = new URLSearchParams(params)
    if (id) next.set('cat', id); else next.delete('cat')
    setParams(next)
    setPage(1)
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))]">
      {/* Top bar */}
      <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
        <div className="page-container py-5">
          <p className="section-eyebrow mb-1">Catálogo</p>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-black text-[hsl(var(--text))]">
                {cat ? CATEGORIES.find((c) => c.id === cat)?.label ?? 'Espécie' : 'Todos os lotes'}
                <span className="ml-2 text-sm font-semibold text-[hsl(var(--muted-fg))]">({filtered.length})</span>
              </h1>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <label className="relative flex-1 sm:w-64">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-fg))]" />
                <input
                  type="search" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Raça, espécie, cidade…"
                  className="field-input pl-9"
                />
              </label>
              <Button type="submit" size="md"><Search size={14} /></Button>
            </form>
          </div>

          {/* Category pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => setCat('')}
              className={`rounded-sm px-3 py-1.5 text-xs font-semibold transition ${!cat ? 'bg-brand-600 text-white' : 'border border-[hsl(var(--border))] text-[hsl(var(--muted-fg))] hover:border-brand-400 hover:text-brand-700'}`}>
              Todos
            </button>
            {CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => setCat(c.id)}
                className={`rounded-sm px-3 py-1.5 text-xs font-semibold transition ${cat === c.id ? 'bg-brand-600 text-white' : 'border border-[hsl(var(--border))] text-[hsl(var(--muted-fg))] hover:border-brand-400 hover:text-brand-700'}`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="page-container py-6">
        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className="hidden w-56 shrink-0 space-y-4 lg:block">
            <div className="card p-4">
              <p className="field-label mb-3 flex items-center gap-1.5"><SlidersHorizontal size={12} /> Filtros</p>

              <div className="space-y-1 mb-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[hsl(var(--muted-fg))] mb-2">Preço</p>
                {PRICE_OPTS.map((opt, i) => (
                  <button key={i} onClick={() => { setPriceIdx(i); setPage(1) }}
                    className={`w-full rounded-sm px-2.5 py-1.5 text-left text-xs font-medium transition ${i === priceIdx ? 'bg-brand-600 text-white' : 'text-[hsl(var(--text-sub))] hover:bg-[hsl(var(--muted))]'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="card p-4">
              <p className="field-label mb-3 flex items-center gap-1.5"><Filter size={12} /> Ordenar</p>
              <div className="space-y-1">
                {SORT_OPTS.map((opt, i) => (
                  <button key={i} onClick={() => { setSortIdx(i); setPage(1) }}
                    className={`w-full rounded-sm px-2.5 py-1.5 text-left text-xs font-medium transition ${i === sortIdx ? 'bg-brand-600 text-white' : 'text-[hsl(var(--text-sub))] hover:bg-[hsl(var(--muted))]'}`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter bar */}
            <div className="mb-4 flex items-center gap-2 lg:hidden">
              <select value={priceIdx} onChange={(e) => { setPriceIdx(+e.target.value); setPage(1) }}
                className="flex-1 field-input text-xs">
                {PRICE_OPTS.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
              </select>
              <select value={sortIdx} onChange={(e) => { setSortIdx(+e.target.value); setPage(1) }}
                className="flex-1 field-input text-xs">
                {SORT_OPTS.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
              </select>
            </div>

            {/* Results */}
            {paginated.length === 0 ? (
              <div className="card flex flex-col items-center justify-center py-16 text-center">
                <p className="font-black text-[hsl(var(--text))]">Nenhum lote encontrado</p>
                <p className="mt-1 text-sm text-[hsl(var(--muted-fg))]">Tente outros filtros ou categorias.</p>
                <button onClick={() => { setPriceIdx(0); setPage(1) }} className="mt-4 text-sm font-semibold text-brand-600 hover:underline">
                  Limpar filtros
                </button>
              </div>
            ) : (
              <>
                {/* 3-column card grid or list (horizontal cards) */}
                <div className="space-y-3">
                  {paginated.map((a) => <AnimalRow key={a.id} animal={a} />)}
                </div>

                {/* Numbered pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex items-center justify-center gap-1">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                      className="flex h-9 w-9 items-center justify-center border border-[hsl(var(--border))] text-[hsl(var(--text-sub))] transition hover:bg-[hsl(var(--muted))] disabled:opacity-30 rounded-sm">
                      <ChevronLeft size={15} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button key={p} onClick={() => setPage(p)}
                        className={`h-9 min-w-[36px] px-2 text-sm font-semibold transition rounded-sm ${p === page ? 'bg-brand-600 text-white' : 'border border-[hsl(var(--border))] text-[hsl(var(--text-sub))] hover:bg-[hsl(var(--muted))]'}`}>
                        {p}
                      </button>
                    ))}
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="flex h-9 w-9 items-center justify-center border border-[hsl(var(--border))] text-[hsl(var(--text-sub))] transition hover:bg-[hsl(var(--muted))] disabled:opacity-30 rounded-sm">
                      <ChevronRight size={15} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
