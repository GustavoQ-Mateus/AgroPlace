import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, BadgeDollarSign, CheckCircle2, FileSignature, LockKeyhole, MessageSquare, Truck, PenLine } from 'lucide-react'
import Button from '../components/ui/Button'
import { FEATURED_ANIMALS } from '../data/mockAnimals'
import { formatCurrency } from '../utils/formatters'
import { useApp } from '../context/AppContext'
import { sendProposal as sendProposalAPI } from '../services/proposalsService'

export default function CheckoutPage() {
  const { id } = useParams()
  const { sendProposal, user, addToast } = useApp()
  const animal = FEATURED_ANIMALS.find(a => String(a.id) === String(id))
  if (!animal) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold text-zinc-800">Anúncio não encontrado</h1>
      <Link to="/" className="text-emerald-600 hover:underline">← Voltar ao início</Link>
    </div>
  )
  const [submitted, setSubmitted] = useState(false)
  const [signed, setSigned]       = useState(false)
  const [signName, setSignName]   = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [form, setForm]           = useState({
    price: 'R$ 190.000',
    signal: '10%',
    date: '',
    freight: 'Transportadora parceira AgroPlace',
    message: 'Tenho interesse no lote completo. Gostaria de confirmar protocolo sanitário e janela de embarque.',
  })

  function field(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.date) { addToast('Informe a data de retirada desejada.', 'error'); return }
    setLoading(true)
    try {
      // Tenta API real
      await sendProposalAPI({
        anuncio_id:      animal.id,
        seller_id:       animal.seller || 'unknown',
        price_offered:   +(form.price.replace(/\D/g, '') || 0) / 100,
        signal_pct:      +(form.signal.replace('%', '') || 10),
        withdrawal_date: form.date,
        freight_mode:    form.freight,
        message:         form.message,
      })
    } catch {
      // Fallback local
      sendProposal({ animal: animal.title, animalId: animal.id, ...form, buyer: user?.name || 'Visitante' })
    }
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-50 pt-14 px-4">
        <div className="mx-auto w-full max-w-lg space-y-4">
          {/* Confirmação da proposta */}
          <div className="border border-slate-200 bg-white px-8 py-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center bg-emerald-600">
              <CheckCircle2 className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-black text-emerald-950">Proposta enviada!</h2>
            <p className="mt-3 text-slate-600 leading-6">
              Sua proposta de <strong>{form.price}</strong> para{' '}
              <strong>{animal.title}</strong> foi enviada. Você será notificado em até 24h.
            </p>
            <div className="mt-6 divide-y divide-slate-100 border border-slate-200 text-left">
              {[
                ['Lote', animal.title],
                ['Valor proposto', form.price],
                ['Sinal de reserva', form.signal],
                ['Retirada desejada', form.date || '—'],
                ['Frete', form.freight],
                ['Status', signed ? 'Contrato assinado' : 'Aguardando resposta do vendedor'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-400">{label}</span>
                  <span className={`text-sm font-semibold ${label === 'Status' && signed ? 'text-emerald-700' : 'text-slate-800'}`}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assinatura de contrato */}
          {!signed ? (
            <div className="border border-slate-200 bg-white">
              <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-4">
                <PenLine className="text-emerald-700" size={18} />
                <div>
                  <p className="font-black text-emerald-950 text-sm">Assinar contrato digital</p>
                  <p className="text-xs text-slate-500">Opcional agora — disponível após aceite do vendedor.</p>
                </div>
              </div>
              <div className="px-6 py-5 space-y-4">
                <label className="grid gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Nome completo para assinatura</span>
                  <input
                    className="h-10 border border-slate-200 px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15"
                    placeholder="Seu nome completo ou razão social"
                    value={signName}
                    onChange={(e) => setSignName(e.target.value)}
                  />
                </label>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-4 w-4 accent-emerald-600"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                  />
                  <span className="text-sm leading-5 text-slate-600">
                    Li e aceito os{' '}
                    <span className="font-semibold text-emerald-700">termos do contrato</span>{' '}
                    de compra e venda, incluindo as condições de sanidade, transporte e prazo de retirada.
                  </span>
                </label>
                <Button
                  className="w-full"
                  disabled={!signName.trim() || !acceptTerms}
                  onClick={() => setSigned(true)}
                >
                  <PenLine size={15} />
                  Assinar contrato digitalmente
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 border border-emerald-200 bg-emerald-50 px-5 py-4">
              <CheckCircle2 className="shrink-0 text-emerald-600" size={20} />
              <div>
                <p className="font-black text-emerald-950 text-sm">Contrato assinado digitalmente</p>
                <p className="text-xs text-emerald-700">Assinado por: {signName} · {new Date().toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 pb-8">
            <Link to="/comprador">
              <Button className="w-full">Acompanhar proposta</Button>
            </Link>
            <Link to="/catalogo">
              <Button className="w-full" variant="outline">Continuar comprando</Button>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-slate-50 pt-14">
      {/* Page header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <p className="section-label mb-1">Checkout e negociação</p>
            <h1 className="text-2xl font-black text-emerald-950 sm:text-3xl">
              Proposta, contrato e pagamento seguro
            </h1>
            <p className="mt-1.5 text-sm leading-6 text-slate-600">
              Uma etapa única para formalizar preço, retirada, documentos e condições comerciais.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-4">
              {/* Proposal form */}
              <div className="border border-slate-200 bg-white">
                <div className="panel-header">
                  <h2 className="flex items-center gap-2 font-black text-emerald-950">
                    <MessageSquare className="text-emerald-700" size={16} />
                    Proposta comercial
                  </h2>
                </div>
                <div className="px-5 py-5">
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="grid gap-1.5">
                      <span className="prop-label">Valor ofertado *</span>
                      <input
                        className="h-10 border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                        value={form.price}
                        onChange={(e) => field('price', e.target.value)}
                      />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="prop-label">Sinal de reserva</span>
                      <select
                        className="h-10 border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                        value={form.signal}
                        onChange={(e) => field('signal', e.target.value)}
                      >
                        <option>5%</option>
                        <option>10%</option>
                        <option>15%</option>
                        <option>20%</option>
                      </select>
                    </label>
                    <label className="grid gap-1.5">
                      <span className="prop-label">Retirada desejada *</span>
                      <input
                        className="h-10 border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                        type="date"
                        value={form.date}
                        onChange={(e) => field('date', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </label>
                    <label className="grid gap-1.5">
                      <span className="prop-label">Modalidade de frete</span>
                      <select
                        className="h-10 border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                        value={form.freight}
                        onChange={(e) => field('freight', e.target.value)}
                      >
                        <option>Transportadora parceira AgroPlace</option>
                        <option>Frete próprio do comprador</option>
                        <option>Retirada pelo vendedor</option>
                      </select>
                    </label>
                  </div>
                  <label className="mt-4 grid gap-1.5">
                    <span className="prop-label">Mensagem ao vendedor</span>
                    <textarea
                      className="min-h-24 border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                      value={form.message}
                      onChange={(e) => field('message', e.target.value)}
                    />
                  </label>
                </div>
              </div>

              {/* Guarantees strip */}
              <div className="border border-slate-200 bg-white">
                <div className="grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  {[
                    [BadgeDollarSign, 'Pagamento seguro', 'Sinal retido até aceite e documentação validada.'],
                    [FileSignature, 'Contrato digital', 'Cláusulas de entrega, sanidade e responsabilidade.'],
                    [Truck, 'Frete vinculado', 'Cotação conectada à proposta aprovada.'],
                  ].map(([Icon, title, text]) => (
                    <div className="flex gap-3 px-5 py-4" key={title}>
                      <Icon className="mt-0.5 shrink-0 text-emerald-700" size={18} />
                      <div>
                        <h3 className="font-bold text-slate-800">{title}</h3>
                        <p className="mt-0.5 text-sm leading-5 text-slate-500">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary sidebar */}
            <aside className="h-fit border border-slate-200 bg-white">
              <div className="panel-header">
                <h2 className="font-black text-emerald-950">Resumo do lote</h2>
              </div>

              <div className="border-b border-slate-200">
                <img alt={animal.title} className="h-40 w-full bg-slate-200 object-cover" src={animal.image} />
                <div className="px-5 py-4">
                  <p className="font-bold text-emerald-950">{animal.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{animal.quantity} cabeças · {animal.location}</p>
                </div>
              </div>

              <div className="divide-y divide-slate-100 px-5">
                {[
                  ['Preço anunciado', formatCurrency(animal.price)],
                  ['Sua oferta', form.price],
                  ['Sinal estimado', form.signal],
                  ['Frete estimado', 'R$ 8.400'],
                ].map(([label, value]) => (
                  <div className="flex items-center justify-between py-3.5" key={label}>
                    <span className="text-sm text-slate-500">{label}</span>
                    <span className="text-sm font-black text-slate-800">{value}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 px-5 py-4">
                <div className="flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-3 py-3 text-sm">
                  <LockKeyhole size={14} className="text-emerald-700" />
                  <div>
                    <p className="font-bold text-emerald-800">Ambiente seguro</p>
                    <p className="text-xs leading-5 text-emerald-700">A proposta só vira contrato após aceite das duas partes.</p>
                  </div>
                </div>

                <Button type="submit" className="mt-4 h-11 w-full" loading={loading}>
                  Enviar proposta
                  {!loading && <ArrowRight size={16} />}
                </Button>
                <Link
                  className="mt-3 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 transition hover:text-emerald-700"
                  to={`/anuncio/${animal.id}`}
                >
                  <CheckCircle2 size={14} />
                  Revisar anúncio
                </Link>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </section>
  )
}
