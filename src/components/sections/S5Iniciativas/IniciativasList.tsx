import { useContext, useState } from 'react'
import { PresentationContext } from '../../../App'
import { INICIATIVAS } from '../../../data/iniciativas'
import type { Jornada, Persona } from '../../../types'
import IniciativaCard from './IniciativaCard'

type FilterJornada = 'todos' | Jornada
type FilterPersona = 'todos' | Persona

const JORNADA_OPTIONS: { value: FilterJornada; label: string }[] = [
  { value: 'todos',       label: 'Todos' },
  { value: 'admissao',    label: 'Admissão' },
  { value: 'ciclo-ativo', label: 'Ciclo Ativo' },
  { value: 'offboarding', label: 'Offboarding' },
]

const PERSONA_OPTIONS: { value: FilterPersona; label: string }[] = [
  { value: 'todos',          label: 'Todos' },
  { value: 'worker',         label: 'Worker' },
  { value: 'colaborador-gi', label: 'Colaborador GI' },
  { value: 'cliente',        label: 'Cliente' },
]

function chipClass(active: boolean) {
  return active
    ? 'bg-gi-navy text-white rounded-full px-4 py-1.5 text-xs font-bold transition-all'
    : 'border border-gi-border text-gi-charcoal rounded-full px-4 py-1.5 text-xs font-bold hover:border-gi-navy hover:text-gi-navy transition-all'
}

function IniciativasList() {
  const [filterJornada, setFilterJornada] = useState<FilterJornada>('todos')
  const [filterPersona, setFilterPersona] = useState<FilterPersona>('todos')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const { goTo } = useContext(PresentationContext)

  const filtered = INICIATIVAS.filter(i => {
    const jornadaOk = filterJornada === 'todos' || i.jornada === filterJornada
    const personaOk = filterPersona === 'todos' || i.personas.includes(filterPersona as Persona)
    return jornadaOk && personaOk
  })

  function handleJornadaChange(v: FilterJornada) {
    setFilterJornada(v)
    setExpandedId(null)
  }

  function handlePersonaChange(v: FilterPersona) {
    setFilterPersona(v)
    setExpandedId(null)
  }

  function handleToggle(id: string) {
    setExpandedId(prev => prev === id ? null : id)
  }

  return (
    <div>
      <p className="text-sm text-gi-charcoal mb-6">
        17 iniciativas · {filtered.length} visíveis
      </p>

      <div className="flex gap-3 flex-wrap mb-3">
        {JORNADA_OPTIONS.map(opt => (
          <button key={opt.value} onClick={() => handleJornadaChange(opt.value)}
            className={chipClass(filterJornada === opt.value)}>
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex gap-3 flex-wrap mb-10">
        {PERSONA_OPTIONS.map(opt => (
          <button key={opt.value} onClick={() => handlePersonaChange(opt.value)}
            className={chipClass(filterPersona === opt.value)}>
            {opt.label}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-3 gap-6">
          {filtered.map(i => (
            <IniciativaCard
              key={i.id}
              iniciativa={i}
              isExpanded={expandedId === i.id}
              onToggle={handleToggle}
              onVerTela={() => goTo(5)}
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gi-charcoal text-center py-16">
          Nenhuma iniciativa encontrada para os filtros selecionados.
        </p>
      )}
    </div>
  )
}

export default IniciativasList
