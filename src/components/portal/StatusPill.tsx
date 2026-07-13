import type { ReactNode } from 'react'

type PillVariant = 'concluido' | 'andamento' | 'media' | 'bloqueado' | 'critica'

interface StatusPillProps {
  variant: PillVariant
  children: ReactNode
}

const VARIANT_STYLES: Record<PillVariant, { bg: string; text: string; dot: string }> = {
  concluido: { bg: 'bg-green-50', text: 'text-gi-green', dot: 'bg-gi-green' },
  andamento: { bg: 'bg-blue-50', text: 'text-gi-blue', dot: 'bg-gi-blue' },
  media: { bg: 'bg-amber-50', text: 'text-gi-amber', dot: 'bg-gi-amber' },
  bloqueado: { bg: 'bg-gi-light', text: 'text-gi-charcoal', dot: 'bg-gi-charcoal' },
  critica: { bg: 'bg-red-50', text: 'text-gi-red', dot: 'bg-gi-red' },
}

function StatusPill({ variant, children }: StatusPillProps) {
  const styles = VARIANT_STYLES[variant]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${styles.bg} ${styles.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`} />
      {children}
    </span>
  )
}

export default StatusPill
