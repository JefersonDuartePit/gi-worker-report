import { useContext } from 'react'
import { ChevronLeft } from 'lucide-react'
import { PresentationContext } from '../../App'

interface HeaderProps {
  activeLabel: string
  activeNum: number
  onGalaxyClick: () => void
}

function Header({ activeLabel, activeNum, onGalaxyClick }: HeaderProps) {
  const { mode, toggle } = useContext(PresentationContext)
  const numFormatted = String(activeNum).padStart(2, '0')

  return (
    <header className="fixed top-0 left-0 right-0 h-[56px] bg-white border-b border-gi-border flex items-center justify-between px-6 z-50">
      <div className="flex items-center gap-3">
        <img
          src="/src/assets/logo-gi-group.png"
          alt="GI Group"
          className="h-8 object-contain"
          onError={(e) => {
            const target = e.currentTarget
            target.style.display = 'none'
            const fallback = target.nextElementSibling as HTMLElement | null
            if (fallback) fallback.style.display = 'block'
          }}
        />
        <span className="hidden text-gi-navy font-bold text-sm">GI Group</span>
        <span className="text-gi-border mx-2">|</span>
        <span className="text-sm text-gi-charcoal">
          <span className="text-gi-steel">{numFormatted}</span>
          {' · '}
          {activeLabel}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="px-3 py-1.5 text-xs border border-gi-border rounded-lg text-gi-charcoal hover:border-gi-navy hover:text-gi-navy transition-all"
        >
          {mode === 'exploration' ? 'Apresentação' : 'Exploração'}
        </button>
        <button
          onClick={onGalaxyClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gi-blue text-white rounded-lg hover:bg-gi-navy transition-all"
        >
          <ChevronLeft size={12} />
          Galáxia
        </button>
      </div>
    </header>
  )
}

export default Header
