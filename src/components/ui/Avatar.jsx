import { cn } from '../../lib/utils'

const sizes = { sm: 'h-7 w-7 text-xs', md: 'h-9 w-9 text-sm', lg: 'h-12 w-12 text-base', xl: 'h-16 w-16 text-xl' }

export default function Avatar({ src, alt, initials, size = 'md', className }) {
  const s = sizes[size] ?? sizes.md
  if (src) {
    return <img src={src} alt={alt} className={cn('rounded-full object-cover', s, className)} />
  }
  return (
    <span className={cn('inline-flex items-center justify-center rounded-full bg-brand-600 font-bold text-white select-none', s, className)}>
      {(initials || alt || '?')[0]?.toUpperCase()}
    </span>
  )
}
