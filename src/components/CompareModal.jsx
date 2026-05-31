import { X, ArrowRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from './ui/Button'
import { formatCurrency } from '../utils/formatters'

const rows = [
  { label: 'Espécie',        key: (a) => a.breed || '—' },
  { label: 'Quantidade',     key: (a) => `${a.quantity?.toLocaleString('pt-BR')} cabeças` },
  { label: 'Peso médio',     key: (a) => a.weight ? `${a.weight} kg` : '—' },
  { label: 'Localização',    key: (a) => a.location || '—' },
  { label: 'Preço total',    key: (a) => formatCurrency(a.price), highlight: true },
  { label: 'Preço/cabeça',   key: (a) => formatCurrency(a.pricePerHead) },
  { label: 'Rastreabilidade',key: (a) => `${a.traceability}%`, highlight: true },
  { label: 'Status',         key: (a) => a.status || '—' },
  { label: 'Vendedor',       key: (a) => a.seller || '—' },
]

function bestValue(animals, key, higher = true) {
  if (animals.length < 2) return null
  const vals = animals.map((a) => parseFloat(String(key(a)).replace(/\D/g, '')) || 0)
  const best = higher ? Math.max(...vals) : Math.min(...vals)
  return vals.map((v) => v === best)
}

export default function CompareModal({ animals, onClose }) {
  const priceVals = animals.map((a) => a.price || 0)
  const traceVals = animals.map((a) => a.traceability || 0)
  const minPrice  = Math.min(...priceVals)
  const maxTrace  = Math.max(...traceVals)

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 pt-16">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-4xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-black text-emerald-950">Comparar lotes ({animals.length})</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700">
            <X size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Cabeçalho com imagens */}
            <thead>
              <tr>
                <th className="w-36 border-b border-r border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Campo
                </th>
                {animals.map((a) => (
                  <th key={a.id} className="border-b border-r border-slate-200 px-4 py-3 text-left last:border-r-0">
                    <img src={a.image} alt={a.title} className="mb-2 h-28 w-full object-cover" />
                    <p className="text-sm font-black text-emerald-950 leading-tight">{a.title}</p>
                    {a.price === minPrice && (
                      <span className="mt-1 inline-block border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                        Menor preço
                      </span>
                    )}
                    {a.traceability === maxTrace && (
                      <span className="mt-1 ml-1 inline-flex items-center gap-1 border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700">
                        <ShieldCheck size={10} /> Melhor score
                      </span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Linhas comparativas */}
            <tbody>
              {rows.map(({ label, key, highlight }) => (
                <tr key={label} className={highlight ? 'bg-emerald-50/40' : 'hover:bg-slate-50'}>
                  <td className="border-b border-r border-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                    {label}
                  </td>
                  {animals.map((a) => (
                    <td
                      key={a.id}
                      className={`border-b border-r border-slate-100 px-4 py-3 text-sm last:border-r-0 ${
                        highlight ? 'font-black text-emerald-950' : 'font-medium text-slate-700'
                      }`}
                    >
                      {key(a)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>

            {/* CTA row */}
            <tfoot>
              <tr>
                <td className="px-4 py-4 border-r border-slate-100" />
                {animals.map((a) => (
                  <td key={a.id} className="px-4 py-4 border-r border-slate-100 last:border-r-0">
                    <Link to={`/anuncio/${a.id}`} onClick={onClose}>
                      <Button className="w-full" size="sm">
                        Ver anúncio
                        <ArrowRight size={13} />
                      </Button>
                    </Link>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
