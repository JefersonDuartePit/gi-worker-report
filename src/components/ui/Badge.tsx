import { cn } from '../../lib/utils'

type BadgeVariant =
  | 'critica'
  | 'alta'
  | 'media'
  | 'andamento'
  | 'concluido'
  | 'bloqueado'
  | 'admissao'
  | 'ciclo'
  | 'offboarding'

interface BadgeProps {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  critica:     'bg-red-100 text-gi-red border border-red-200',
  alta:        'bg-orange-100 text-gi-orange border border-orange-200',
  media:       'bg-amber-100 text-gi-amber border border-amber-200',
  andamento:   'bg-blue-100 text-gi-blue border border-blue-200',
  concluido:   'bg-green-100 text-gi-green border border-green-200',
  bloqueado:   'bg-gray-100 text-gi-charcoal border border-gi-border',
  admissao:    'bg-gi-navy text-white',
  ciclo:       'bg-gi-blue text-white',
  offboarding: 'bg-gi-steel text-white',
}

function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide',
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Badge
