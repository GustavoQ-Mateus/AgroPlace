import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, BadgeDollarSign, CheckCircle2, FileSignature, LockKeyhole, MessageSquare, PenLine, Truck } from 'lucide-react'
import Button from '../components/ui/Button'
import { FieldGroup } from '../components/ui/Input'
import { formatCurrency } from '../lib/utils'
import { useUiStore } from '../stores/uiStore'
import { sendProposal as sendProposalAPI } from '../services/proposalsService'
import { useAnimal } from '../hooks/useAnimals'

export default function CheckoutPage() {
  const { id } = useParams()
  const addToast = useUiStore((s) => s.addToast)
  const { data: animal, isLoading, isError } = useAnimal(id)

  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [signed, setSigned] = useState(false)
  const [signName, setSignName] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    price: '',
    signal: '10%',
    date: '',
    freight: 'Transportadora parceira AgroPlace',
    message: '',
  })

  function field(k, v) { setForm((f) => ({ ...f, [k]: v })) }

  if (isLoading) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="text-sm text-[hsl(var(--muted-fg))]">Carregando anúncio…</p>
    </div>
  )

  if (isError || !animal) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="text-lg font-bold">Anúncio não encontrado</p>
      <Link to="/catalogo" className="text-sm font-semibold text-brand-600 hover:underline">← Voltar ao catálogo</Link>
    </div>
  )

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.date) { addToast('Informe a data de retirada desejada.', 'error'); return }
    setLoading(true)
    try {
      await sendProposalAPI({
        anuncio_id: animal.id,
        seller_id: animal.seller_id,
        price_offered: +(form.price.replace(/[^\d]/g, '') || 0),
        signal_pct: +(form.signal.replace('%', '') || 10),
        withdrawal_date: form.date,
        freight_mode: form.freight,
        message: form.message,
      })
    } catch {
      addToast('Erro ao enviar proposta. Tente novamente.', 'error')
      setLoading(false)
      return
    }
    setLoading(false)
    setSubmitted(true)
  }

  const STEPS = [
    { n: 1, label: 'Proposta' },
    { n: 2, label: 'Revisão' },
    { n: 3, label: 'Confirmação' },
  ]

  if (submitted) return (
    <div className="min-h-screen bg-[hsl(var(--bg))] py-12">
      <div className="page-container max-w-lg mx-auto space-y-4">
        <div className="card px-8 py-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center bg-brand-600 rounded-full">
            <CheckCircle2 className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-black text-[hsl(var(--text))]">Proposta enviada!</h2>
          <p className="mt-3 text-sm leading-6 text-[hsl(var(--text-sub))]">
            Sua proposta de <strong>{form.price}</strong> para <strong>{animal.title}</strong> foi enviada. Você será notificado em até 24h.
          </p>
          <div className="mt-6 divide-y divide-[hsl(var(--border))] border border-[hsl(var(--border))] text-left rounded-sm">
            {[
              ['Lote', animal.title],
              ['Valor proposto', form.price],
              ['Sinal de reserva', form.signal],
              ['Retirada desejada', form.date || '—'],
              ['Frete', form.freight],
              ['Status', signed ? 'Contrato assinado' : 'Aguardando resposta do vendedor'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between px-4 py-3">
                <span className="field-label">{label}</span>
                <span className={`text-sm font-semibold ${label === 'Status' && signed ? 'text-brand-700' : 'text-[hsl(var(--text))]'}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {!signed ? (
          <div className="card">
            <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] px-5 py-4">
              <PenLine className="text-brand-600" size={18} />
              <div>
                <p className="font-bold text-[hsl(var(--text))] text-sm">Assinar contrato digital</p>
                <p className="text-xs text-[hsl(var(--muted-fg))]">Opcional agora — disponível após aceite do vendedor.</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <FieldGroup label="Nome completo para assinatura">
                <input
                  className="field-input"
                  placeholder="Seu nome completo ou razão social"
                  value={signName}
                  onChange={(e) => setSignName(e.target.value)}
                />
              </FieldGroup>
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" className="mt-0.5 h-4 w-4 accent-brand-600" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
                <span className="text-sm leading-5 text-[hsl(var(--text-sub))]">
                  Li e aceito os <span className="font-semibold text-brand-700">termos do contrato</span> de compra e venda.
                </span>
              </label>
              <Button className="w-full" disabled={!signName.trim() || !acceptTerms} onClick={() => setSigned(true)}>
                <PenLine size={15} /> Assinar contrato digitalmente
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 border border-brand-200 bg-brand-50 px-5 py-4 rounded-sm">
            <CheckCircle2 className="shrink-0 text-brand-600" size={20} />
            <div>
              <p className="font-bold text-brand-950 text-sm">Contrato assinado digitalmente</p>
              <p className="text-xs text-brand-700">Assinado por: {signName} · {new Date().toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pb-8">
          <Link to="/comprador"><Button className="w-full" size="lg">Acompanhar proposta</Button></Link>
          <Link to="/catalogo"><Button className="w-full" size="lg" variant="outline">Continuar comprando</Button></Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))]">
      <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
        <div className="page-container py-5">
          <p className="section-eyebrow mb-1">Checkout</p>
          <h1 className="text-2xl font-black text-[hsl(var(--text))]">Proposta, contrato e pagamento</h1>
          {/* Step indicator */}
          <div className="mt-4 flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex items-center">
                <div className={`flex h-7 w-7 items-center justify-center text-xs font-black rounded-full border-2 transition ${s.n <= step ? 'border-brand-600 bg-brand-600 text-white' : 'border-[hsl(var(--border))] text-[hsl(var(--muted-fg))]'}`}>
                  {s.n < step ? <CheckCircle2 size={14} /> : s.n}
                </div>
                <span className={`ml-2 text-xs font-semibold ${s.n <= step ? 'text-brand-700' : 'text-[hsl(var(--muted-fg))]'}`}>{s.label}</span>
                {i < STEPS.length - 1 && <span className="mx-3 h-px w-8 bg-[hsl(var(--border))]" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="page-container py-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              {/* Proposal form */}
              <div className="card">
                <div className="panel-header">
                  <h2 className="flex items-center gap-2 font-bold text-[hsl(var(--text))]">
                    <MessageSquare className="text-brand-600" size={15} /> Proposta comercial
                  </h2>
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldGroup label="Valor ofertado *">
                      <input className="field-input" value={form.price} onChange={(e) => field('price', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Sinal de reserva">
                      <select className="field-input bg-[hsl(var(--surface))]" value={form.signal} onChange={(e) => field('signal', e.target.value)}>
                        {['5%','10%','15%','20%'].map((v) => <option key={v}>{v}</option>)}
                      </select>
                    </FieldGroup>
                    <FieldGroup label="Retirada desejada *">
                      <input type="date" className="field-input" value={form.date} min={new Date().toISOString().split('T')[0]} onChange={(e) => field('date', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Modalidade de frete">
                      <select className="field-input bg-[hsl(var(--surface))]" value={form.freight} onChange={(e) => field('freight', e.target.value)}>
                        <option>Transportadora parceira AgroPlace</option>
                        <option>Frete próprio do comprador</option>
                        <option>Retirada pelo vendedor</option>
                      </select>
                    </FieldGroup>
                  </div>
                  <FieldGroup label="Mensagem ao vendedor">
                    <textarea className="field-input min-h-24 py-2.5 resize-y" value={form.message} onChange={(e) => field('message', e.target.value)} />
                  </FieldGroup>
                </div>
              </div>

              {/* Guarantees */}
              <div className="card">
                <div className="grid divide-y divide-[hsl(var(--border))] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  {[
                    [BadgeDollarSign, 'Pagamento seguro',  'Sinal retido até aceite e documentação validada.'],
                    [FileSignature,   'Contrato digital',  'Cláusulas de entrega, sanidade e responsabilidade.'],
                    [Truck,           'Frete vinculado',   'Cotação conectada à proposta aprovada.'],
                  ].map(([Icon, title, text]) => (
                    <div className="flex gap-3 px-5 py-4" key={title}>
                      <Icon className="mt-0.5 shrink-0 text-brand-600" size={17} />
                      <div>
                        <p className="font-bold text-[hsl(var(--text))] text-sm">{title}</p>
                        <p className="mt-0.5 text-xs leading-5 text-[hsl(var(--muted-fg))]">{text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary sidebar */}
            <aside className="h-fit card">
              <div className="panel-header">
                <h2 className="font-bold text-[hsl(var(--text))]">Resumo do lote</h2>
              </div>
              <div className="border-b border-[hsl(var(--border))]">
                <img alt={animal.title} className="h-40 w-full object-cover" src={animal.image} />
                <div className="px-4 py-3">
                  <p className="font-bold text-[hsl(var(--text))]">{animal.title}</p>
                  <p className="mt-0.5 text-xs text-[hsl(var(--muted-fg))]">{animal.quantity} cabeças · {animal.location}</p>
                </div>
              </div>
              <div className="divide-y divide-[hsl(var(--border))] px-4">
                {[
                  ['Preço anunciado', formatCurrency(animal.price)],
                  ['Sua oferta', form.price],
                  ['Sinal estimado', form.signal],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between py-3">
                    <span className="text-sm text-[hsl(var(--muted-fg))]">{label}</span>
                    <span className="text-sm font-bold text-[hsl(var(--text))]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[hsl(var(--border))] p-4 space-y-3">
                <div className="flex items-center gap-2 border border-brand-200 bg-brand-50 px-3 py-3 text-sm rounded-sm">
                  <LockKeyhole size={14} className="text-brand-600 shrink-0" />
                  <div>
                    <p className="font-bold text-brand-800 text-xs">Ambiente seguro</p>
                    <p className="text-[11px] leading-4 text-brand-700">A proposta só vira contrato após aceite das duas partes.</p>
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg" loading={loading}>
                  {!loading && 'Enviar proposta'} {!loading && <ArrowRight size={16} />}
                </Button>
                <Link to={`/anuncio/${animal.id}`} className="flex items-center justify-center gap-2 text-sm font-semibold text-[hsl(var(--text-sub))] transition hover:text-brand-700">
                  <CheckCircle2 size={13} /> Revisar anúncio
                </Link>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  )
}
