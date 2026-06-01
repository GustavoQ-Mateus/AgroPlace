import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const variants = {
  primary:  'bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50',
  outline:  'border border-[hsl(var(--border))] bg-[hsl(var(--surface))] text-[hsl(var(--text))] hover:bg-[hsl(var(--muted))] disabled:opacity-50',
  ghost:    'text-[hsl(var(--text))] hover:bg-[hsl(var(--muted))] disabled:opacity-50',
  danger:   'bg-red-600 text-white hover:bg-red-700 disabled:opacity-50',
  accent:   'bg-accent-500 text-white hover:bg-accent-600 disabled:opacity-50',
  link:     'text-brand-600 underline-offset-4 hover:underline p-0 h-auto font-medium',
}

const sizes = {
  xs:   'h-7  px-2.5 text-xs  gap-1   rounded-[var(--radius)]',
  sm:   'h-8  px-3   text-sm  gap-1.5 rounded-[var(--radius)]',
  md:   'h-10 px-4   text-sm  gap-2   rounded-[var(--radius)]',
  lg:   'h-11 px-5   text-base gap-2  rounded-[var(--radius)]',
  xl:   'h-12 px-6   text-base gap-2.5 rounded-[var(--radius)]',
  icon: 'h-9  w-9            rounded-[var(--radius)]',
}

const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', loading = false, className, children, disabled, type = 'button', ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex shrink-0 items-center justify-center font-semibold transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-1',
        'select-none whitespace-nowrap cursor-pointer disabled:cursor-not-allowed',
        variants[variant] ?? variants.primary,
        sizes[size]  ?? sizes.md,
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          <span>Aguarde…</span>
        </>
      ) : children}
    </button>
  )
})

export default Button
