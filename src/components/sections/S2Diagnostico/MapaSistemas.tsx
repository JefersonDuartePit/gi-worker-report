import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../../lib/utils'
import { SISTEMAS } from '../../../data/sistemas'
import type { StatusSistema } from '../../../types'
import SistemaCard from './SistemaCard'

type FilterStatus = StatusSistema | 'todos'

interface Quadrante {
  status: StatusSistema
  label: string
  headerClass: string
  borderClass: string
  bgClass: string
}

const QUADRANTES: Quadrante[] = [
  {
    status: 'usa',
    label: 'Usa',
    headerClass: 'text-gi-blue',
    borderClass: 'border-gi-blue',
    bgClass: 'bg-blue-50',
  },
  {
    status: 'integra',
    label: 'Integra',
    headerClass: 'text-gi-steel',
    borderClass: 'border-gi-steel',
    bgClass: 'bg-slate-50',
  },
  {
    status: 'substitui',
    label: 'Substitui',
    headerClass: 'text-gi-amber',
    borderClass: 'border-gi-amber',
    bgClass: 'bg-amber-50',
  },
  {
    status: 'nao-toca',
    label: 'Não Toca',
    headerClass: 'text-gi-red',
    borderClass: 'border-gi-red',
    bgClass: 'bg-red-50',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const quadranteVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

const cardContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

function MapaSistemas() {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('todos')

  return (
    <div>
      <div className="flex gap-3 mb-8 flex-wrap">
        <button
          onClick={() => setActiveFilter('todos')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-bold transition-all border',
            activeFilter === 'todos'
              ? 'bg-gi-navy text-white border-gi-navy'
              : 'bg-white text-gi-charcoal border-gi-border hover:border-gi-navy hover:text-gi-navy',
          )}
        >
          Todos
        </button>
        {QUADRANTES.map(({ status, label, headerClass }) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-bold transition-all border',
              activeFilter === status
                ? 'bg-gi-navy text-white border-gi-navy'
                : cn('bg-white border-gi-border hover:border-gi-navy hover:text-gi-navy', headerClass),
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <motion.div
        className="grid grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {QUADRANTES.map(({ status, label, headerClass, borderClass, bgClass }) => {
          const sistemas = SISTEMAS.filter((s) => s.status === status)
          const isDimmed = activeFilter !== 'todos' && activeFilter !== status

          return (
            <motion.div
              key={status}
              variants={quadranteVariants}
              className={cn(
                'rounded-xl border-2 p-4 transition-opacity duration-300',
                bgClass,
                borderClass,
                isDimmed && 'opacity-30',
              )}
            >
              <h3 className={cn('text-xs font-bold uppercase tracking-widest mb-4', headerClass)}>
                {label}{' '}
                <span className="font-normal normal-case tracking-normal text-gi-charcoal">
                  ({sistemas.length})
                </span>
              </h3>
              <motion.div
                className="flex flex-col gap-3"
                variants={cardContainerVariants}
                initial="hidden"
                animate="visible"
              >
                {sistemas.map((sistema) => (
                  <motion.div key={sistema.id} variants={cardVariants}>
                    <SistemaCard sistema={sistema} />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

export default MapaSistemas
