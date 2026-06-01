import { forwardRef } from 'react'
import { cn } from '../../lib/utils'

const Input = forwardRef(function Input({ className, type = 'text', ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn('field-input', className)}
      {...props}
    />
  )
})

export default Input

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn('field-input min-h-24 py-2.5 resize-y', className)}
      {...props}
    />
  )
})

export function Label({ className, children, ...props }) {
  return (
    <label className={cn('field-label mb-1.5 block', className)} {...props}>
      {children}
    </label>
  )
}

export function FieldGroup({ label, error, children, className }) {
  return (
    <div className={cn('grid gap-1.5', className)}>
      {label && <Label>{label}</Label>}
      {children}
      {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
    </div>
  )
}
