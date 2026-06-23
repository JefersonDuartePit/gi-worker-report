import type { Persona } from '../../types'
import { cn } from '../../lib/utils'

interface TagProps {
  persona: Persona
  className?: string
}

const PERSONA_STYLES: Record<Persona, string> = {
  'worker':         'bg-purple-100 text-purple-800',
  'colaborador-gi': 'bg-blue-100 text-gi-navy',
  'cliente':        'bg-teal-100 text-teal-800',
}

const PERSONA_LABELS: Record<Persona, string> = {
  'worker':         'Worker',
  'colaborador-gi': 'Colaborador GI',
  'cliente':        'Cliente',
}

function Tag({ persona, className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold',
        PERSONA_STYLES[persona],
        className,
      )}
    >
      {PERSONA_LABELS[persona]}
    </span>
  )
}

export default Tag
