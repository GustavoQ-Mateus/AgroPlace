import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Camera, CheckCircle2, Leaf, MapPin, ShieldCheck, Tag } from 'lucide-react'
import Button from '../components/ui/Button'
import { FieldGroup } from '../components/ui/Input'
import { useUiStore } from '../stores/uiStore'
import { createListing } from '../services/listingsService'

const SPECIES = [
  { id: 'bovinos',  label: 'Bovinos'  },
  { id: 'equinos',  label: 'Equinos'  },
  { id: 'suinos',   label: 'Suínos'   },
  { id: 'aves',     label: 'Aves'     },
  { id: 'ovinos',   label: 'Ovinos'   },
  { id: 'caprinos', label: 'Caprinos' },
]

const BREEDS = {
  bovinos:  ['Nelore', 'Angus', 'Girolando', 'Brahman', 'Senepol', 'Tabapuã', 'Guzerá', 'Canchim'],
  equinos:  ['Quarto de Milha', 'Mangalarga Marchador', 'Crioulo', 'Lusitano'],
  suinos:   ['Landrace', 'Large White', 'Duroc', 'Pietrain'],
  aves:     ['Cobb 500', 'Ross 308', 'Hubbard', 'Caipira'],
  ovinos:   ['Santa Inês', 'Dorper', 'Morada Nova', 'Suffolk'],
  caprinos: ['Boer', 'Saanen', 'Anglo Nubiana', 'Toggenburg'],
}

const STATES = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO']

const VACC = [
  ['gta',         'GTA (Guia de Trânsito Animal)'],
  ['brucela',     'Brucelose'],
  ['tuberculose', 'Tuberculose'],
  ['aftosa',      'Aftosa'],
  ['raiva',       'Raiva'],
  ['carbunculo',  'Carbúnculo'],
]

const WIZARD_STEPS = [
  { id: 'especie',         label: 'Espécie e raça',   icon: Leaf },
  { id: 'localizacao',     label: 'Localização',      icon: MapPin },
  { id: 'rastreabilidade', label: 'Rastreabilidade',  icon: ShieldCheck },
  { id: 'fotos',           label: 'Fotos',            icon: Camera },
  { id: 'preco',           label: 'Preço e frete',    icon: Tag },
]

const INITIAL = {
  category: '', breed: '', quantity: '', weightMin: '', weightMax: '', sex: 'Misto', age: '',
  state: '', city: '', farm: '',
  gta: false, brucela: false, tuberculose: false, aftosa: false, raiva: false, carbunculo: false,
  photos: [],
  price: '', pricePerHead: '', freightIncluded: false, freightNote: '', description: '',
}

export default function CreateListingPage() {
  const navigate = useNavigate()
  const addToast = useUiStore((s) => s.addToast)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INITIAL)
  const [loading, setLoading] = useState(false)

  function field(k, v) { setForm((f) => ({ ...f, [k]: v })) }
  function toggle(k) { setForm((f) => ({ ...f, [k]: !f[k] })) }

  async function handleSubmit() {
    setLoading(true)
    try {
      await createListing({
        especie: form.category,
        raca: form.breed,
        quantidade: +form.quantity,
        peso_min: +form.weightMin,
        peso_max: +form.weightMax,
        sexo: form.sex,
        idade: form.age,
        estado: form.state,
        cidade: form.city,
        fazenda: form.farm,
        preco_total: +form.price,
        preco_por_cabeca: +form.pricePerHead,
        frete_incluido: form.freightIncluded,
        descricao: form.description,
        tags: VACC.filter(([k]) => form[k]).map(([, l]) => l),
      })
      addToast('Anúncio publicado com sucesso!')
      navigate('/vendedor')
    } catch {
      addToast('Erro ao criar anúncio. Tente novamente.', 'error')
      setLoading(false)
    }
  }

  const isLast = step === WIZARD_STEPS.length - 1

  function canNext() {
    if (step === 0) return !!form.category && !!form.quantity
    if (step === 1) return !!form.state && !!form.city
    if (step === 4) return !!form.price
    return true
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--bg))]">
      {/* Header */}
      <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--surface))]">
        <div className="page-container py-5">
          <p className="section-eyebrow mb-1">Criar anúncio</p>
          <h1 className="text-2xl font-black text-[hsl(var(--text))]">Novo lote de animais</h1>

          {/* Step indicator */}
          <div className="mt-5 flex items-center gap-0 overflow-x-auto pb-1">
            {WIZARD_STEPS.map((s, i) => {
              const Icon = s.icon
              const done = i < step
              const active = i === step
              return (
                <div key={s.id} className="flex items-center">
                  <div className={`flex items-center gap-2 rounded-sm px-3 py-1.5 text-xs font-semibold transition ${active ? 'bg-brand-600 text-white' : done ? 'text-brand-700' : 'text-[hsl(var(--muted-fg))]'}`}>
                    <Icon size={13} />
                    <span className="hidden sm:block">{s.label}</span>
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${active ? 'bg-white text-brand-700' : done ? 'bg-brand-100 text-brand-700' : 'bg-[hsl(var(--muted))] text-[hsl(var(--muted-fg))]'}`}>
                      {done ? '✓' : i + 1}
                    </span>
                  </div>
                  {i < WIZARD_STEPS.length - 1 && <span className="mx-1 h-px w-6 bg-[hsl(var(--border))]" />}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="page-container py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Step content */}
          <div className="card">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="p-6 space-y-5"
              >
                {step === 0 && (
                  <>
                    <div>
                      <p className="field-label mb-3">Espécie *</p>
                      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                        {SPECIES.map((s) => (
                          <button key={s.id} type="button" onClick={() => { field('category', s.id); field('breed', '') }}
                            className={`rounded-sm border-2 py-3 text-xs font-semibold transition ${form.category === s.id ? 'border-brand-600 bg-brand-50 text-brand-700' : 'border-[hsl(var(--border))] text-[hsl(var(--text-sub))] hover:border-brand-300'}`}>
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FieldGroup label="Raça">
                        <select className="field-input bg-[hsl(var(--surface))]" value={form.breed} onChange={(e) => field('breed', e.target.value)} disabled={!form.category}>
                          <option value="">Selecione a raça</option>
                          {(BREEDS[form.category] || []).map((b) => <option key={b}>{b}</option>)}
                        </select>
                      </FieldGroup>
                      <FieldGroup label="Quantidade de cabeças *">
                        <input type="number" min="1" className="field-input" placeholder="Ex.: 40" value={form.quantity} onChange={(e) => field('quantity', e.target.value)} />
                      </FieldGroup>
                      <FieldGroup label="Peso mínimo (kg)">
                        <input type="number" min="1" className="field-input" placeholder="Ex.: 380" value={form.weightMin} onChange={(e) => field('weightMin', e.target.value)} />
                      </FieldGroup>
                      <FieldGroup label="Peso máximo (kg)">
                        <input type="number" min="1" className="field-input" placeholder="Ex.: 480" value={form.weightMax} onChange={(e) => field('weightMax', e.target.value)} />
                      </FieldGroup>
                      <FieldGroup label="Sexo">
                        <select className="field-input bg-[hsl(var(--surface))]" value={form.sex} onChange={(e) => field('sex', e.target.value)}>
                          {['Macho', 'Fêmea', 'Misto'].map((s) => <option key={s}>{s}</option>)}
                        </select>
                      </FieldGroup>
                      <FieldGroup label="Idade média">
                        <input className="field-input" placeholder="Ex.: 18 meses" value={form.age} onChange={(e) => field('age', e.target.value)} />
                      </FieldGroup>
                    </div>
                  </>
                )}

                {step === 1 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FieldGroup label="Estado *">
                      <select className="field-input bg-[hsl(var(--surface))]" value={form.state} onChange={(e) => field('state', e.target.value)}>
                        <option value="">Selecione o estado</option>
                        {STATES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </FieldGroup>
                    <FieldGroup label="Cidade *">
                      <input className="field-input" placeholder="Ex.: Uberaba" value={form.city} onChange={(e) => field('city', e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Nome da fazenda / granja" className="sm:col-span-2">
                      <input className="field-input" placeholder="Ex.: Fazenda Santa Cruz" value={form.farm} onChange={(e) => field('farm', e.target.value)} />
                    </FieldGroup>
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <p className="field-label mb-3">Documentação e vacinação</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {VACC.map(([k, label]) => (
                        <label key={k} className="flex cursor-pointer items-center gap-3 rounded-sm border border-[hsl(var(--border))] p-3 transition hover:border-brand-300">
                          <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={form[k]} onChange={() => toggle(k)} />
                          <span className="text-sm font-medium text-[hsl(var(--text))]">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <p className="field-label mb-3">Fotos do lote</p>
                    <div className="grid grid-cols-3 gap-3">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="flex h-28 items-center justify-center border-2 border-dashed border-[hsl(var(--border))] rounded-sm text-center text-[hsl(var(--muted-fg))] text-xs hover:border-brand-400 transition cursor-pointer">
                          <div>
                            <Camera size={20} className="mx-auto mb-1 opacity-40" />
                            <p>Adicionar foto</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="mt-3 text-xs text-[hsl(var(--muted-fg))]">Fotos de qualidade aumentam a taxa de proposta em até 3x. Máximo 10 fotos.</p>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FieldGroup label="Preço total (R$) *">
                        <input type="number" min="0" className="field-input" placeholder="Ex.: 198000" value={form.price} onChange={(e) => field('price', e.target.value)} />
                      </FieldGroup>
                      <FieldGroup label="Preço por cabeça (R$)">
                        <input type="number" min="0" className="field-input" placeholder="Ex.: 4950" value={form.pricePerHead} onChange={(e) => field('pricePerHead', e.target.value)} />
                      </FieldGroup>
                    </div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 accent-brand-600" checked={form.freightIncluded} onChange={() => toggle('freightIncluded')} />
                      <span className="text-sm font-medium text-[hsl(var(--text))]">Frete incluso no preço</span>
                    </label>
                    <FieldGroup label="Descrição do lote">
                      <textarea className="field-input min-h-28 py-2.5 resize-y" placeholder="Descreva o lote, histórico de manejo, condições sanitárias, janela de retirada…" value={form.description} onChange={(e) => field('description', e.target.value)} />
                    </FieldGroup>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between border-t border-[hsl(var(--border))] px-6 py-4">
              <Button variant="ghost" size="md" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
                <ArrowLeft size={15} /> Anterior
              </Button>
              {isLast ? (
                <Button size="md" onClick={handleSubmit} loading={loading}>
                  {!loading && <><CheckCircle2 size={15} /> Publicar anúncio</>}
                </Button>
              ) : (
                <Button size="md" onClick={() => setStep((s) => s + 1)} disabled={!canNext()}>
                  Próximo <ArrowRight size={15} />
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar preview */}
          <aside className="space-y-4">
            <div className="card p-4">
              <p className="field-label mb-3">Pré-visualização</p>
              <div className="space-y-2 text-sm text-[hsl(var(--text-sub))]">
                {form.category && <div><span className="font-semibold text-[hsl(var(--text))]">Espécie:</span> {SPECIES.find((s) => s.id === form.category)?.label}</div>}
                {form.breed    && <div><span className="font-semibold text-[hsl(var(--text))]">Raça:</span> {form.breed}</div>}
                {form.quantity && <div><span className="font-semibold text-[hsl(var(--text))]">Quantidade:</span> {form.quantity} cabeças</div>}
                {form.city     && <div><span className="font-semibold text-[hsl(var(--text))]">Local:</span> {form.city}, {form.state}</div>}
                {form.price    && <div><span className="font-semibold text-[hsl(var(--text))]">Preço:</span> R$ {(+form.price).toLocaleString('pt-BR')}</div>}
              </div>
            </div>

            <div className="card p-4">
              <p className="field-label mb-3">Etapas do wizard</p>
              <div className="space-y-2">
                {WIZARD_STEPS.map((s, i) => {
                  const Icon = s.icon
                  const done = i < step
                  const active = i === step
                  return (
                    <div key={s.id} className={`flex items-center gap-2.5 text-xs font-medium ${active ? 'text-brand-700' : done ? 'text-brand-600' : 'text-[hsl(var(--muted-fg))]'}`}>
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black ${active ? 'bg-brand-600 text-white' : done ? 'bg-brand-100 text-brand-700' : 'bg-[hsl(var(--muted))]'}`}>
                        {done ? '✓' : i + 1}
                      </span>
                      <Icon size={12} />
                      {s.label}
                    </div>
                  )
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
