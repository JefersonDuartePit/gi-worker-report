import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Badge from '../../ui/Badge'
import Card from '../../ui/Card'
import Tag from '../../ui/Tag'
import { INICIATIVAS } from '../../../data/iniciativas'
import type { Dor, Jornada } from '../../../types'

interface DorCardProps {
  dor: Dor
  isExpanded: boolean
  onToggle: (id: string) => void
}

const SEVERIDADE_LABEL: Record<'critica' | 'alta' | 'media', string> = {
  critica: 'Crítica',
  alta: 'Alta',
  media: 'Média',
}

const JORNADA_BADGE = {
  admissao: 'admissao',
  'ciclo-ativo': 'ciclo',
  offboarding: 'offboarding',
} as const

const JORNADA_LABEL: Record<Jornada, string> = {
  admissao: 'Admissão',
  'ciclo-ativo': 'Ciclo Ativo',
  offboarding: 'Offboarding',
}

function DorCard({ dor, isExpanded, onToggle }: DorCardProps) {
  const iniciativa = INICIATIVAS.find(i => i.id === dor.iniciativaQueResolve)
  const Icon = isExpanded ? ChevronUp : ChevronDown

  return (
    <Card
      variant={isExpanded ? 'highlighted' : 'hoverable'}
      onClick={() => onToggle(dor.id)}
      className="cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-2 flex-wrap">
          <Badge variant={dor.severidade}>{SEVERIDADE_LABEL[dor.severidade]}</Badge>
          <Badge variant={JORNADA_BADGE[dor.jornada]}>{JORNADA_LABEL[dor.jornada]}</Badge>
        </div>
        <Icon className="w-4 h-4 text-gi-charcoal flex-shrink-0" />
      </div>

      <h3 className="text-base font-bold text-gi-dark mb-3">{dor.titulo}</h3>

      <div className="flex gap-2 flex-wrap">
        {dor.personas.map(p => (
          <Tag key={p} persona={p} />
        ))}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <hr className="border-gi-border my-4" />
            <p className="text-sm text-gi-text mb-4">{dor.descricao}</p>
            {iniciativa && (
              <div className="bg-gi-light rounded-lg p-3">
                <p className="text-[11px] font-bold uppercase tracking-wide text-gi-charcoal mb-1">
                  Iniciativa que resolve
                </p>
                <p className="text-sm font-bold text-gi-navy">
                  {iniciativa.id} — {iniciativa.titulo}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

export default DorCard
