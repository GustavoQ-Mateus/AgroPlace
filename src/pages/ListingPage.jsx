import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Dna,
  FileCheck2,
  HeartPulse,
  MessageSquare,
  ShieldCheck,
  Truck,
  Wheat,
} from 'lucide-react'
import Button from '../components/ui/Button'
import MessageModal from '../components/MessageModal'
import { FEATURED_ANIMALS } from '../data/mockAnimals'
import { formatCurrency } from '../utils/formatters'
import { useApp } from '../context/AppContext'

const traceSections = [
  {
    icon: Dna,
    title: 'Genética',
    items: ['Origem controlada', 'Histórico de cruzamento', 'Peso médio auditado'],
  },
  {
    icon: HeartPulse,
    title: 'Sanidade',
    items: ['Vacinação em dia', 'GTA disponível', 'Sem restrições sanitárias'],
  },
  {
    icon: Wheat,
    title: 'Nutrição',
    items: ['Manejo alimentar informado', 'Suplementação registrada', 'Último protocolo visível'],
  },
]

function useViewers() {
  const [count] = useState(() => 2 + Math.floor(Math.random() * 8))
  return count
}

export default function ListingPage() {
  const { id } = useParams()
  const { savedAnimals, toggleSave, user, addToast } = useApp()
  const [showMessage, setShowMessage] = useState(false)
  const [activePhoto, setActivePhoto] = useState(0)
  const viewers = useViewers()
  const animal = FEATURED_ANIMALS.find((item) => String(item.id) === String(id))
  if (!animal) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-zinc-800">Anúncio não encontrado</h1>
      <Link to="/catalogo" className="text-emerald-600 hover:underline">← Voltar ao catálogo</Link>
    </div>
  )
  const related = FEATURED_ANIMALS.filter((item) => item.id !== animal.id && item.category === animal.category).slice(0, 3)
  const isSaved = savedAnimals.has(animal.id)

  return (
    <section className="min-h-screen bg-slate-50 pt-14">
      {/* Breadcrumb strip */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <Link className="hover:text-emerald-700" to="/catalogo">Catálogo</Link>
            <span className="text-slate-300">/</span>
            <span className="text-emerald-800 truncate">{animal.title}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Left column */}
          <div className="space-y-6">
            {/* Gallery */}
            <div className="border border-slate-200 bg-white">
              <div className="relative h-[360px] bg-slate-200 sm:h-[460px]">
                <img
                  alt={animal.title}
                  className="h-full w-full object-cover"
                  src={[animal.image, animal.image, animal.image][activePhoto] || animal.image}
                />
                {/* Viewer badge */}
                <div className="absolute left-3 top-3 flex items-center gap-1.5 border border-white/30 bg-black/50 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  {viewers} pessoas visualizando agora
                </div>
              </div>
              <div className="grid grid-cols-3 gap-px border-t border-slate-200 bg-slate-200">
                {[animal.image, animal.image, animal.image].map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActivePhoto(index)}
                    className={`relative h-20 w-full overflow-hidden transition ${activePhoto === index ? 'ring-2 ring-emerald-600 ring-inset' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <img
                      alt={`${animal.title} ${index + 1}`}
                      className="h-full w-full bg-slate-200 object-cover"
                      src={img}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Rastreabilidade */}
            <div className="border border-slate-200 bg-white">
              <div className="panel-header">
                <h2 className="text-sm font-black text-emerald-950">Rastreabilidade do lote</h2>
              </div>
              <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {traceSections.map((section) => (
                  <div key={section.title} className="px-5 py-5">
                    <div className="mb-3 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center border border-slate-200 bg-slate-50 text-emerald-700">
                        <section.icon size={16} />
                      </div>
                      <h3 className="font-black text-emerald-950">{section.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {section.items.map((item) => (
                        <li className="flex gap-2 text-sm leading-5 text-slate-600" key={item}>
                          <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={13} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Localização */}
            <div className="border border-slate-200 bg-white">
              <div className="panel-header">
                <h2 className="text-sm font-black text-emerald-950">Localização e retirada</h2>
              </div>
              <div className="grid gap-0 sm:grid-cols-[1fr_240px] sm:divide-x divide-slate-200">
                <div className="flex min-h-48 items-center justify-center bg-[linear-gradient(135deg,#ecfdf5_25%,#f8fafc_25%,#f8fafc_50%,#ecfdf5_50%,#ecfdf5_75%,#f8fafc_75%)] bg-[length:24px_24px]">
                  <div className="border border-slate-200 bg-white px-5 py-4 text-center shadow-sm">
                    <p className="font-black text-emerald-950">{animal.location}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">Raio logístico sugerido: 420 km</p>
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {[
                    ['Janela de retirada', '7 a 12 de maio'],
                    ['Frete estimado', 'R$ 8.400 a R$ 10.200'],
                    ['Manejo embarque', 'Curral coberto e balança'],
                  ].map(([label, value]) => (
                    <div className="px-5 py-4" key={label}>
                      <p className="prop-label mb-1">{label}</p>
                      <p className="text-sm font-bold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <aside className="space-y-4">
            {/* Price panel */}
            <div className="border border-slate-200 bg-white">
              <div className="panel-header">
                <span className="border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700">
                  {animal.status}
                </span>
                <span className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Score {animal.traceability}%
                </span>
              </div>

              <div className="px-5 py-5">
                <h1 className="text-xl font-black leading-tight text-emerald-950">{animal.title}</h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  {animal.breed} · {animal.quantity.toLocaleString('pt-BR')} cabeças · {animal.location}
                </p>

                <div className="mt-5 border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="prop-label mb-1">Valor do lote</p>
                  <p className="text-3xl font-black text-emerald-950">{formatCurrency(animal.price)}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {formatCurrency(animal.pricePerHead)}/cab.
                    {animal.pricePerArroba ? ` · R$ ${animal.pricePerArroba}/@` : ''}
                  </p>
                </div>

                <div className="mt-4 grid gap-2.5">
                  <Link to="/checkout">
                    <Button className="h-11 w-full">
                      Iniciar negociação
                      <ArrowRight size={16} />
                    </Button>
                  </Link>
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="h-10 w-full" variant="outline" onClick={() => {
                      if (!user) { addToast('Faça login para enviar mensagens.', 'info'); return }
                      setShowMessage(true)
                    }}>
                      <MessageSquare size={15} />
                      Mensagem
                    </Button>
                    <Button
                      className="h-10 w-full"
                      variant={isSaved ? 'outline' : 'ghost'}
                      onClick={() => toggleSave(animal.id)}
                    >
                      {isSaved ? <BookmarkCheck size={15} className="text-emerald-600" /> : <Bookmark size={15} />}
                      {isSaved ? 'Salvo' : 'Salvar'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Features panel */}
            <div className="border border-slate-200 bg-white">
              <div className="panel-header">
                <h2 className="text-xs font-bold uppercase tracking-wide text-slate-600">Recursos incluídos</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  [ClipboardList, 'Ficha completa', 'Dados de lote, peso, raça e manejo.'],
                  [FileCheck2, 'Documentos', 'GTA, notas e certificados anexáveis.'],
                  [Truck, 'Logística', 'Frete próprio ou transportadora parceira.'],
                  [CalendarDays, 'Visita', 'Agenda de visita e vídeo chamada.'],
                ].map(([Icon, title, text]) => (
                  <div className="flex gap-3 px-5 py-3.5" key={title}>
                    <Icon className="mt-0.5 shrink-0 text-emerald-700" size={16} />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{title}</p>
                      <p className="text-xs leading-5 text-slate-500">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {showMessage && (
          <MessageModal
            anuncio={animal}
            sellerId={animal.seller || 'unknown'}
            onClose={() => setShowMessage(false)}
          />
        )}

        {/* Related listings */}
        {related.length > 0 && (
          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-emerald-950">Lotes relacionados</h2>
            </div>
            <div className="border border-slate-200 bg-white divide-y divide-slate-100">
              {related.map((item) => (
                <Link
                  className="flex items-center justify-between px-5 py-4 transition hover:bg-slate-50"
                  key={item.id}
                  to={`/anuncio/${item.id}`}
                >
                  <div className="flex items-center gap-4">
                    <img
                      alt={item.title}
                      className="h-12 w-12 bg-slate-200 object-cover"
                      src={item.image}
                    />
                    <div>
                      <p className="font-bold text-emerald-950">{item.title}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{item.location} · {item.quantity.toLocaleString('pt-BR')} cabeças</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-950">{formatCurrency(item.price)}</p>
                    <p className="text-xs text-slate-400">{formatCurrency(item.pricePerHead)}/cab.</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
