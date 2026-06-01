import { cn } from '../../lib/utils'

const variants = {
  default:  'bg-brand-50 text-brand-700 border border-brand-200',
  active:   'bg-brand-50 text-brand-700 border border-brand-200',
  pending:  'bg-accent-50 text-accent-700 border border-accent-200',
  paused:   'bg-[hsl(var(--muted))] text-[hsl(var(--muted-fg))] border border-[hsl(var(--border))]',
  danger:   'bg-red-50 text-red-700 border border-red-200',
  info:     'bg-sky-50 text-sky-700 border border-sky-200',
}

export default function Badge({ variant = 'default', className, children }) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide rounded-[var(--radius)]', variants[variant] ?? variants.default, className)}>
      {children}
    </span>
  )
}
