import { useContext } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PresentationContext } from '../../App'
import type { SectionMeta } from '../../types'
import { cn } from '../../lib/utils'

interface SidebarProps {
  sections: SectionMeta[]
  activeId: string
}

function Sidebar({ sections, activeId }: SidebarProps) {
  const { mode, currentStep, next, prev, toggle } = useContext(PresentationContext)

  function scrollTo(id: string) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  if (mode === 'presentation') {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
        <button
          onClick={prev}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gi-navy text-white rounded-lg disabled:opacity-40 hover:bg-gi-blue transition-colors"
        >
          <ChevronLeft size={16} />
          Anterior
        </button>
        <span className="text-sm text-gi-charcoal">
          {currentStep + 1} / {sections.length}
        </span>
        <button
          onClick={next}
          disabled={currentStep === sections.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-gi-navy text-white rounded-lg disabled:opacity-40 hover:bg-gi-blue transition-colors"
        >
          Próximo
          <ChevronRight size={16} />
        </button>
      </div>
    )
  }

  return (
    <aside className="fixed top-[56px] left-0 w-[240px] h-[calc(100vh-56px)] bg-gi-navy flex flex-col z-40">
      <nav className="flex-1 py-6 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => scrollTo(section.id)}
                className={cn(
                  'w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all',
                  activeId === section.id
                    ? 'text-gi-blue border-l-[3px] border-gi-blue bg-white/10 pl-[9px]'
                    : 'text-white/80 hover:text-white hover:bg-white/5',
                )}
              >
                {section.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <button
          onClick={toggle}
          className="w-full px-3 py-2 text-xs text-white/70 hover:text-white border border-white/20 rounded-lg hover:bg-white/5 transition-all"
        >
          {mode === 'exploration' ? 'Modo Apresentação' : 'Modo Exploração'}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
