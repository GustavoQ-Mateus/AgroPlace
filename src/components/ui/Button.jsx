import { forwardRef } from 'react'
import { motion } from 'framer-motion'

const variants = {
  primary:
    'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200 disabled:bg-emerald-300',
  outline:
    'border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 disabled:border-emerald-200 disabled:text-emerald-300',
  ghost:
    'text-emerald-700 hover:bg-emerald-50 disabled:text-emerald-300',
  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-sm shadow-red-200 disabled:bg-red-300',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    className = '',
    disabled,
    type = 'button',
    ...props
  },
  ref
) {
  const isDisabled = disabled || loading

  return (
    <motion.button
      ref={ref}
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium',
        'transition-colors duration-200 cursor-pointer whitespace-nowrap',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2',
        'disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className,
      ].join(' ')}
      disabled={isDisabled}
      type={type}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
      )}
      {children}
    </motion.button>
  )
})

export default Button
