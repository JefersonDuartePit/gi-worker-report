import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '../../../lib/utils'
import { DORES } from '../../../data/dores'
import type { Persona } from '../../../types'
import DorCard from './DorCard'

type FilterPersona = 'todos' | Persona

interface FilterOption {
  value: FilterPersona
  label: string
  count: number
}

const FILTER_OPTIONS: FilterOption[] = [
  { value: 'todos', label: 'Todos', count: DORES.length },
  {
    value: 'worker',
    label: 'Worker',
    count: DORES.filter(d => d.personas.includes('worker')).length,
  },
  {
    value: 'colaborador-gi',
    label: 'Colaborador GI',
    count: DORES.filter(d => d.personas.includes('colaborador-gi')).length,
  },
  {
    value: 'cliente',
    label: 'Cliente',
    count: DORES.filter(d => d.personas.includes('cliente')).length,
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

function DoresList() {
  const [activeFilter, setActiveFilter] = useState<FilterPersona>('todos')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const doresFiltradas =
    activeFilter === 'todos'
      ? DORES
      : DORES.filter(d => d.personas.includes(activeFilter))

  function handleFilterChange(value: FilterPersona) {
    setActiveFilter(value)
    setExpandedId(null)
  }

  function handleToggle(id: string) {
    setExpandedId(prev => (prev === id ? null : id))
  }

  return (
    <div>
      <div className="flex gap-3 mb-8 flex-wrap">
        {FILTER_OPTIONS.map(({ value, label, count }) => (
          <button
            key={value}
            onClick={() => handleFilterChange(value)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-bold transition-all border',
              activeFilter === value
                ? 'bg-gi-navy text-white border-gi-navy'
                : 'bg-white text-gi-charcoal border-gi-border hover:border-gi-navy hover:text-gi-navy',
            )}
          >
            {label}{' '}
            <span className="font-normal">({count})</span>
          </button>
        ))}
      </div>

      <motion.div
        className="grid grid-cols-1 gap-4 max-w-3xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {doresFiltradas.map(dor => (
            <motion.div
              key={dor.id}
              variants={cardVariants}
              layout
              exit={{ opacity: 0, y: -8, transition: { duration: 0.2 } }}
            >
              <DorCard
                dor={dor}
                isExpanded={expandedId === dor.id}
                onToggle={handleToggle}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default DoresList
