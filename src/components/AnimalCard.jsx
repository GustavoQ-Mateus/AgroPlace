import { motion } from 'framer-motion'
import { Clock, MapPin, ShieldCheck, Star, Tag } from 'lucide-react'
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

export default function AnimalCard({ animal, index = 0, compact = false }) {
  return (
    <motion.article
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-slate-900/10"
      initial={{ opacity: 0, y: 18 }}
      transition={{ delay: index * 0.05, duration: 0.35, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <Link className="relative block" to={`/anuncio/${animal.id}`}>
        <div className={compact ? 'h-40 overflow-hidden bg-slate-200' : 'h-48 overflow-hidden bg-slate-200'}>
          <img
            alt={animal.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            src={animal.image}
          />
        </div>
        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-3">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-emerald-800 shadow-sm backdrop-blur">
            {categoryLabels[animal.category]}
          </span>
          <span className="rounded-full bg-slate-950/70 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
            {animal.quantity > 1 ? `${animal.quantity.toLocaleString('pt-BR')} cabeças` : '1 unidade'}
          </span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">{animal.breed}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{animal.status}</span>
        </div>

        <Link to={`/anuncio/${animal.id}`}>
          <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-5 text-emerald-950 transition group-hover:text-emerald-700">
            {animal.title}
          </h3>
        </Link>

        <div className="flex flex-wrap gap-1.5">
          {animal.tags.slice(0, compact ? 2 : 3).map((tag) => (
            <span
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600"
              key={tag}
            >
              <Tag size={10} className="text-emerald-600" />
              {tag}
            </span>
          ))}
        </div>

        <div className="grid gap-2 text-xs text-slate-500">
          <div className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-1.5">
              <MapPin size={13} className="shrink-0 text-slate-400" />
              <span className="truncate">{animal.location}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1">
              <Clock size={12} className="text-slate-400" />
              {animal.daysListed}d
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <span className="flex min-w-0 items-center gap-1.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-700">
                {animal.seller.charAt(0)}
              </span>
              <span className="truncate">{animal.seller}</span>
              {animal.sellerVerified && <ShieldCheck size={13} className="shrink-0 text-emerald-600" />}
            </span>
            <span className="flex shrink-0 items-center gap-1 font-semibold text-slate-700">
              <Star size={12} className="fill-amber-400 text-amber-400" />
              {animal.rating}
            </span>
          </div>
        </div>

        <div className="mt-auto border-t border-slate-100 pt-3">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-lg font-black leading-none text-emerald-950">{formatCurrency(animal.price)}</p>
              <p className="mt-1 truncate text-xs text-slate-500">
                {formatCurrency(animal.pricePerHead)}/cab.
                {animal.pricePerArroba ? ` · R$ ${animal.pricePerArroba}/@` : ''}
              </p>
            </div>
            <Link to={`/anuncio/${animal.id}`}>
              <Button className="px-3" size="sm">
                Ver lote
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
