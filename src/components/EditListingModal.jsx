import { useState } from 'react'
import { X, Save } from 'lucide-react'
import Button from './ui/Button'
import { useUiStore } from '../stores/uiStore'
import { updateListing } from '../services/listingsService'

const STATES = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA',
  'PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO',
]

export default function EditListingModal({ listing, onClose, onSaved }) {
  const addToast = useUiStore((s) => s.addToast)
  const [form, setForm] = useState({
    title:       listing.title       || listing.breed ? `${listing.breed} — ${listing.quantity} cabeças` : '',
    description: listing.description || '',
    price:       listing.price_total || listing.price || '',
    city:        listing.city        || (listing.location?.split(',')[0]?.trim()) || '',
    state:       listing.state       || (listing.location?.split(',')[1]?.trim()) || '',
    quantity:    listing.quantity    || '',
  })
  const [saving, setSaving] = useState(false)

  function field(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const updates = {
        title:       form.title,
        description: form.description,
        price_total: +String(form.price).replace(/\D/g, '') / (String(form.price).includes(',') ? 100 : 1),
        city:        form.city,
        state:       form.state,
        quantity:    +form.quantity,
      }
      try {
        await updateListing(listing.id, updates)
      } catch {}
      onSaved?.({ ...listing, ...updates, price: updates.price_total, location: `${form.city}, ${form.state}` })
      addToast('Anúncio atualizado com sucesso!')
      onClose()
    } catch (err) {
      addToast(err?.message || 'Erro ao salvar.', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-black text-emerald-950">Editar anúncio</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSave} className="divide-y divide-slate-100">
          <div className="grid gap-4 p-6">
            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Título *</span>
              <input
                className="h-10 border border-slate-200 px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15"
                value={form.title}
                onChange={(e) => field('title', e.target.value)}
                required
              />
            </label>

            <div className="grid grid-cols-2 gap-4">
              <label className="grid gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Quantidade</span>
                <input
                  type="number" min="1"
                  className="h-10 border border-slate-200 px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15"
                  value={form.quantity}
                  onChange={(e) => field('quantity', e.target.value)}
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Preço total (R$)</span>
                <input
                  className="h-10 border border-slate-200 px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => field('price', e.target.value)}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="grid gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Cidade</span>
                <input
                  className="h-10 border border-slate-200 px-3 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15"
                  value={form.city}
                  onChange={(e) => field('city', e.target.value)}
                />
              </label>
              <label className="grid gap-1.5">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Estado</span>
                <select
                  className="h-10 border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                  value={form.state}
                  onChange={(e) => field('state', e.target.value)}
                >
                  <option value="">UF</option>
                  {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
            </div>

            <label className="grid gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500">Descrição</span>
              <textarea
                className="min-h-24 border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/15"
                value={form.description}
                onChange={(e) => field('description', e.target.value)}
                placeholder="Características do lote..."
              />
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 px-6 py-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" loading={saving}>
              {!saving && <Save size={14} />}
              Salvar alterações
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
