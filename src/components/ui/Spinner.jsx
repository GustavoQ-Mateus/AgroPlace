import { cn } from '../../lib/utils'

export default function Spinner({ className, size = 'md' }) {
  const s = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' }[size] ?? 'h-6 w-6'
  return (
    <span className={cn('inline-block animate-spin rounded-full border-2 border-current border-t-transparent text-brand-600', s, className)} />
  )
}

export function PageSpinner() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner size="lg" />
    </div>
  )
}
