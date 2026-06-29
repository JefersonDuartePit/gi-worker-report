import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { DORES } from '../../data/dores'
import { INICIATIVAS } from '../../data/iniciativas'

interface DorTooltipProps {
  dorId: string
  iniciativaId: string
  children: ReactNode
}

function DorTooltip({ dorId, iniciativaId, children }: DorTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef<HTMLDivElement>(null)
  const dor = DORES.find(d => d.id === dorId)
  const iniciativa = INICIATIVAS.find(i => i.id === iniciativaId)

  function handleEnter() {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (rect) {
      setCoords({ top: rect.top - 8, left: rect.left + rect.width / 2 })
    }
    setIsOpen(true)
  }

  return (
    <div
      ref={triggerRef}
      className="inline-block"
      onMouseEnter={handleEnter}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      {isOpen && dor && createPortal(
        <div
          className="fixed z-[9999] w-64 -translate-x-1/2 -translate-y-full bg-gi-navy text-white rounded-lg p-3 shadow-lg text-xs pointer-events-none"
          style={{ top: coords.top, left: coords.left }}
        >
          <div className="font-bold text-gi-amber mb-1">{dor.id} — {dor.titulo}</div>
          <div className="text-white/80 text-[11px] mb-2">{dor.descricao}</div>
          {iniciativa && (
            <div className="text-white/60 text-[10px] border-t border-white/20 pt-2">
              ↳ Resolve via {iniciativa.id}: {iniciativa.titulo.slice(0, 60)}…
            </div>
          )}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-gi-navy" />
        </div>,
        document.body,
      )}
    </div>
  )
}

export default DorTooltip
