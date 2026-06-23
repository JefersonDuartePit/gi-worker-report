import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

type CardVariant = 'default' | 'hoverable' | 'highlighted' | 'muted'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  variant?: CardVariant
}

const VARIANT_STYLES: Record<CardVariant, string> = {
  default:     'bg-white border border-gi-border',
  hoverable:   'bg-white border border-gi-border hover:border-gi-blue hover:shadow-sm cursor-pointer',
  highlighted: 'bg-white border-2 border-gi-blue',
  muted:       'bg-gi-light border border-transparent',
}

function Card({ children, className, onClick, variant = 'default' }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn('rounded-xl p-6 transition-all', VARIANT_STYLES[variant], className)}
    >
      {children}
    </div>
  )
}

export default Card
