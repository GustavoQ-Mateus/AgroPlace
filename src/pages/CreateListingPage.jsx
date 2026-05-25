import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ArrowRight, Camera, CheckCircle2, ChevronRight,
  FileText, ImagePlus, Info, Leaf, MapPin, Package, ShieldCheck, Tag, Truck, X,
} from 'lucide-react'
import Button from '../components/ui/Button'
import { useApp } from '../context/AppContext'

const SPECIES = [
  { id: 'bovinos',  label: 'Bovinos',  emoji: '🐄' },
  { id: 'equinos',  label: 'Equinos',  emoji: '🐴' },
  { id: 'suinos',   label: 'Suínos',   emoji: '🐷' },
  { id: 'aves',     label: 'Aves',     emoji: '🐔' },
  { id: 'ovinos',   label: 'Ovinos',   emoji: '🐑' },
  { id: 'caprinos', label: 'Caprinos', emoji: '🐐' },
]

const BREEDS = {
  bovinos:  ['Nelore', 'Angus', 'Girolando', 'Brahman', 'Senepol', 'Tabapuã', 'Guzerá', 'Canchim'],
  equinos:  ['Quarto de Milha', 'Mangalarga Marchador', 'Crioulo', 'Lusitano', 'Paint Horse', 'Appaloosa'],
  suinos:   ['Landrace', 'Large White', 'Duroc', 'Pietrain', 'Hampshire'],
  aves:     ['Cobb 500', 'Ross 308', 'Hubbard', 'Caipira', 'Pescoço Pelado'],
  ovinos:   ['Santa Inês', 'Dorper', 'Morada Nova', 'Suffolk', 'Texel'],
  caprinos: ['Boer', 'Saanen', 'Anglo Nubiana', 'Toggenburg', 'Moxotó'],
}

const STATES = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA',
  'PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO',
]

const STEPS = [
  { id: 'especie',        label: 'Espécie e raça',     icon: Leaf },
  { id: 'localizacao',    label: 'Localização',        icon: MapPin },
  { id: 'rastreabilidade',label: 'Rastreabilidade',    icon: ShieldCheck },
  { id: 'fotos',          label: 'Fotos',              icon: Camera },
  { id: 'preco',          label: 'Preço e frete',      icon: Tag },
]

const INITIAL = {
  category: '', breed: '', quantity: '', weightMin: '', weightMax: '', sex: '', age: '',
  state: '', city: '', farm: '',
  gta: false, brucela: false, tuberculose: false, aftosa: false, raiva: false, carbunculo: false, dna: false, organico: false,
  photos: [],
  price: '', pricePerHead: '', pricePerArroba: '', freightIncluded: false, freightNote: '', description: '',
}

export default function CreateListingPage() {
  const navigate = useNavigate()
  const { addListing, user } = useApp()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  function validate() {
    const errs = {}
    if (step === 0) {
      if (!form.category) errs.category = 'Selecione a espécie'
      if (!form.breed)    errs.breed    = 'Informe a raça'
      if (!form.quantity || isNaN(form.quantity) || +form.quantity < 1) errs.quantity = 'Quantidade inválida'
      if (!form.sex)      errs.sex      = 'Selecione o sexo'
    }
    if (step === 1) {
      if (!form.state) errs.state = 'Selecione o estado'
      if (!form.city)  errs.city  = 'Informe a cidade'
      if (!form.farm)  errs.farm  = 'Informe o nome da propriedade'
    }
    if (step === 4) {
      if (!form.price || isNaN(form.price.replace(/\D/g, ''))) errs.price = 'Informe o preço do lote'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function next() {
    if (!validate()) return
    if (step < STEPS.length - 1) setStep((s) => s + 1)
    else handleSubmit()
  }

  function prev() { setStep((s) => s - 1) }

  async function handleSubmit() {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))
    const listing = {
      title: `${form.breed} — ${form.quantity} cabeças`,
      category: form.category,
      breed: form.breed,
      quantity: +form.quantity,
      weight: form.weightMin ? +form.weightMin : 0,
      price: +form.price.replace(/\D/g, '') || 0,
      pricePerHead: form.pricePerHead ? +form.pricePerHead.replace(/\D/g, '') : null,
      location: `${form.city}/${form.state}`,
      seller: user?.name || 'Produtor',
      sellerVerified: true,
      traceability: [form.gta, form.brucela, form.tuberculose, form.aftosa].filter(Boolean).length * 25,
      image: `https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80`,
      tags: ['GTA', form.organico && 'Orgânico'].filter(Boolean),
      status: 'Ativo',
    }
    addListing(listing)
    setSubmitting(false)
    navigate('/vendedor')
  }

  const stepProgress = Math.round(((step) / STEPS.length) * 100)

  return (
    <section className="min-h-screen bg-slate-50 pt-14">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-5">
            <button
              onClick={() => step > 0 ? prev() : navigate('/vendedor')}
              className="flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-500 transition hover:bg-slate-100"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="flex-1">
              <p className="section-label mb-0.5">Novo anúncio</p>
              <h1 className="text-xl font-black text-emerald-950">Publicar lote no marketplace</h1>
            </div>
            <span className="hidden text-sm font-semibold text-slate-400 sm:block">
              Etapa {step + 1} de {STEPS.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-slate-100">
            <div
              className="h-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>

          {/* Step indicators */}
          <div className="flex overflow-x-auto">
            {STEPS.map((s, i) => {
              const done = i < step
              const active = i === step
              return (
                <div
                  key={s.id}
                  className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-xs font-bold transition ${
                    active ? 'border-emerald-600 text-emerald-700' :
                    done   ? 'border-emerald-200 text-emerald-600' :
                             'border-transparent text-slate-400'
                  }`}
                >
                  {done ? <CheckCircle2 size={13} /> : <s.icon size={13} />}
                  <span>{s.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {step === 0 && <StepEspecie form={form} set={set} errors={errors} />}
            {step === 1 && <StepLocalizacao form={form} set={set} errors={errors} />}
            {step === 2 && <StepRastreabilidade form={form} set={set} />}
            {step === 3 && <StepFotos form={form} set={set} />}
            {step === 4 && <StepPreco form={form} set={set} errors={errors} />}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-6">
          <Button variant="outline" onClick={() => step > 0 ? prev() : navigate('/vendedor')}>
            <ArrowLeft size={14} />
            {step > 0 ? 'Anterior' : 'Cancelar'}
          </Button>
          <Button onClick={next} loading={submitting}>
            {step < STEPS.length - 1 ? 'Próxima etapa' : 'Publicar anúncio'}
            {!submitting && <ArrowRight size={14} />}
          </Button>
        </div>
      </div>
    </section>
  )
}

/* ─── Step 1: Espécie e raça ───────────────────────────── */
function StepEspecie({ form, set, errors }) {
  const breeds = BREEDS[form.category] || []
  return (
    <div className="space-y-6">
      <div className="border border-slate-200 bg-white">
        <div className="panel-header">
          <h2 className="font-black text-emerald-950">Espécie do lote</h2>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {SPECIES.map((sp) => (
              <button
                key={sp.id}
                onClick={() => { set('category', sp.id); set('breed', '') }}
                className={`flex items-center gap-3 border p-4 text-left transition ${
                  form.category === sp.id
                    ? 'border-emerald-400 bg-emerald-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="text-2xl">{sp.emoji}</span>
                <span className={`font-bold text-sm ${form.category === sp.id ? 'text-emerald-800' : 'text-slate-700'}`}>
                  {sp.label}
                </span>
              </button>
            ))}
          </div>
          {errors.category && <p className="mt-2 text-xs text-red-600">{errors.category}</p>}
        </div>
      </div>

      {form.category && (
        <div className="border border-slate-200 bg-white">
          <div className="panel-header">
            <h2 className="font-black text-emerald-950">Detalhes do lote</h2>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <label className="grid gap-1.5">
              <span className="prop-label">Raça *</span>
              <select
                className="h-10 border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                value={form.breed}
                onChange={(e) => set('breed', e.target.value)}
              >
                <option value="">Selecione a raça</option>
                {breeds.map((b) => <option key={b} value={b}>{b}</option>)}
                <option value="Outro">Outro / Mestiço</option>
              </select>
              {errors.breed && <p className="text-xs text-red-600">{errors.breed}</p>}
            </label>

            <label className="grid gap-1.5">
              <span className="prop-label">Quantidade de cabeças *</span>
              <input
                type="number" min="1"
                className="h-10 border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                placeholder="ex.: 120"
                value={form.quantity}
                onChange={(e) => set('quantity', e.target.value)}
              />
              {errors.quantity && <p className="text-xs text-red-600">{errors.quantity}</p>}
            </label>

            <label className="grid gap-1.5">
              <span className="prop-label">Peso médio mínimo (kg)</span>
              <input
                type="number" min="1"
                className="h-10 border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                placeholder="ex.: 350"
                value={form.weightMin}
                onChange={(e) => set('weightMin', e.target.value)}
              />
            </label>

            <label className="grid gap-1.5">
              <span className="prop-label">Peso médio máximo (kg)</span>
              <input
                type="number" min="1"
                className="h-10 border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                placeholder="ex.: 420"
                value={form.weightMax}
                onChange={(e) => set('weightMax', e.target.value)}
              />
            </label>

            <label className="grid gap-1.5">
              <span className="prop-label">Sexo *</span>
              <select
                className="h-10 border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                value={form.sex}
                onChange={(e) => set('sex', e.target.value)}
              >
                <option value="">Selecione</option>
                <option>Macho inteiro</option>
                <option>Macho castrado</option>
                <option>Fêmea</option>
                <option>Misto</option>
              </select>
              {errors.sex && <p className="text-xs text-red-600">{errors.sex}</p>}
            </label>

            <label className="grid gap-1.5">
              <span className="prop-label">Idade média</span>
              <input
                className="h-10 border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                placeholder="ex.: 18 meses"
                value={form.age}
                onChange={(e) => set('age', e.target.value)}
              />
            </label>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Step 2: Localização ──────────────────────────────── */
function StepLocalizacao({ form, set, errors }) {
  return (
    <div className="border border-slate-200 bg-white">
      <div className="panel-header">
        <h2 className="font-black text-emerald-950">Localização do lote</h2>
        <p className="text-sm text-slate-500">Endereço da propriedade onde os animais estão.</p>
      </div>
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="prop-label">Estado *</span>
          <select
            className="h-10 border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
            value={form.state}
            onChange={(e) => set('state', e.target.value)}
          >
            <option value="">Selecione o estado</option>
            {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.state && <p className="text-xs text-red-600">{errors.state}</p>}
        </label>

        <label className="grid gap-1.5">
          <span className="prop-label">Município *</span>
          <input
            className="h-10 border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
            placeholder="ex.: Uberlândia"
            value={form.city}
            onChange={(e) => set('city', e.target.value)}
          />
          {errors.city && <p className="text-xs text-red-600">{errors.city}</p>}
        </label>

        <label className="grid gap-1.5 sm:col-span-2">
          <span className="prop-label">Nome da propriedade *</span>
          <input
            className="h-10 border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
            placeholder="ex.: Fazenda Santa Cruz"
            value={form.farm}
            onChange={(e) => set('farm', e.target.value)}
          />
          {errors.farm && <p className="text-xs text-red-600">{errors.farm}</p>}
        </label>

        <label className="grid gap-1.5 sm:col-span-2">
          <span className="prop-label">Complemento / Referência</span>
          <input
            className="h-10 border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
            placeholder="ex.: Rodovia BR-050, km 12, zona rural"
          />
        </label>
      </div>

      <div className="mx-5 mb-5 flex items-start gap-3 border border-blue-200 bg-blue-50 px-4 py-3">
        <Info size={14} className="mt-0.5 shrink-0 text-blue-600" />
        <p className="text-xs leading-5 text-blue-700">
          A localização exata é exibida apenas após aceite de proposta. Compradores veem somente o município no catálogo.
        </p>
      </div>
    </div>
  )
}

/* ─── Step 3: Rastreabilidade ──────────────────────────── */
const DOCS = [
  { key: 'gta',         label: 'GTA (Guia de Trânsito Animal)',           required: true },
  { key: 'brucela',     label: 'Vacinação contra Brucelose',              required: true },
  { key: 'tuberculose', label: 'Teste de Tuberculose',                    required: false },
  { key: 'aftosa',      label: 'Vacinação contra Aftosa',                 required: true },
  { key: 'raiva',       label: 'Vacinação contra Raiva',                  required: false },
  { key: 'carbunculo',  label: 'Vacinação contra Carbúnculo Sintomático', required: false },
  { key: 'dna',         label: 'Teste de DNA / Certificado genealógico',  required: false },
  { key: 'organico',    label: 'Certificação Orgânica',                   required: false },
]

function StepRastreabilidade({ form, set }) {
  const checked = DOCS.filter((d) => form[d.key]).length
  const pct = Math.round((checked / DOCS.length) * 100)

  return (
    <div className="border border-slate-200 bg-white">
      <div className="panel-header">
        <div>
          <h2 className="font-black text-emerald-950">Documentação sanitária</h2>
          <p className="mt-0.5 text-xs text-slate-500">Marque todos os documentos que acompanham o lote.</p>
        </div>
        <div className="text-right">
          <p className="text-xl font-black text-emerald-700">{pct}%</p>
          <p className="text-xs text-slate-500">Score rastreabilidade</p>
        </div>
      </div>

      <div className="h-1.5 bg-slate-100">
        <div className="h-full bg-emerald-600 transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>

      <div className="divide-y divide-slate-100">
        {DOCS.map((doc) => (
          <label key={doc.key} className="flex cursor-pointer items-center gap-4 px-5 py-4 hover:bg-slate-50">
            <input
              type="checkbox"
              className="h-4 w-4 accent-emerald-600"
              checked={!!form[doc.key]}
              onChange={(e) => set(doc.key, e.target.checked)}
            />
            <span className="flex-1 text-sm font-medium text-slate-700">{doc.label}</span>
            {doc.required && (
              <span className="text-xs font-bold text-amber-600">Recomendado</span>
            )}
          </label>
        ))}
      </div>

      {pct < 50 && (
        <div className="mx-5 mb-5 mt-1 flex items-start gap-3 border border-amber-200 bg-amber-50 px-4 py-3">
          <Info size={14} className="mt-0.5 shrink-0 text-amber-600" />
          <p className="text-xs leading-5 text-amber-700">
            Anúncios com score abaixo de 50% recebem menos visualizações. Adicione os documentos básicos para aumentar sua conversão.
          </p>
        </div>
      )}
    </div>
  )
}

/* ─── Step 4: Fotos ────────────────────────────────────── */
function StepFotos({ form, set }) {
  const [dragging, setDragging] = useState(false)

  const DEMO_PHOTOS = [
    'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=70',
    'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&q=70',
    'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&q=70',
  ]

  function addDemo() {
    const url = DEMO_PHOTOS[form.photos.length % DEMO_PHOTOS.length]
    if (!form.photos.includes(url)) set('photos', [...form.photos, url])
  }

  function removePhoto(url) {
    set('photos', form.photos.filter((p) => p !== url))
  }

  return (
    <div className="space-y-4">
      <div className="border border-slate-200 bg-white">
        <div className="panel-header">
          <h2 className="font-black text-emerald-950">Fotos do lote</h2>
          <p className="text-xs text-slate-500">Mínimo 3 fotos · Max 20 MB cada</p>
        </div>

        <div className="p-5">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); addDemo() }}
            onClick={addDemo}
            className={`flex cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed py-10 transition ${
              dragging ? 'border-emerald-400 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
            }`}
          >
            <ImagePlus className="text-slate-400" size={32} />
            <div className="text-center">
              <p className="font-semibold text-slate-700">Clique para adicionar foto de demonstração</p>
              <p className="mt-0.5 text-xs text-slate-400">Em produção: arrastar e soltar arquivos JPEG/PNG</p>
            </div>
          </div>

          {form.photos.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {form.photos.map((url, i) => (
                <div key={url} className="group relative">
                  <img src={url} alt="" className="h-24 w-full object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 bg-emerald-600 px-1.5 py-0.5 text-xs font-bold text-white">
                      Capa
                    </span>
                  )}
                  <button
                    onClick={() => removePhoto(url)}
                    className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border border-slate-200 bg-white">
        <div className="panel-header">
          <h2 className="font-black text-emerald-950">Descrição detalhada</h2>
        </div>
        <div className="p-5">
          <textarea
            className="min-h-28 w-full border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
            placeholder="Descreva características do lote: alimentação, histórico sanitário, manejo, instalações, diferenciais..."
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
          <p className="mt-1 text-right text-xs text-slate-400">{form.description.length}/1000 caracteres</p>
        </div>
      </div>
    </div>
  )
}

/* ─── Step 5: Preço e frete ────────────────────────────── */
function StepPreco({ form, set, errors }) {
  function formatMoney(raw) {
    const digits = raw.replace(/\D/g, '')
    if (!digits) return ''
    return 'R$ ' + (+digits / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
  }

  function handlePrice(e) {
    set('price', formatMoney(e.target.value))
    if (form.quantity) {
      const total = +e.target.value.replace(/\D/g, '') / 100
      const perHead = total / +form.quantity
      set('pricePerHead', perHead ? formatMoney(String(Math.round(perHead * 100))) : '')
    }
  }

  return (
    <div className="space-y-4">
      <div className="border border-slate-200 bg-white">
        <div className="panel-header">
          <h2 className="font-black text-emerald-950">Precificação do lote</h2>
        </div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="grid gap-1.5 sm:col-span-2">
            <span className="prop-label">Preço total do lote *</span>
            <input
              className="h-11 border border-slate-200 px-3 text-base font-black text-emerald-950 outline-none focus:ring-2 focus:ring-emerald-500/15"
              placeholder="R$ 0,00"
              value={form.price}
              onChange={handlePrice}
            />
            {errors.price && <p className="text-xs text-red-600">{errors.price}</p>}
          </label>

          <label className="grid gap-1.5">
            <span className="prop-label">Preço por cabeça (calculado)</span>
            <input
              className="h-10 border border-slate-100 bg-slate-50 px-3 text-sm text-slate-600 outline-none"
              readOnly
              value={form.pricePerHead || '—'}
            />
          </label>

          <label className="grid gap-1.5">
            <span className="prop-label">Preço por arroba (@) — opcional</span>
            <input
              className="h-10 border border-slate-200 px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
              placeholder="R$ 0,00"
              value={form.pricePerArroba}
              onChange={(e) => set('pricePerArroba', formatMoney(e.target.value))}
            />
          </label>
        </div>
      </div>

      <div className="border border-slate-200 bg-white">
        <div className="panel-header">
          <h2 className="font-black text-emerald-950">Condições de retirada e frete</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {[
            { val: 'plataforma', label: 'Cotação via AgroPlace', sub: 'Frete cotado por transportadoras parceiras após aceite.' },
            { val: 'proprio',    label: 'Frete por conta do comprador', sub: 'Comprador responsável pela contratação do transporte.' },
            { val: 'incluso',    label: 'Frete incluso no preço', sub: 'Valor do frete já embutido no preço total do lote.' },
          ].map((opt) => (
            <label key={opt.val} className="flex cursor-pointer items-start gap-4 px-5 py-4 hover:bg-slate-50">
              <input
                type="radio"
                name="freight"
                className="mt-0.5 accent-emerald-600"
                checked={form.freightIncluded === opt.val}
                onChange={() => set('freightIncluded', opt.val)}
              />
              <div>
                <p className="font-semibold text-slate-800">{opt.label}</p>
                <p className="text-xs text-slate-500">{opt.sub}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Preview strip */}
      <div className="border border-emerald-200 bg-emerald-50">
        <div className="flex items-center gap-3 px-5 py-4">
          <CheckCircle2 className="shrink-0 text-emerald-600" size={20} />
          <div>
            <p className="font-black text-emerald-950">Tudo certo para publicar!</p>
            <p className="text-sm text-emerald-700">
              Seu lote de <strong>{form.breed || 'animais'}</strong>{form.quantity ? ` (${form.quantity} cabeças)` : ''} em{' '}
              <strong>{form.city || 'localização'}/{form.state || '—'}</strong> será publicado no catálogo imediatamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
