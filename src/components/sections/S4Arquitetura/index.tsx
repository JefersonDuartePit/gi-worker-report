import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { VistaArquitetura } from '../../../types'
import { DIAGRAMA_AS_IS, DIAGRAMA_TO_BE } from '../../../data/arquitetura'
import DiagramaArquitetura from './DiagramaArquitetura'
import TabelaComparativa from './TabelaComparativa'

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function S4Arquitetura() {
  const [vista, setVista] = useState<VistaArquitetura>('as-is')

  return (
    <div className="min-h-screen bg-white py-20 px-12">
      <motion.div variants={sectionVariants} initial="hidden" animate="visible">
        <h2 className="text-4xl font-bold text-gi-navy">Arquitetura As-is / To-be</h2>
        <p className="text-xl text-gi-text mt-3 mb-10">
          Como a jornada do worker funciona hoje — e como deveria funcionar com o Portal
        </p>

        {/* Toggle */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setVista('as-is')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              vista === 'as-is'
                ? 'bg-gi-navy text-white'
                : 'bg-white text-gi-charcoal border border-gi-border hover:border-gi-navy'
            }`}
          >
            As-is — Estado atual
          </button>
          <button
            onClick={() => setVista('to-be')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              vista === 'to-be'
                ? 'bg-gi-blue text-white'
                : 'bg-white text-gi-charcoal border border-gi-border hover:border-gi-blue'
            }`}
          >
            To-be — Visão futura
          </button>
        </div>

        {/* Diagrama */}
        <div className="rounded-xl border border-gi-border p-6 bg-white shadow-sm">
          <p className="text-sm text-gi-charcoal mb-6">
            {vista === 'as-is'
              ? 'O worker depende do Colaborador GI para tudo — sem integração, sem visibilidade, sem autonomia.'
              : 'O Portal do Worker centraliza todos os canais. Worker e Cliente têm autonomia. Colaborador GI tem visão consolidada.'}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={vista}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <DiagramaArquitetura
                diagrama={vista === 'as-is' ? DIAGRAMA_AS_IS : DIAGRAMA_TO_BE}
                vista={vista}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tabela comparativa */}
        <TabelaComparativa />
      </motion.div>
    </div>
  )
}

export default S4Arquitetura
