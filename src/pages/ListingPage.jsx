import { Link, useParams } from 'react-router-dom'
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Dna,
  FileCheck2,
  HeartPulse,
  MapPinned,
  MessageSquare,
  ShieldCheck,
  Truck,
  Wheat,
} from 'lucide-react'
import Button from '../components/ui/Button'
import { FEATURED_ANIMALS } from '../data/mockAnimals'
import { formatCurrency } from '../utils/formatters'

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

export default function ListingPage() {
  const { id } = useParams()
  const animal = FEATURED_ANIMALS.find((item) => item.id === id) || FEATURED_ANIMALS[0]
  const related = FEATURED_ANIMALS.filter((item) => item.id !== animal.id && item.category === animal.category).slice(0, 2)

  return (
    <section className="min-h-screen bg-slate-50 pt-24">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
          <Link className="hover:text-emerald-700" to="/catalogo">
            Catálogo
          </Link>
          <span>/</span>
          <span className="text-emerald-800">{animal.title}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
              <div className="h-[360px] bg-slate-200 sm:h-[500px]">
                <img alt={animal.title} className="h-full w-full object-cover" src={animal.image} />
              </div>
              <div className="grid grid-cols-3 gap-2 p-2">
                {[animal.image, animal.image, animal.image].map((image, index) => (
                  <img
                    alt={`${animal.title} ${index + 1}`}
                    className="h-24 rounded-md object-cover"
                    key={`${image}-${index}`}
                    src={image}
                  />
                ))}
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {traceSections.map((section) => (
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={section.title}>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <section.icon size={21} />
                  </div>
                  <h2 className="font-black text-emerald-950">{section.title}</h2>
                  <ul className="mt-3 space-y-2">
                    {section.items.map((item) => (
                      <li className="flex gap-2 text-sm leading-5 text-slate-600" key={item}>
                        <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={15} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="flex items-center gap-2 text-xl font-black text-emerald-950">
                <MapPinned className="text-emerald-700" size={22} />
                Localização e retirada
              </h2>
              <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_280px]">
                <div className="flex min-h-56 items-center justify-center rounded-lg border border-slate-200 bg-[linear-gradient(135deg,#ecfdf5_25%,#f8fafc_25%,#f8fafc_50%,#ecfdf5_50%,#ecfdf5_75%,#f8fafc_75%)] bg-[length:28px_28px]">
                  <div className="rounded-lg bg-white/90 px-5 py-4 text-center shadow-sm backdrop-blur">
                    <p className="font-black text-emerald-950">{animal.location}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">Raio logístico sugerido: 420 km</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    ['Janela de retirada', '7 a 12 de maio'],
                    ['Frete estimado', 'R$ 8.400 a R$ 10.200'],
                    ['Manejo embarque', 'Curral coberto e balança'],
                  ].map(([label, value]) => (
                    <div className="rounded-lg bg-slate-50 p-4" key={label}>
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</p>
                      <p className="mt-1 font-bold text-slate-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-700">
                {animal.status}
              </span>
              <span className="flex items-center gap-1 text-sm font-bold text-slate-700">
                <ShieldCheck size={16} className="text-emerald-600" />
                Score {animal.traceability}%
              </span>
            </div>

            <h1 className="text-3xl font-black leading-tight text-emerald-950">{animal.title}</h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              {animal.breed} · {animal.quantity.toLocaleString('pt-BR')} cabeças · {animal.location}
            </p>

            <div className="mt-6 rounded-lg bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-500">Valor do lote</p>
              <p className="mt-1 text-3xl font-black text-emerald-950">{formatCurrency(animal.price)}</p>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {formatCurrency(animal.pricePerHead)}/cab.
                {animal.pricePerArroba ? ` · R$ ${animal.pricePerArroba}/@` : ''}
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              <Link to="/checkout">
                <Button className="h-12 w-full text-base">
                  Iniciar negociação
                  <ArrowRight size={18} />
                </Button>
              </Link>
              <Button className="h-12 w-full" variant="outline">
                <MessageSquare size={17} />
                Enviar mensagem
              </Button>
            </div>

            <div className="mt-6 space-y-3">
              {[
                [ClipboardList, 'Ficha completa', 'Dados de lote, peso, raça e manejo.'],
                [FileCheck2, 'Documentos', 'GTA, notas e certificados anexáveis.'],
                [Truck, 'Logística', 'Frete próprio ou transportadora parceira.'],
                [CalendarDays, 'Visita', 'Agenda de visita e vídeo chamada.'],
              ].map(([Icon, title, text]) => (
                <div className="flex gap-3 rounded-lg border border-slate-200 p-3" key={title}>
                  <Icon className="mt-0.5 shrink-0 text-emerald-700" size={18} />
                  <div>
                    <p className="text-sm font-black text-slate-800">{title}</p>
                    <p className="text-xs leading-5 text-slate-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-2xl font-black text-emerald-950">Lotes relacionados</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {related.map((item) => (
                <Link className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-200" key={item.id} to={`/anuncio/${item.id}`}>
                  <p className="font-black text-emerald-950">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{formatCurrency(item.price)} · {item.location}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
