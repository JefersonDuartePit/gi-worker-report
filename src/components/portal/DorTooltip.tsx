import { useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { DORES } from '../../data/dores'
import { INICIATIVAS } from '../../data/iniciativas'

interface DorTooltipProps {
  dorId: string
  iniciativaId: string
  children: ReactNode
  className?: string
}

const TOOLTIP_WIDTH = 256
const TOOLTIP_MIN_HEIGHT = 100
const OFFSET = 8
const EDGE_PADDING = 8

function DorTooltip({ dorId, iniciativaId, children, className = 'inline-block' }: DorTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const [placement, setPlacement] = useState<'top' | 'bottom'>('top')
  const [arrowLeft, setArrowLeft] = useState(128)
  const triggerRef = useRef<HTMLDivElement>(null)
  const dor = DORES.find(d => d.id === dorId)
  const iniciativa = INICIATIVAS.find(i => i.id === iniciativaId)

  function handleEnter() {
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return

    // Horizontal: center on trigger, clamp so tooltip stays within viewport
    const rawLeft = rect.left + rect.width / 2
    const clampedLeft = Math.max(
      TOOLTIP_WIDTH / 2 + EDGE_PADDING,
      Math.min(rawLeft, window.innerWidth - TOOLTIP_WIDTH / 2 - EDGE_PADDING),
    )

    // Vertical: show above when there's enough space, otherwise below
    const showAbove = rect.top - OFFSET >= TOOLTIP_MIN_HEIGHT
    const top = showAbove ? rect.top - OFFSET : rect.bottom + OFFSET

    // Arrow tracks the actual trigger center relative to the (clamped) tooltip
    const rawArrowLeft = TOOLTIP_WIDTH / 2 - (clampedLeft - rawLeft)
    const clampedArrowLeft = Math.max(10, Math.min(rawArrowLeft, TOOLTIP_WIDTH - 10))

    setCoords({ top, left: clampedLeft })
    setPlacement(showAbove ? 'top' : 'bottom')
    setArrowLeft(clampedArrowLeft)
    setIsOpen(true)
  }

  return (
    <div
      ref={triggerRef}
      className={className}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setIsOpen(false)}
    >
      {children}
      {isOpen && dor && createPortal(
        <div
          className="fixed z-[9999] w-64 bg-gi-navy text-white rounded-lg p-3 shadow-lg text-xs pointer-events-none"
          style={{
            top: coords.top,
            left: coords.left,
            transform: `translateX(-50%) ${placement === 'top' ? 'translateY(-100%)' : 'translateY(0)'}`,
          }}
        >
          <div className="font-bold text-gi-amber mb-1">{dor.id} — {dor.titulo}</div>
          <div className="text-white/80 text-[11px] mb-2">{dor.descricao}</div>
          {iniciativa && (
            <div className="text-white/60 text-[10px] border-t border-white/20 pt-2">
              ↳ Resolve via {iniciativa.id}: {iniciativa.titulo.slice(0, 60)}…
            </div>
          )}
          {placement === 'top' ? (
            <div
              className="absolute top-full border-[5px] border-transparent border-t-gi-navy"
              style={{ left: arrowLeft, transform: 'translateX(-50%)' }}
            />
          ) : (
            <div
              className="absolute bottom-full border-[5px] border-transparent border-b-gi-navy"
              style={{ left: arrowLeft, transform: 'translateX(-50%)' }}
            />
          )}
        </div>,
        document.body,
      )}
    </div>
  )
}

export default DorTooltip
