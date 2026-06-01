import { cn } from '../../lib/utils'

export function Card({ className, children, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'card',
        hover && 'card-hover cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }) {
  return (
    <div className={cn('panel-header', className)}>{children}</div>
  )
}

export function CardBody({ className, children }) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>
}

export function CardFooter({ className, children }) {
  return (
    <div className={cn('border-t border-[hsl(var(--border))] px-5 py-3', className)}>
      {children}
    </div>
  )
}
