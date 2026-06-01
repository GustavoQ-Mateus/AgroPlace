import { useState } from 'react'
import { Save, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import Button from './ui/Button'
import { FieldGroup } from './ui/Input'
import { useUiStore } from '../stores/uiStore'
import { updateListing } from '../services/listingsService'

const STATES = [
  'AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA',
  'PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO',
]

export default function EditListingModal({ listing, onClose, onSaved }) {
  const addToast = useUiStore((s) => s.addToast)
  const [form, setForm] = useState({
    title:       listing.title || (listing.breed ? `${listing.breed} — ${listing.quantity} cabeças` : ''),
    description: listing.description || '',
    price:       listing.price_total  || listing.price    || '',
    city:        listing.city         || listing.location?.split(',')[0]?.trim() || '',
    state:       listing.state        || listing.location?.split(',')[1]?.trim() || '',
    quantity:    listing.quantity     || '',
  })
  const [saving, setSaving] = useState(false)

  function field(k, v) { setForm((f) => ({ ...f, [k]: v })) }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      const updates = {
        title:       form.title,
        description: form.description,
        price_total: +String(form.price).replace(/\D/g, ''),
        city:        form.city,
        state:       form.state,
        quantity:    +form.quantity,
      }
      try { await updateListing(listing.id, updates) } catch {}
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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1,    y: 0 }}
          exit={{   opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-lg card shadow-hover"
        >
          <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-6 py-4">
            <h2 className="font-black text-[hsl(var(--text))]">Editar anúncio</h2>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center text-[hsl(var(--muted-fg))] transition hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--text))] rounded-sm"
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSave} className="divide-y divide-[hsl(var(--border))]">
            <div className="grid gap-4 p-6">
              <FieldGroup label="Título *">
                <input className="field-input" value={form.title} onChange={(e) => field('title', e.target.value)} required />
              </FieldGroup>

              <div className="grid grid-cols-2 gap-4">
                <FieldGroup label="Quantidade">
                  <input type="number" min="1" className="field-input" value={form.quantity} onChange={(e) => field('quantity', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Preço total (R$)">
                  <input className="field-input" placeholder="0" value={form.price} onChange={(e) => field('price', e.target.value)} />
                </FieldGroup>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FieldGroup label="Cidade">
                  <input className="field-input" value={form.city} onChange={(e) => field('city', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Estado">
                  <select className="field-input bg-[hsl(var(--surface))]" value={form.state} onChange={(e) => field('state', e.target.value)}>
                    <option value="">UF</option>
                    {STATES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </FieldGroup>
              </div>

              <FieldGroup label="Descrição">
                <textarea
                  className="field-input min-h-24 py-2.5 resize-y"
                  placeholder="Características do lote…"
                  value={form.description}
                  onChange={(e) => field('description', e.target.value)}
                />
              </FieldGroup>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4">
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit" loading={saving}>
                {!saving && <Save size={14} />}
                Salvar alterações
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
