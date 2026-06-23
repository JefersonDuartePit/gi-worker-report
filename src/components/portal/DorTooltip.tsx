import { useState } from 'react'
import type { ReactNode } from 'react'
import { DORES } from '../../data/dores'
import { INICIATIVAS } from '../../data/iniciativas'

interface DorTooltipProps {
  dorId: string
  iniciativaId: string
  children: ReactNode
}

function DorTooltip({ dorId, iniciativaId, children }: DorTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dor = DORES.find(d => d.id === dorId)
  const iniciativa = INICIATIVAS.find(i => i.id === iniciativaId)

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      {isOpen && dor && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-64 bg-gi-navy text-white rounded-lg p-3 shadow-lg text-xs pointer-events-none">
          <div className="font-bold text-gi-amber mb-1">{dor.id} — {dor.titulo}</div>
          <div className="text-white/80 text-[11px] mb-2">{dor.descricao}</div>
          {iniciativa && (
            <div className="text-white/60 text-[10px] border-t border-white/20 pt-2">
              ↳ Resolve via {iniciativa.id}: {iniciativa.titulo.slice(0, 60)}…
            </div>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gi-navy" />
        </div>
      )}
    </div>
  )
}

export default DorTooltip
