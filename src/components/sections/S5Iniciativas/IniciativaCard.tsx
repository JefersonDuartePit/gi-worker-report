import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Badge from '../../ui/Badge'
import Button from '../../ui/Button'
import Card from '../../ui/Card'
import ProgressBar from '../../ui/ProgressBar'
import Tag from '../../ui/Tag'
import type { Iniciativa, Jornada } from '../../../types'

interface IniciativaCardProps {
  iniciativa: Iniciativa
  isExpanded: boolean
  onToggle: (id: string) => void
  onVerTela: () => void
}

const NIVEL_PCT: Record<'baixo' | 'medio' | 'alto', number> = {
  baixo: 33, medio: 66, alto: 100,
}

const NIVEL_LABEL: Record<'baixo' | 'medio' | 'alto', string> = {
  baixo: 'Baixo', medio: 'Médio', alto: 'Alto',
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

function IniciativaCard({ iniciativa, isExpanded, onToggle, onVerTela }: IniciativaCardProps) {
  const Icon = isExpanded ? ChevronUp : ChevronDown

  return (
    <Card
      variant={isExpanded ? 'highlighted' : 'hoverable'}
      onClick={() => onToggle(iniciativa.id)}
      className="cursor-pointer"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gi-charcoal bg-gi-muted rounded px-2 py-0.5">
            {iniciativa.id.replace('I', '')}
          </span>
          <Badge variant={JORNADA_BADGE[iniciativa.jornada]}>
            {JORNADA_LABEL[iniciativa.jornada]}
          </Badge>
        </div>
        <Icon className="w-4 h-4 text-gi-charcoal flex-shrink-0" />
      </div>

      <h3 className="text-base font-bold text-gi-dark mt-3 mb-3">{iniciativa.titulo}</h3>

      <div className="flex gap-2 flex-wrap">
        {iniciativa.personas.map(p => (
          <Tag key={p} persona={p} />
        ))}
      </div>

      <div className="mt-4 space-y-2">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-gi-charcoal">Impacto</span>
            <span className="text-[11px] text-gi-charcoal">{NIVEL_LABEL[iniciativa.impacto]}</span>
          </div>
          <ProgressBar value={NIVEL_PCT[iniciativa.impacto]} />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wide text-gi-charcoal">Esforço</span>
            <span className="text-[11px] text-gi-charcoal">{NIVEL_LABEL[iniciativa.esforco]}</span>
          </div>
          <ProgressBar value={NIVEL_PCT[iniciativa.esforco]} fillClassName="bg-gi-amber" />
        </div>
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
            <p className="text-sm text-gi-text mb-4">{iniciativa.descricao}</p>
            {iniciativa.sistemaSubstituido && (
              <div className="bg-gi-muted rounded-lg p-3 mb-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-gi-charcoal mb-1">
                  Sistema substituído
                </p>
                <p className="text-sm text-gi-dark">{iniciativa.sistemaSubstituido}</p>
              </div>
            )}
            {iniciativa.telasRelacionadas && iniciativa.telasRelacionadas.length > 0 && (
              <div className="flex justify-end" onClick={(e) => e.stopPropagation()}>
                <Button variant="secondary" onClick={onVerTela}>
                  Ver tela →
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

export default IniciativaCard
