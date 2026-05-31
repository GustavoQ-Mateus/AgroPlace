import { motion } from 'framer-motion'
import { MapPin, ShieldCheck, GitCompareArrows } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from './ui/Button'
import { formatCurrency } from '../utils/formatters'

const categoryLabels = {
  bovinos: 'Bovinos',
  equinos: 'Equinos',
  aves: 'Aves',
  suinos: 'Suínos',
  ovinos: 'Ovinos',
  caprinos: 'Caprinos',
}

export default function AnimalCard({ animal, index = 0, onCompare, compareSelected }) {
  return (
    <motion.div
      className={`grid grid-cols-[56px_1fr] items-center gap-4 border-b border-slate-100 px-5 py-3.5 last:border-0 transition hover:bg-slate-50 sm:grid-cols-[56px_1fr_auto_auto_auto_auto] ${compareSelected ? 'bg-emerald-50' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.04, duration: 0.25 }}
    >
      <Link to={`/anuncio/${animal.id}`} className="shrink-0">
        <img
          src={animal.image}
          alt={animal.title}
          className="h-14 w-14 bg-slate-200 object-cover"
          loading="lazy"
        />
      </Link>

      <div className="min-w-0">
        <Link to={`/anuncio/${animal.id}`}>
          <p className="truncate text-sm font-bold text-emerald-950 hover:text-emerald-700">
            {animal.title}
          </p>
        </Link>
        <p className="mt-0.5 text-xs text-slate-500">
          {animal.breed} · {categoryLabels[animal.category]}
        </p>
        <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400">
          <MapPin size={11} />
          {animal.location}
        </p>
      </div>

      <div className="hidden text-right sm:block">
        <p className="text-sm font-bold text-slate-800">{animal.quantity.toLocaleString('pt-BR')}</p>
        <p className="text-[11px] text-slate-400">cabeças</p>
      </div>

      <div className="hidden text-right sm:block">
        <p className="flex items-center justify-end gap-1 text-sm font-bold text-emerald-700">
          <ShieldCheck size={12} />
          {animal.traceability}%
        </p>
        <p className="text-[11px] text-slate-400">rastreab.</p>
      </div>

      <div className="hidden text-right sm:block">
        <p className="text-sm font-black text-emerald-950">{formatCurrency(animal.price)}</p>
        <p className="text-[11px] text-slate-400">{formatCurrency(animal.pricePerHead)}/cab.</p>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        {onCompare && (
          <button
            onClick={() => onCompare(animal)}
            title={compareSelected ? 'Remover da comparação' : 'Comparar lote'}
            className={`flex h-8 w-8 items-center justify-center border transition ${
              compareSelected
                ? 'border-emerald-400 bg-emerald-600 text-white'
                : 'border-slate-200 text-slate-400 hover:border-emerald-300 hover:text-emerald-600'
            }`}
          >
            <GitCompareArrows size={13} />
          </button>
        )}
        <Link to={`/anuncio/${animal.id}`}>
          <Button size="sm" variant="outline">Ver lote</Button>
        </Link>
      </div>
    </motion.div>
  )
}
