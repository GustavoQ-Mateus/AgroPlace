import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Dna, FileCheck2, Heart, HeartPulse, MapPin, MessageSquare, ShieldCheck, Star, Truck, Wheat } from 'lucide-react'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { formatCurrency } from '../lib/utils'
import { useToggleFavorite, useFavorites } from '../hooks/useFavorites'
import { useAuthStore } from '../stores/authStore'
import { useUiStore } from '../stores/uiStore'
import { useAnimal, useAnimals } from '../hooks/useAnimals'
import MessageModal from '../components/MessageModal'

const TRACE = [
  { icon: Dna,       title: 'Genética',  items: ['Origem controlada', 'Histórico de cruzamento', 'Peso médio auditado'] },
  { icon: HeartPulse,title: 'Sanidade',  items: ['Vacinação em dia', 'GTA disponível', 'Sem restrições sanitárias'] },
  { icon: Wheat,     title: 'Nutrição',  items: ['Manejo alimentar informado', 'Suplementação registrada', 'Último protocolo visível'] },
]

export default function ListingPage() {
  const { id } = useParams()
  const user = useAuthStore((s) => s.user)
  const addToast = useUiStore((s) => s.addToast)
  const { data: favs = [] } = useFavorites()
  const toggle = useToggleFavorite()
  const [photo, setPhoto] = useState(0)
  const [showMsg, setShowMsg] = useState(false)

  const { data: animal, isLoading, isError } = useAnimal(id)
  const { data: related = [] } = useAnimals(
    animal?.category ? { category: animal.category, limit: 4 } : {},
  )
  const relatedFiltered = related.filter((a) => String(a.id) !== String(id)).slice(0, 3)

  if (isLoading) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="text-sm text-[hsl(var(--muted-fg))]">Carregando anúncio…</p>
    </div>
  )

  if (isError || !animal) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="text-lg font-bold text-[hsl(var(--text))]">Anúncio não encontrado</p>
      <Link to="/catalogo" className="text-sm font-semibold text-brand-600 hover:underline">← Voltar ao catálogo</Link>
    </div>
  )

  const photos = animal.fotos?.length ? animal.fotos : [animal.image].filter(Boolean)
  const isFav = favs.includes(animal.id)

  return (
    <div className="bg-[hsl(var(--bg))]">
      {/* Mobile sticky bottom CTA */}
      <div className="fixed bottom-0 inset-x-0 z-40 flex items-center gap-3 border-t border-[hsl(var(--border))] bg-[hsl(var(--surface))] px-4 py-3 lg:hidden">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-[hsl(var(--muted-fg))] uppercase tracking-wide font-semibold">Preço total</p>
          <p className="text-lg font-black text-brand-600 leading-tight">{formatCurrency(animal.price)}</p>
        </div>
        <Link to={`/checkout/${animal.id}`}>
          <Button size="md">Fazer proposta <ArrowRight size={14} /></Button>
        </Link>
      </div>

      <div className="page-container py-6 pb-24 lg:pb-6">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-xs text-[hsl(var(--muted-fg))]">
          <Link to="/" className="hover:text-brand-600">Início</Link>
          <span>/</span>
          <Link to="/catalogo" className="hover:text-brand-600">Catálogo</Link>
          <span>/</span>
          <span className="text-[hsl(var(--text))] font-medium">{animal.title}</span>
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          {/* Left: gallery + details */}
          <div className="space-y-5">
            {/* Gallery */}
            <div className="card overflow-hidden">
              <div className="relative">
                <img src={photos[photo] ?? '/assets/hero-farm.jpg'} alt={animal.title} className="w-full h-72 object-cover sm:h-96" />
                {photos.length > 1 && (
                  <>
                    <button onClick={() => setPhoto((p) => (p - 1 + photos.length) % photos.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center bg-[hsl(var(--surface)/0.9)] shadow-sm rounded-sm">
                      <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => setPhoto((p) => (p + 1) % photos.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center bg-[hsl(var(--surface)/0.9)] shadow-sm rounded-sm">
                      <ChevronRight size={18} />
                    </button>
                  </>
                )}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {photos.map((_, i) => (
                    <button key={i} onClick={() => setPhoto(i)}
                      className={`h-2 rounded-full transition-all ${i === photo ? 'w-5 bg-white' : 'w-2 bg-white/50'}`} />
                  ))}
                </div>
                {animal.status && (
                  <div className="absolute top-3 left-3">
                    <Badge variant={animal.status === 'Disponível' || animal.status === 'ATIVO' ? 'active' : 'pending'}>{animal.status}</Badge>
                  </div>
                )}
              </div>
              {photos.length > 1 && (
                <div className="flex gap-2 p-3">
                  {photos.map((p, i) => (
                    <button key={i} onClick={() => setPhoto(i)}
                      className={`h-16 w-20 overflow-hidden rounded-sm border-2 transition ${i === photo ? 'border-brand-500' : 'border-transparent'}`}>
                      <img src={p} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Animal info */}
            <div className="card">
              <div className="panel-header">
                <h2 className="font-bold text-[hsl(var(--text))]">Dados do lote</h2>
                {animal.sellerVerified && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-brand-700">
                    <ShieldCheck size={13} /> Produtor verificado
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-px bg-[hsl(var(--border))] sm:grid-cols-3">
                {[
                  ['Espécie', animal.category || animal.especie],
                  ['Raça', animal.breed || animal.raca],
                  ['Quantidade', `${animal.quantity || animal.quantidade} cabeças`],
                  (animal.weight || animal.peso_medio) && ['Peso médio', `${animal.weight || animal.peso_medio} kg`],
                  (animal.pricePerHead || animal.preco_unitario) && ['Preço/cabeça', formatCurrency(animal.pricePerHead || animal.preco_unitario)],
                  animal.pricePerArroba && ['Preço/@', formatCurrency(animal.pricePerArroba)],
                  ['Localização', animal.location || [animal.cidade, animal.estado].filter(Boolean).join(', ')],
                  animal.traceability && ['Rastreabilidade', `${animal.traceability}%`],
                  animal.daysListed !== undefined && ['Anunciado há', `${animal.daysListed} dias`],
                ].filter(Boolean).map(([label, value]) => (
                  <div key={label} className="bg-[hsl(var(--surface))] px-4 py-3">
                    <p className="field-label mb-0.5">{label}</p>
                    <p className="text-sm font-bold text-[hsl(var(--text))]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            {animal.tags?.length > 0 && (
              <div className="card px-5 py-4">
                <p className="field-label mb-3">Certificações e documentos</p>
                <div className="flex flex-wrap gap-2">
                  {animal.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1.5 rounded-sm border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
                      <CheckCircle2 size={11} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Traceability */}
            {animal.traceability && (
              <div className="card">
                <div className="panel-header">
                  <h2 className="font-bold text-[hsl(var(--text))]">Rastreabilidade</h2>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 overflow-hidden bg-[hsl(var(--border))] rounded-full">
                      <div className="h-full bg-brand-600 rounded-full" style={{ width: `${animal.traceability}%` }} />
                    </div>
                    <span className="text-sm font-black text-brand-600">{animal.traceability}%</span>
                  </div>
                </div>
                <div className="grid gap-px bg-[hsl(var(--border))] sm:grid-cols-3">
                  {TRACE.map(({ icon: Icon, title, items }) => (
                    <div key={title} className="bg-[hsl(var(--surface))] p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <Icon size={15} className="text-brand-600" />
                        <p className="text-sm font-bold text-[hsl(var(--text))]">{title}</p>
                      </div>
                      <ul className="space-y-1.5">
                        {items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-xs text-[hsl(var(--text-sub))]">
                            <CheckCircle2 size={11} className="text-brand-500 shrink-0" /> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related */}
            {relatedFiltered.length > 0 && (
              <div>
                <p className="field-label mb-3">Lotes relacionados</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {relatedFiltered.map((a) => (
                    <Link key={a.id} to={`/anuncio/${a.id}`} className="group card card-hover overflow-hidden block">
                      <div className="relative h-28 overflow-hidden">
                        <img src={a.image ?? '/assets/hero-farm.jpg'} alt={a.title} className="h-full w-full object-cover transition group-hover:scale-105 duration-300" />
                      </div>
                      <div className="p-3">
                        <p className="text-sm font-bold text-[hsl(var(--text))] line-clamp-1">{a.title}</p>
                        <p className="mt-1 text-xs font-black text-brand-600">{formatCurrency(a.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: CTA sidebar */}
          <aside className="h-fit space-y-4">
            <div className="card">
              <div className="p-5">
                <p className="section-eyebrow mb-1">Preço total</p>
                <p className="text-3xl font-black text-brand-600">{formatCurrency(animal.price)}</p>
                <p className="mt-0.5 text-sm text-[hsl(var(--muted-fg))]">
                  {animal.quantity || animal.quantidade} cabeças · {animal.location || [animal.cidade, animal.estado].filter(Boolean).join(', ')}
                </p>

                {animal.rating && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-[hsl(var(--muted-fg))]">
                    <Star size={12} className="text-accent-500 fill-accent-500" />
                    <span>{animal.rating} · {animal.reviews} avaliações</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 border-t border-[hsl(var(--border))] p-4">
                <Link to={`/checkout/${animal.id}`}>
                  <Button className="w-full" size="lg">
                    Fazer proposta <ArrowRight size={15} />
                  </Button>
                </Link>
                <Button variant="outline" className="w-full" size="md"
                  onClick={() => {
                    if (!user) { addToast('Faça login para enviar mensagem.', 'info'); return }
                    setShowMsg(true)
                  }}>
                  <MessageSquare size={15} /> Mensagem ao produtor
                </Button>
                {user && (
                  <Button variant="ghost" className="w-full" size="md"
                    onClick={() => toggle.mutate(animal.id)}>
                    <Heart size={15} className={isFav ? 'fill-red-500 text-red-500' : ''} />
                    {isFav ? 'Salvo' : 'Salvar lote'}
                  </Button>
                )}
              </div>

              <div className="border-t border-[hsl(var(--border))] p-4 space-y-2">
                {[
                  [ShieldCheck, 'Documentação verificada'],
                  [FileCheck2,  'Contrato digital disponível'],
                  [Truck,       'Frete integrado à proposta'],
                ].map(([Icon, text]) => (
                  <div key={text} className="flex items-center gap-2 text-xs font-medium text-[hsl(var(--text-sub))]">
                    <Icon size={13} className="text-brand-600 shrink-0" /> {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Seller card */}
            <div className="card p-4">
              <p className="field-label mb-3">Produtor</p>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 text-base font-black text-white">
                  {(animal.seller || animal.vendedor_nome || 'P')[0]}
                </div>
                <div>
                  <p className="font-bold text-[hsl(var(--text))]">{animal.seller || animal.vendedor_nome}</p>
                  {animal.sellerVerified && (
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-brand-600">
                      <ShieldCheck size={10} /> Verificado
                    </span>
                  )}
                </div>
              </div>
              {animal.rating && (
                <div className="mt-3 flex items-center gap-1 text-xs text-[hsl(var(--muted-fg))]">
                  <Star size={11} className="text-accent-500 fill-accent-500" />
                  <span>{animal.rating} ({animal.reviews} avaliações)</span>
                </div>
              )}
              <div className="mt-3 flex items-center gap-1.5 text-xs text-[hsl(var(--muted-fg))]">
                <MapPin size={11} /> {animal.location || [animal.cidade, animal.estado].filter(Boolean).join(', ')}
              </div>
            </div>
          </aside>
        </div>
      </div>
      {showMsg && animal && (
        <MessageModal
          anuncio={{ id: animal.id, title: animal.title }}
          sellerId={animal.seller_id}
          onClose={() => setShowMsg(false)}
        />
      )}
    </div>
  )
}
