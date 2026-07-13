import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../../lib/utils'
import type { Provocacao } from '../../../types'

interface DestinatarioStyle {
  label: string
  className: string
}

const DESTINATARIO_STYLES: Record<Provocacao['destinatario'], DestinatarioStyle> = {
  carol:  { label: 'Para: Carol · TI',     className: 'bg-gi-blue/20 text-gi-comet border border-gi-blue/30' },
  jansen: { label: 'Para: Jansen · CEO',   className: 'bg-gi-amber/20 text-gi-amber border border-gi-amber/30' },
  ambos:  { label: 'Para: Carol + Jansen', className: 'bg-gi-green/20 text-gi-green border border-gi-green/30' },
}

interface ProvocacaoCardProps {
  provocacao: Provocacao
}

function ProvocacaoCard({ provocacao }: ProvocacaoCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { label, className } = DESTINATARIO_STYLES[provocacao.destinatario]

  return (
    <div className="border border-gi-orbit rounded-xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <span
            className={cn(
              'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide mb-3',
              className,
            )}
          >
            {label}
          </span>
          <p className="text-white text-base font-bold leading-snug">{provocacao.pergunta}</p>
        </div>
        <button
          onClick={() => setIsOpen((o) => !o)}
          className="flex-shrink-0 p-1 text-gi-stardust hover:text-white transition-colors"
          aria-label={isOpen ? 'Fechar contexto' : 'Ver contexto'}
        >
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={18} />
          </motion.div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="mt-4 pt-4 text-sm text-gi-comet leading-relaxed border-t border-gi-orbit/50">
              {provocacao.contexto}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProvocacaoCard
