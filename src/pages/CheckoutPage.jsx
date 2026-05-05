import { Link } from 'react-router-dom'
import { ArrowRight, BadgeDollarSign, CheckCircle2, FileSignature, LockKeyhole, MessageSquare, Truck } from 'lucide-react'
import Button from '../components/ui/Button'
import { FEATURED_ANIMALS } from '../data/mockAnimals'
import { formatCurrency } from '../utils/formatters'

const animal = FEATURED_ANIMALS[0]

export default function CheckoutPage() {
  return (
    <section className="min-h-screen bg-slate-50 pt-24">
      <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="mb-2 text-sm font-bold uppercase tracking-wide text-emerald-600">Checkout e negociação</p>
          <h1 className="max-w-[21rem] text-3xl font-black leading-tight text-emerald-950 sm:max-w-none sm:text-4xl">
            Proposta, contrato e pagamento seguro
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Uma etapa única para formalizar preço, retirada, documentos e condições comerciais.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 flex items-center gap-2 text-xl font-black text-emerald-950">
                <MessageSquare className="text-emerald-700" size={22} />
                Proposta comercial
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-sm font-bold text-slate-700">Valor ofertado</span>
                  <input className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15" defaultValue="R$ 190.000" />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-sm font-bold text-slate-700">Sinal de reserva</span>
                  <input className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15" defaultValue="10%" />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-sm font-bold text-slate-700">Retirada desejada</span>
                  <input className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15" type="date" />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-sm font-bold text-slate-700">Modalidade de frete</span>
                  <select className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15">
                    <option>Transportadora parceira AgroPlace</option>
                    <option>Frete próprio do comprador</option>
                    <option>Retirada pelo vendedor</option>
                  </select>
                </label>
              </div>
              <label className="mt-4 grid gap-1.5">
                <span className="text-sm font-bold text-slate-700">Mensagem ao vendedor</span>
                <textarea
                  className="min-h-28 rounded-lg border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                  defaultValue="Tenho interesse no lote completo. Gostaria de confirmar protocolo sanitário e janela de embarque."
                />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                [BadgeDollarSign, 'Pagamento seguro', 'Sinal retido até aceite e documentação validada.'],
                [FileSignature, 'Contrato digital', 'Cláusulas de entrega, sanidade e responsabilidade.'],
                [Truck, 'Frete vinculado', 'Cotação conectada à proposta aprovada.'],
              ].map(([Icon, title, text]) => (
                <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={title}>
                  <Icon className="text-emerald-700" size={23} />
                  <h3 className="mt-4 font-black text-emerald-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5">
            <h2 className="text-xl font-black text-emerald-950">Resumo do lote</h2>
            <div className="mt-4 overflow-hidden rounded-lg border border-slate-200">
              <img alt={animal.title} className="h-44 w-full object-cover" src={animal.image} />
              <div className="p-4">
                <p className="font-black text-emerald-950">{animal.title}</p>
                <p className="mt-1 text-sm text-slate-500">{animal.quantity} cabeças · {animal.location}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
              {[
                ['Preço anunciado', formatCurrency(animal.price)],
                ['Oferta inicial', 'R$ 190.000'],
                ['Sinal estimado', 'R$ 19.000'],
                ['Frete estimado', 'R$ 8.400'],
              ].map(([label, value]) => (
                <div className="flex items-center justify-between border-b border-slate-100 pb-3" key={label}>
                  <span className="text-slate-500">{label}</span>
                  <span className="font-black text-slate-800">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-900">
              <p className="flex items-center gap-2 font-black">
                <LockKeyhole size={16} />
                Ambiente seguro
              </p>
              <p className="mt-1 leading-6 text-emerald-800">A proposta só vira contrato após aceite das duas partes.</p>
            </div>

            <Button className="mt-5 h-12 w-full text-base">
              Enviar proposta
              <ArrowRight size={18} />
            </Button>
            <Link className="mt-3 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-700" to={`/anuncio/${animal.id}`}>
              <CheckCircle2 size={16} />
              Revisar anúncio
            </Link>
          </aside>
        </div>
      </div>
    </section>
  )
}
