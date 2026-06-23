import { useContext } from 'react'
import { Home } from 'lucide-react'
import { PresentationContext } from '../../App'

interface HeaderProps {
  activeLabel: string
}

function Header({ activeLabel }: HeaderProps) {
  const { mode, toggle } = useContext(PresentationContext)

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
        <span className="text-sm text-gi-charcoal">{activeLabel}</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="px-3 py-1.5 text-xs border border-gi-border rounded-lg text-gi-charcoal hover:border-gi-navy hover:text-gi-navy transition-all"
        >
          {mode === 'exploration' ? 'Apresentação' : 'Exploração'}
        </button>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gi-blue hover:underline transition-all"
        >
          <Home size={12} />
          Início
        </button>
      </div>
    </header>
  )
}

export default Header
